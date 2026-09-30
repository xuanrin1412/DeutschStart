import { useMemo, useState, type DragEvent } from 'react';
import type { SentenceToken } from '@/types/models';
import { ROLE_LABELS } from '@/constants';
import { normalizeAnswer, shuffle } from '@/services/quiz';
import { AudioButton } from '@/components/ui/AudioButton';

interface Props {
  tokens: SentenceToken[]; // correct order
  punctuation?: string;
  vi: string;
  structure?: string;
  alternatives?: string[];
  onResult?: (correct: boolean, answer: string) => void;
  /** Called when the learner presses "Tiếp tục" after a result. */
  onContinue?: () => void;
  continueLabel?: string;
}

interface Tile {
  id: number;
  token: SentenceToken;
}

export function SentenceBuilder({ tokens, punctuation = '.', vi, structure, alternatives = [], onResult, onContinue, continueLabel = 'Tiếp tục' }: Props) {
  const tiles = useMemo<Tile[]>(() => {
    const base = tokens.map((token, id) => ({ id, token }));
    let s = shuffle(base);
    // Avoid presenting the solution already solved.
    for (let i = 0; i < 5 && s.every((t, idx) => t.id === idx) && s.length > 1; i++) s = shuffle(base);
    return s;
  }, [tokens]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [result, setResult] = useState<null | boolean>(null);
  const [dragId, setDragId] = useState<number | null>(null);

  const byId = (id: number) => tiles.find((t) => t.id === id)!;
  const pool = tiles.filter((t) => !placed.includes(t.id));
  const answerText = placed.map((id) => byId(id).token.text).join(' ');
  const correctText = tokens.map((t) => t.text).join(' ') + punctuation;
  const locked = result !== null;

  const place = (id: number, beforeId?: number) => {
    if (locked) return;
    setPlaced((p) => {
      const without = p.filter((x) => x !== id);
      if (beforeId === undefined || beforeId === id) return [...without, id];
      const idx = without.indexOf(beforeId);
      return [...without.slice(0, idx), id, ...without.slice(idx)];
    });
  };
  const unplace = (id: number) => !locked && setPlaced((p) => p.filter((x) => x !== id));

  const check = () => {
    const ok = [correctText, ...alternatives].some((c) => normalizeAnswer(c) === normalizeAnswer(answerText));
    setResult(ok);
    onResult?.(ok, answerText + punctuation);
  };

  const reset = () => {
    setPlaced([]);
    setResult(null);
  };

  const onDropZone = (e: DragEvent, beforeId?: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragId !== null) place(dragId, beforeId);
    setDragId(null);
  };

  return (
    <div className="builder">
      <p className="builder-vi">
        <span className="muted">Dịch câu:</span> <strong>{vi}</strong>
      </p>

      <div
        className={`builder-answer${result === true ? ' is-correct' : result === false ? ' is-wrong' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDropZone(e)}
        aria-label="Câu trả lời của bạn"
        role="group"
      >
        {placed.length === 0 && <span className="muted builder-hint">Kéo thả hoặc bấm vào các từ bên dưới…</span>}
        {placed.map((id) => (
          <button
            key={id}
            type="button"
            className="token token-placed"
            draggable={!locked}
            onDragStart={() => setDragId(id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDropZone(e, id)}
            onClick={() => unplace(id)}
            aria-label={`${byId(id).token.text} – bấm để bỏ ra`}
            disabled={locked}
          >
            {byId(id).token.text}
          </button>
        ))}
        {placed.length > 0 && <span className="builder-punct">{punctuation}</span>}
      </div>

      <div className="builder-pool" role="group" aria-label="Các từ để ghép" onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
        e.preventDefault();
        if (dragId !== null) unplace(dragId);
        setDragId(null);
      }}>
        {pool.map((t) => (
          <button key={t.id} type="button" className="token" draggable={!locked} onDragStart={() => setDragId(t.id)} onClick={() => place(t.id)} disabled={locked}>
            {t.token.text}
          </button>
        ))}
      </div>

      {result === null && (
        <div className="row gap-sm">
          <button className="btn btn-primary" onClick={check} disabled={pool.length > 0}>
            Kiểm tra
          </button>
          {placed.length > 0 && (
            <button className="btn btn-ghost" onClick={reset}>
              Làm lại
            </button>
          )}
        </div>
      )}

      {result !== null && (
        <div className={`feedback ${result ? 'feedback-good' : 'feedback-bad'}`} role="status">
          <p className="feedback-title">{result ? '✅ Chính xác!' : '❌ Chưa đúng'}</p>
          <div className="row gap-sm wrap center-y">
            <strong lang="de" className="de-sentence">
              {correctText}
            </strong>
            <AudioButton text={correctText} size="sm" />
            <AudioButton text={correctText} size="sm" slow />
          </div>
          <div className="structure" aria-label="Cấu trúc câu">
            {tokens.map((t, i) => (
              <span key={i} className={`chip role-${t.role}`}>
                <span lang="de">{t.text}</span>
                <small>{ROLE_LABELS[t.role]}</small>
              </span>
            ))}
          </div>
          {structure && <p className="muted small">📐 {structure}</p>}
          <div className="row gap-sm">
            {!result && (
              <button className="btn btn-ghost" onClick={reset}>
                Thử lại
              </button>
            )}
            {onContinue && (
              <button className="btn btn-primary" onClick={onContinue} autoFocus>
                {continueLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
