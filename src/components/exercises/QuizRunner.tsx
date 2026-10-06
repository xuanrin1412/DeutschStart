import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Question } from '@/types/models';
import { isCorrect } from '@/services/quiz';
import { audioService } from '@/services/audio/audioService';
import { useProgress } from '@/context/ProgressContext';
import { useAutoSpeak } from '@/hooks/useAutoSpeak';
import { AudioButton } from '@/components/ui/AudioButton';
import { WordImage } from '@/components/ui/WordImage';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SentenceBuilder } from './SentenceBuilder';
import { EmptyState } from '@/components/ui/States';

interface Props {
  questions: Question[];
  /** Record answers into progress / mistake book (default true). */
  record?: boolean;
  onFinish?: (correct: number, total: number) => void;
  onRestart?: () => void;
  onAnswered?: (q: Question, correct: boolean) => void;
  finishExtra?: ReactNode;
  compact?: boolean;
}

const TYPE_LABEL: Record<Question['type'], string> = {
  'multiple-choice': 'Trắc nghiệm',
  article: 'Mạo từ',
  listening: 'Luyện nghe',
  image: 'Hình ảnh',
  'fill-blank': 'Điền từ',
  translation: 'Dịch câu',
  typing: 'Tự gõ',
  ordering: 'Sắp xếp câu',
};

