import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@/context/ProgressContext';
import { normalizeAnswer } from '@/services/quiz';

/** How many correct copies finish the drill. */
const REPEATS = 5;
/** The last rounds hide the word: typing it from memory is what makes the spelling stick. */
const FROM_MEMORY = 2;

/** What the learner types for a lemma: the first spelling, without notes in brackets. Null when it has placeholders ("Wie geht es …?", "ein-"). */
function typingTarget(lemma: string): string | null {
  const t = lemma.replace(/\s*\(.*\)$/, '').split(' / ')[0].trim();
  return !t || /[…/]|-$/.test(t) ? null : t;
}

/** Spacing, typographic apostrophes and end punctuation never count as mistakes; case and ä/ö/ü/ß do. */
const clean = (s: string) => s.trim().replace(/\s+/g, ' ').replace(/[’`´]/g, "'").replace(/[.!?]+$/, '');

function check(typed: string, target: string): { ok: boolean; text: string } {
  const a = clean(typed);
  const b = clean(target);
  if (a === b) return { ok: true, text: '' };
  if (a.toLowerCase() === b.toLowerCase()) return { ok: false, text: 'Gần đúng! Chú ý chữ hoa – chữ thường (danh từ tiếng Đức luôn viết hoa chữ cái đầu).' };
  if (normalizeAnswer(a) === normalizeAnswer(b)) return { ok: false, text: 'Gần đúng! Hãy gõ đúng chữ ä ö ü ß (bấm các nút bên dưới) thay vì ae, oe, ue, ss.' };
  return { ok: false, text: 'Chưa đúng – so sánh từng chữ rồi gõ lại nhé.' };
}

/**
 * "Gõ lại từ mới": the learner types a new word REPEATS times – copying it first, then from memory.
 * The skip button turns the drill off for this word everywhere (saved in progress, undoable).
 */
export function TypeDrill({ id, lemma, meaning }: { id: string; lemma: string; meaning: string }) {
  const { progress, setTypingSkipped } = useProgress();
  const [count, setCount] = useState(0);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [peek, setPeek] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  // The control that was clicked disappears (skip, turn back on, last copy): keep keyboard focus on what replaces it.
  const moveFocus = useRef(false);
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (inputRef.current ?? actionRef.current)?.focus();
  });

  const target = typingTarget(lemma);
  if (!target) return null;

  if (progress.typingSkipped?.[id])
    return (
      <div className="type-drill is-off">
        <p className="small muted">⌨️ Bạn đã tắt phần gõ lại cho từ này.</p>
        <button
          ref={actionRef}
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            moveFocus.current = true;
            setTypingSkipped(id, false);
          }}
        >
          Bật lại
        </button>
      </div>
    );

  const done = count >= REPEATS;
  const fromMemory = !done && count >= REPEATS - FROM_MEMORY;
  const keys = ['ä', 'ö', 'ü', 'ß', ...['Ä', 'Ö', 'Ü'].filter((c) => target.includes(c))];
  const article = /^(der|die|das) /.exec(target)?.[1];

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
      // From memory and wrong: show the word so the next try is a correct copy, not a guess.
      if (fromMemory && !peek) setPeek(true);
      setFeedback(result);
      return;
    }
    const n = count + 1;
    setCount(n);
    setValue('');
    setPeek(false);
    if (n >= REPEATS) moveFocus.current = true;
    setFeedback({ ok: true, text: n >= REPEATS ? '' : n === REPEATS - FROM_MEMORY ? `✓ Đúng rồi! (${n}/${REPEATS}) Giờ thử gõ theo trí nhớ.` : `✓ Đúng rồi! (${n}/${REPEATS})` });
  };

  return (
    <section className="type-drill" aria-labelledby={`drill-${id}`}>
      <div className="row gap-sm center-y space-between wrap">
        <h3 id={`drill-${id}`} className="h4">
          ⌨️ Gõ lại từ mới
        </h3>
        <ol className="drill-pips" aria-hidden="true">
          {Array.from({ length: REPEATS }, (_, i) => (
            <li key={i} className={`${i < count ? 'is-done' : ''}${i >= REPEATS - FROM_MEMORY ? ' is-memory' : ''}`} />
          ))}
        </ol>
      </div>

      {!done && (
        <form
          className="translate-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) submit();
          }}
        >
          <p className="drill-prompt">
            <span className="muted small">
              Lần {count + 1}/{REPEATS} ·{' '}
            </span>
            {fromMemory && !peek ? (
              <>
                Gõ <strong>theo trí nhớ</strong> từ có nghĩa “{meaning}”{' '}
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setPeek(true);
                    focusInput();
                  }}
                >
                  👀 Xem từ
                </button>
              </>
            ) : (
              <>
                Chép lại:{' '}
                <strong className="drill-model" lang="de">
                  {article ? (
                    <>
                      <span className={`article-${article}`}>{article}</span>
                      {target.slice(article.length)}
                    </>
                  ) : (
                    target
                  )}
                </strong>
              </>
            )}
          </p>
          <label htmlFor={`drill-input-${id}`} className="sr-only">
            Gõ lại từ tiếng Đức, lần {count + 1} trên {REPEATS}
          </label>
          <input
            ref={inputRef}
            id={`drill-input-${id}`}
            className="input"
            lang="de"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Gõ từ tiếng Đức…"
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
              🎉 Bạn đã gõ đúng <strong lang="de">{target}</strong> {REPEATS} lần!
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
            🔁 Gõ thêm {REPEATS} lần
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            moveFocus.current = true;
            setTypingSkipped(id, true);
          }}
        >
          🚫 Không cần gõ lại từ này
        </button>
      </div>
    </section>
  );
}
