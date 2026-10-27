import { useEffect, useRef, useState } from 'react';
import type { Question, Vocabulary } from '@/types/models';
import { useProgress, skillOf } from '@/context/ProgressContext';
import { useSpeakOnType } from '@/hooks/useSetting';
import { audioService } from '@/services/audio/audioService';
import { fullWord, normalizeAnswer } from '@/services/quiz';
import { AudioButton } from '@/components/ui/AudioButton';
import { SpeakOnTypeSwitch } from '@/components/ui/AutoSpeakSwitch';

type Kind = 'word' | 'sentence';

/** Correct copies per drill, and how many of the last ones are typed from memory. */
const REPEATS: Record<Kind, number> = { word: 5, sentence: 3 };
const FROM_MEMORY: Record<Kind, number> = { word: 2, sentence: 1 };
/** After a quiz answer the word was just shown, so the drill is shorter and only copies. */
const QUIZ_REPEATS: Record<Kind, number> = { word: 3, sentence: 2 };

/**
 * What the learner types. Words: the first spelling of a lemma, without notes in brackets
 * ("mein / meine" → "mein"). Null when the text has placeholders ("Wie geht es …?", "ein-").
 */
function typingTarget(text: string, kind: Kind): string | null {
  const t = kind === 'word' ? text.replace(/\s*\(.*\)$/, '').split(' / ')[0].trim() : text.trim();
  if (!t || /…|___/.test(t)) return null;
  return kind === 'word' && /\/|-$/.test(t) ? null : t;
}

