import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Lexeme } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { analyze, wordStatus, type Segment, type WordStatus } from '@/services/lexicon';
import { knownLexemes } from '@/services/curriculum';
import { AudioButton } from '@/components/ui/AudioButton';

type WordSeg = Extract<Segment, { kind: 'word' }>;

const STATUS_LABEL: Record<WordStatus, string> = {
  known: '✓ Đã học',
  lesson: '✱ Từ mới của bài này',
  gloss: '💬 Giải thích ngay tại đây',
  unknown: '🆕 Chưa học',
  unmapped: '🆕 Chưa có trong từ điển',
  name: 'Tên riêng',
};

interface Props {
  text: string;
  /** Words taught in the current lesson: shown as "new in this lesson", not as unknown. */
  lessonNew?: Set<string>;
  /** Inline meanings for words not taught yet ({ Herr: "ông" }). */
  gloss?: Record<string, string>;
  className?: string;
  as?: 'p' | 'span';
}

/**
 * German text where every word can be clicked to see what it means.
 * Words the learner has not been taught are highlighted, so nothing on screen stays unexplained.
 */
export function GermanText({ text, lessonNew, gloss, className = '', as: Tag = 'span' }: Props) {
  const { lexicon, curriculum } = useContent();
  const { progress } = useProgress();
  const known = knownLexemes(progress, curriculum);
  const segments = useMemo(() => analyze(lexicon, text), [lexicon, text]);
  const [open, setOpen] = useState<number | null>(null);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open === null) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <Tag className={`gt ${className}`} lang="de" ref={rootRef as never}>
      {segments.map((seg, i) => {
        if (seg.kind === 'text') return <span key={i}>{seg.text}</span>;
        const status = wordStatus(seg, known, lessonNew, gloss);
        if (status === 'name') return <span key={i}>{seg.text}</span>;
        return (
          <span key={i} className="gt-wrap">
            <button type="button" className={`gt-word gt-${status}`} aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
              {seg.text}
              {status === 'unknown' || status === 'unmapped' ? <span className="sr-only"> (chưa học)</span> : null}
            </button>
            {open === i && <WordPopover seg={seg} status={status} gloss={gloss} onClose={() => setOpen(null)} />}
          </span>
        );
      })}
    </Tag>
  );
}

function WordPopover({ seg, status, gloss, onClose }: { seg: WordSeg; status: WordStatus; gloss?: Record<string, string>; onClose: () => void }) {
  const { curriculum, lessonById } = useContent();
  const glossText = gloss?.[seg.text] ?? gloss?.[seg.text.toLowerCase()];
  const items: Lexeme[] = seg.parts ?? seg.lexemes;
  const teachingLesson = items.map((l) => curriculum.taughtIn.get(l.id)).find(Boolean);
  const lesson = teachingLesson ? lessonById.get(teachingLesson) : undefined;

  return (
    <span className="gt-pop" role="dialog" aria-label={`Giải thích từ ${seg.text}`} lang="vi">
      <span className="row gap-sm center-y space-between">
        <span className={`gt-status gt-status-${status}`}>{STATUS_LABEL[status]}</span>
        <button type="button" className="gt-close" onClick={onClose} aria-label="Đóng">
          ✕
        </button>
      </span>
      {glossText && (
        <span className="gt-entry">
          <strong lang="de">{seg.text}</strong> = {glossText}
        </span>
      )}
      {!glossText && seg.parts && (
        <span className="muted small">
          Từ ghép: {seg.parts.map((p) => p.lemma).join(' + ')}
        </span>
      )}
      {!glossText &&
        items.map((l) => (
          <span key={l.id} className="gt-entry">
            <span className="row gap-xs center-y">
              <strong lang="de">{l.lemma}</strong>
              <AudioButton text={l.lemma.replace(/\s*\(.*\)$/, '')} size="sm" />
            </span>
            <span>{l.meaning}</span>
            {l.explanation && <span className="muted small">{l.explanation}</span>}
            {l.vocabId && (
              <Link to={`/vocabulary/word/${l.vocabId}`} className="small">
                Xem thẻ từ →
              </Link>
            )}
          </span>
        ))}
      {status === 'unmapped' && !glossText && (
        <span className="small">
          Từ này chưa có giải thích trong DeutschStart. <Link to={`/search?q=${encodeURIComponent(seg.text)}`}>Tìm từ gần giống →</Link>
        </span>
      )}
      {status === 'unknown' && lesson && (
        <Link to={`/learn/${lesson.id}`} className="btn btn-primary btn-sm">
          Học từ này: {lesson.icon} {lesson.title}
        </Link>
      )}
    </span>
  );
}