export function QuizRunner({ questions, record = true, onFinish, onRestart, onAnswered, finishExtra, compact }: Props) {
  const { recordAnswer } = useProgress();
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const continueRef = useRef<HTMLButtonElement>(null);
  const [autoSpeak] = useAutoSpeak();

  const q = questions[index];
  const listening = !!q && (q.type === 'listening' || (q.category === 'listening' && (q.type === 'fill-blank' || q.type === 'typing')));
  const typing = !!q && (q.type === 'translation' || q.type === 'typing');
  const inputLang = q?.inputLang ?? 'de';
  const displayLang = q?.displayLang ?? (q?.type === 'translation' ? 'vi' : 'de');

  // Listening questions play automatically; others too when auto-speak is on and the question asks for it.
  useEffect(() => {
    if (q && q.audioText && (listening || (autoSpeak && q.speakOnShow))) {
      const id = setTimeout(() => void audioService.play(q.audioText!).catch(() => {}), 250);
      return () => clearTimeout(id);
    }
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (result !== null) continueRef.current?.focus();
  }, [result]);

  const answer = (value: string, ok = isCorrect(q, value)) => {
    if (result !== null) return;
    setChosen(value);
    setResult(ok);
    if (ok) setScore((s) => s + 1);
    if (record) recordAnswer(q, ok, value);
    onAnswered?.(q, ok);
    // Hearing the right word straight after answering helps it stick.
    if (autoSpeak && q.speakOnAnswer && q.audioText) void audioService.play(q.audioText).catch(() => {});
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setDone(true);
      onFinish?.(score, questions.length);
      return;
    }
    setIndex((i) => i + 1);
    setChosen(null);
    setTyped('');
    setResult(null);
    setShowHint(false);
  };

  const restart = () => {
    if (onRestart) return onRestart();
    setIndex(0);
    setChosen(null);
    setTyped('');
    setResult(null);
    setScore(0);
    setDone(false);
  };

  // Keyboard: 1–4 choose an option.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!q?.options || result !== null || done) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) answer(q.options[n - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!questions.length) return <EmptyState icon="📝" title="Chưa có câu hỏi nào">Hãy học thêm từ vựng để mở khóa bài luyện tập.</EmptyState>;

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-done card">
        <div className="big-emoji" aria-hidden="true">
          {pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}
        </div>
        <h3>
          Bạn trả lời đúng {score}/{questions.length} câu
        </h3>
        <ProgressBar value={pct} label="Tỉ lệ đúng" tone={pct >= 80 ? 'good' : 'brand'} showValue />
        <p className="muted">{pct >= 80 ? 'Tuyệt vời! Tiếp tục phát huy nhé.' : pct >= 50 ? 'Khá tốt! Ôn lại những câu sai để nhớ lâu hơn.' : 'Đừng nản – sai là cách để học. Các câu sai đã được lưu vào Sổ lỗi sai.'}</p>
        <div className="row gap-sm wrap center">
          <button className="btn btn-primary" onClick={restart}>
            Làm lại
          </button>
          {record && score < questions.length && (
            <Link className="btn btn-ghost" to="/mistakes">
              📕 Xem sổ lỗi sai
            </Link>
          )}
          {finishExtra}
        </div>
      </div>
    );
  }

  const articleWord = q.type === 'article' ? q.display?.replace('___ ', '') : undefined;

  return (
    <div className={`quiz${compact ? ' quiz-compact' : ''}`}>
      <div className="quiz-top">
        <span className="badge">{q.round ?? TYPE_LABEL[q.type]}</span>
        <span className="muted small">
          Câu {index + 1}/{questions.length}
        </span>
      </div>
      <ProgressBar value={(index / questions.length) * 100} label="Tiến độ bài quiz" size="sm" />

      <div className="quiz-body">
        <h3 className="quiz-prompt">{q.prompt}</h3>

        {q.image && q.type !== 'article' && (
          <div className="quiz-image">
            <WordImage image={q.image} size="xl" />
          </div>
        )}

        {listening && q.audioText && (
          <div className="row gap-sm center">
            <AudioButton text={q.audioText} size="lg" label="Nghe lại" variant="pill" />
            <AudioButton text={q.audioText} size="lg" slow label="Chậm" variant="pill" />
          </div>
        )}

        {q.display && q.type !== 'ordering' && (
          <p className={`quiz-display${displayLang === 'vi' ? ' is-vi' : ''}`} lang={displayLang}>
            {q.type === 'article' && q.image && <WordImage image={q.image} size="md" />} {q.display}
            {(q.type === 'multiple-choice' || q.type === 'typing') && displayLang === 'de' && q.audioText && !q.display.includes('___') && <AudioButton text={q.audioText} size="sm" />}
          </p>
        )}

        {q.options && q.type !== 'ordering' && (
          <div className={`options${q.type === 'article' ? ' options-article' : ''}`}>
            {q.options.map((opt, i) => {
              const state = result === null ? '' : opt === q.answer ? ' is-correct' : opt === chosen ? ' is-wrong' : ' is-dim';
              return (
                <button key={opt} type="button" className={`option${state}${q.type === 'article' ? ` article-${opt}` : ''}`} onClick={() => answer(opt)} disabled={result !== null} lang={q.type === 'multiple-choice' && !q.display ? 'de' : undefined}>
                  <kbd aria-hidden="true">{i + 1}</kbd>
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {typing && (
          <form
            className="translate-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (typed.trim()) answer(typed.trim());
            }}
          >
            <label htmlFor="translate-input" className="sr-only">
              {inputLang === 'vi' ? 'Câu trả lời tiếng Việt' : 'Câu trả lời tiếng Đức'}
            </label>
            <input
              key={index}
              id="translate-input"
              className="input"
              lang={inputLang}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={inputLang === 'vi' ? 'Nhập nghĩa tiếng Việt…' : q.type === 'typing' ? 'Nhập từ tiếng Đức…' : 'Nhập câu tiếng Đức…'}
              disabled={result !== null}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              autoFocus
            />
            <div className="row gap-sm wrap umlaut-keys" aria-label="Chèn ký tự đặc biệt">
              {inputLang === 'de' && ['ä', 'ö', 'ü', 'ß'].map((c) => (
                <button key={c} type="button" className="btn btn-ghost btn-sm" onClick={() => setTyped((t) => t + c)} disabled={result !== null}>
                  {c}
                </button>
              ))}
              {q.hint && result === null && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowHint(true)} disabled={showHint}>
                  💡 Gợi ý
                </button>
              )}
              <button className="btn btn-primary" type="submit" disabled={!typed.trim() || result !== null}>
                Kiểm tra
              </button>
            </div>
            {showHint && q.hint && result === null && (
              <p className="quiz-hint" role="status" lang={inputLang}>
                💡 {q.hint}
              </p>
            )}
          </form>
        )}

        {q.type === 'ordering' && q.tokens && (
          <SentenceBuilder key={q.id} tokens={q.tokens} vi={q.display ?? ''} punctuation={q.answer.slice(-1).match(/[.?!]/) ? q.answer.slice(-1) : '.'} alternatives={q.accepted} structure={q.explanation} onResult={(ok, a) => answer(a, ok)} onContinue={next} continueLabel={index + 1 >= questions.length ? 'Xem kết quả' : 'Tiếp tục'} />
        )}
      </div>

      {result !== null && q.type !== 'ordering' && (
        <div className={`feedback ${result ? 'feedback-good' : 'feedback-bad'}`} role="status">
          {q.type === 'article' ? (
            <p className="feedback-title" lang="de">
              {result ? (
                <>✅ <span className={`article-${q.answer}`}>{cap(q.answer)}</span> {articleWord}</>
              ) : (
                <>
                  ❌ <s>{cap(chosen ?? '')} {articleWord}</s> → ✅ <span className={`article-${q.answer}`}>{cap(q.answer)}</span> {articleWord}
                </>
              )}
            </p>
          ) : (
            <p className="feedback-title">{result ? '✅ Chính xác!' : '❌ Chưa đúng'}</p>
          )}
          {!result && q.type !== 'article' && (
            <p>
              Đáp án đúng: <strong>{q.answer}</strong>
            </p>
          )}
          {q.explanation && <p className="muted">{q.explanation}</p>}
          <div className="row gap-sm wrap center-y">
            {q.audioText && <AudioButton text={q.type === 'article' ? `${q.answer} ${articleWord}` : q.audioText} size="sm" label="Nghe" variant="pill" />}
            <button ref={continueRef} className="btn btn-primary" onClick={next}>
              {index + 1 >= questions.length ? 'Xem kết quả' : 'Tiếp tục'} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