/** Spacing, punctuation and typographic quotes never count as mistakes; case and ä/ö/ü/ß do. */
const words = (s: string) =>
  s
    .replace(/[’`´]/g, "'")
    .replace(/[.,!?;:"„“”«»–—]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && w !== '-');

function check(typed: string, target: string): { ok: boolean; text: string } {
  const got = words(typed);
  const want = words(target);
  const i = want.findIndex((w, k) => got[k] !== w);
  if (i === -1) return got.length === want.length ? { ok: true, text: '' } : { ok: false, text: `Thừa: “${got.slice(want.length).join(' ')}”.` };
  if (got[i] === undefined) return { ok: false, text: `Còn thiếu: “${want.slice(i).join(' ')}”.` };
  const where = want.length > 1 ? `Từ thứ ${i + 1}` : 'Từ này';
  const diff = `“${got[i]}” → “${want[i]}”`;
  if (got[i].toLowerCase() === want[i].toLowerCase()) return { ok: false, text: `Gần đúng! ${where}: chú ý chữ hoa – chữ thường (${diff}).` };
  if (normalizeAnswer(got[i]) === normalizeAnswer(want[i])) return { ok: false, text: `Gần đúng! ${where}: hãy gõ đúng chữ ä ö ü ß (${diff}) – bấm các nút bên dưới.` };
  return { ok: false, text: `${where} chưa đúng: ${diff}.` };
}

const isSentence = (t: string) => /\s/.test(t) && (/[.!?]$/.test(t) || t.split(/\s+/).length >= 3);

/**
 * What to retype after a quiz answer: the word the question is about, or its German text
 * (a phrase or sentence). Letters and sounds have nothing worth retyping.
 */
export function quizDrill(q: Question, word?: Vocabulary): DrillProps | null {
  if (word) return { text: fullWord(word), url: word.audio?.url, meaning: word.meaning, kind: 'word', skipId: word.id };
  if (!q.audioText || skillOf(q) === 'pronunciation') return null;
  return { text: q.audioText };
}

interface DrillProps {
  /** German text: a lemma ("die Katze", "mein / meine") or a whole sentence. */
  text: string;
  /** Recorded audio for `text`, when there is one. */
  url?: string;
  /** Vietnamese meaning or translation – the prompt for the rounds typed from memory (none without it). */
  meaning?: string;
  /** Words: 5 copies, sentences: 3. Default: guessed from the text (punctuation or 3+ words = sentence). */
  kind?: Kind;
  /**
   * Closed behind "⌨️ Gõ lại câu này" until the learner opens it, so pages with many sentences stay light
   * (default for sentences). Open drills are for one word at a time and can be turned off per word.
   */
  onDemand?: boolean;
  /** Key for turning the drill off: the vocabulary id, so a lesson and a quiz agree. Default: the typed text. */
  skipId?: string;
}

interface Props extends DrillProps {
  /** Quiz feedback: shorter, copies only, input focused, hidden once the word is turned off. */
  inQuiz?: boolean;
  /** Quiz: Enter on the empty input moves on to the next question. */
  onContinue?: () => void;
  /** Quiz: the drill was finished or turned off – put focus back on "Tiếp tục". */
  onExit?: () => void;
}

/**
 * "Gõ lại": the learner types a German word or sentence a few times – copying it first,
 * then from memory – and hears it after every correct copy (switch "Tự phát âm khi gõ").
 */
export function TypeDrill({ text, url, meaning, kind = isSentence(text) ? 'sentence' : 'word', onDemand = kind === 'sentence', skipId, inQuiz, onContinue, onExit }: Props) {
  const { progress, setTypingSkipped } = useProgress();
  const [speak] = useSpeakOnType();
  const [open, setOpen] = useState(!onDemand);
  const [count, setCount] = useState(0);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [peek, setPeek] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  // The control that was clicked disappears (open, close, skip, last copy): keep keyboard focus on what replaces it.
  const moveFocus = useRef(false);
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (inputRef.current ?? actionRef.current)?.focus();
  });
  // Quiz: focus the input once the feedback is shown. A timeout so that it wins over the quiz focusing
  // "Tiếp tục", and so the key that answered the question (1–4, Enter) is not typed into the drill.
  useEffect(() => {
    if (!inQuiz) return;
    const id = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const target = typingTarget(text, kind);
  if (!target) return null;
  const key = skipId ?? target;
  const repeats = inQuiz ? QUIZ_REPEATS[kind] : REPEATS[kind];
  const fromMemoryRounds = inQuiz || !meaning ? 0 : FROM_MEMORY[kind];
  const noun = kind === 'word' ? 'từ' : 'câu';

  if (!onDemand && progress.typingSkipped?.[key]) {
    if (inQuiz) return null;
    return (
      <div className="type-drill is-off">
        <p className="small muted">⌨️ Bạn đã tắt phần gõ lại cho {noun} này.</p>
        <button
          ref={actionRef}
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            moveFocus.current = true;
            setTypingSkipped(key, false);
          }}
        >
          Bật lại
        </button>
      </div>
    );
  }

  if (!open)
    return (
      <button
        ref={actionRef}
        type="button"
        className="btn btn-ghost btn-sm drill-open"
        onClick={() => {
          moveFocus.current = true;
          setOpen(true);
        }}
      >
        ⌨️ Gõ lại {noun} này
      </button>
    );

  const done = count >= repeats;
  const fromMemory = !done && count >= repeats - fromMemoryRounds;
  const keys = ['ä', 'ö', 'ü', 'ß', ...['Ä', 'Ö', 'Ü'].filter((c) => target.includes(c))];
  const article = kind === 'word' ? /^(der|die|das) /.exec(target)?.[1] : undefined;
  const audio = { text: target, url: target === text.trim() ? url : undefined };
  const titleId = `drill-${kind}-${key.replace(/\W+/g, '-')}`;

  const insert = (c: string) => {
    const el = inputRef.current;
    const at = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? at;
    setValue(value.slice(0, at) + c + value.slice(end));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(at + 1, at + 1);
    });
  };

  const focusInput = () => requestAnimationFrame(() => inputRef.current?.focus());

  const submit = () => {
    const result = check(value, target);
    if (!result.ok) {
      // From memory and wrong: show the text so the next try is a correct copy, not a guess.
      if (fromMemory && !peek) setPeek(true);
      setFeedback(result);
      return;
    }
    if (speak) void audioService.play(audio).catch(() => {});
    const n = count + 1;
    setCount(n);
    setValue('');
    setPeek(false);
    if (n >= repeats) {
      if (onExit) onExit();
      else moveFocus.current = true;
    }
    setFeedback({ ok: true, text: n >= repeats ? '' : fromMemoryRounds && n === repeats - fromMemoryRounds ? `✓ Đúng rồi! (${n}/${repeats}) Giờ thử gõ theo trí nhớ.` : `✓ Đúng rồi! (${n}/${repeats})` });
  };

  return (
    <section className={`type-drill${inQuiz ? ' in-quiz' : ''}`} aria-labelledby={titleId}>
      <div className="drill-head">
        <p id={titleId} className="h4">
          ⌨️ {kind === 'sentence' ? 'Gõ lại câu' : inQuiz ? 'Gõ lại từ' : 'Gõ lại từ mới'}
        </p>
        <ol className="drill-pips" aria-hidden="true">
          {Array.from({ length: repeats }, (_, i) => (
            <li key={i} className={`${i < count ? 'is-done' : ''}${i >= repeats - fromMemoryRounds ? ' is-memory' : ''}`} />
          ))}
        </ol>
        <SpeakOnTypeSwitch className="small" />
      </div>

      {!done && (
        <form
          className="translate-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) submit();
          }}
        >
          <div className="drill-prompt">
            <span className="muted small">
              Lần {count + 1}/{repeats} ·{' '}
            </span>
            {fromMemory && !peek ? (
              <>
                Gõ <strong>theo trí nhớ</strong> {kind === 'word' ? `từ có nghĩa “${meaning}”` : `câu: “${meaning}”`}{' '}
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setPeek(true);
                    focusInput();
                  }}
                >
                  👀 Xem {noun}
                </button>
              </>
            ) : (
              <>
                Chép lại:{' '}
                <strong className={`drill-model${kind === 'sentence' ? ' is-sentence' : ''}`} lang="de">
                  {article ? (
                    <>
                      <span className={`article-${article}`}>{article}</span>
                      {target.slice(article.length)}
                    </>
                  ) : (
                    target
                  )}
                </strong>{' '}
                <AudioButton text={audio.text} url={audio.url} size="sm" />
              </>
            )}
          </div>
          <label htmlFor={`${titleId}-input`} className="sr-only">
            Gõ lại {noun} tiếng Đức, lần {count + 1} trên {repeats}
          </label>
          <input
            ref={inputRef}
            id={`${titleId}-input`}
            className="input"
            lang="de"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              // The disabled "Kiểm tra" button blocks Enter from submitting an empty form, so handle it here.
              if (e.key === 'Enter' && !value.trim() && onContinue) {
                e.preventDefault();
                onContinue();
              }
            }}
            placeholder={`Gõ ${noun} tiếng Đức…${onContinue ? ' (để trống + Enter = câu tiếp)' : ''}`}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <div className="row gap-sm wrap umlaut-keys" aria-label="Chèn ký tự đặc biệt">
            {keys.map((c) => (
              <button key={c} type="button" className="btn btn-ghost btn-sm" onClick={() => insert(c)}>
                {c}
              </button>
            ))}
            <button className="btn btn-primary btn-sm" type="submit" disabled={!value.trim()}>
              Kiểm tra
            </button>
          </div>
        </form>
      )}

      <div className="drill-foot">
        <p className={`drill-feedback${done || feedback?.ok ? ' is-good' : feedback ? ' is-bad' : ''}`} role="status">
          {done ? (
            <>
              🎉 Bạn đã gõ đúng {kind === 'word' ? <strong lang="de">{target}</strong> : 'câu này'} {repeats} lần!
            </>
          ) : (
            feedback?.text
          )}
        </p>
        {done && (
          <button
            ref={actionRef}
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setCount(0);
              setFeedback(null);
              focusInput();
            }}
          >
            🔁 Gõ thêm {repeats} lần
          </button>
        )}
        {!onDemand ? (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setTypingSkipped(key, true);
              if (onExit) onExit();
              else moveFocus.current = true;
            }}
          >
            🚫 Không cần gõ lại {noun} này
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              moveFocus.current = true;
              setOpen(false);
            }}
          >
            ✕ Đóng
          </button>
        )}
      </div>
    </section>
  );
}
