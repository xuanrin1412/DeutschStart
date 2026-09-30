import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { AudioButton } from '@/components/ui/AudioButton';
import { SentenceSet } from '@/components/exercises/SentenceSet';
import { QuizRunner } from '@/components/exercises/QuizRunner';
import { ROLE_LABELS } from '@/constants';
import { shuffle } from '@/services/quiz';

/** Wraps the highlighted parts of a sentence in <mark>. */
function Highlighted({ text, parts = [] }: { text: string; parts?: string[] }) {
  if (!parts.length) return <>{text}</>;
  const re = new RegExp(`\\b(${parts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'g');
  return (
    <>
      {text.split(re).map((chunk, i) =>
        parts.includes(chunk) ? (
          <mark key={i} className="hl">
            {chunk}
          </mark>
        ) : (
          chunk
        ),
      )}
    </>
  );
}

export default function GrammarLessonPage() {
  const { lessonId = '' } = useParams();
  const { grammar, sentenceById } = useContent();
  const { progress, completeGrammarLesson } = useProgress();
  const lesson = grammar.find((g) => g.id === lessonId);
  const [seed, setSeed] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const questions = useMemo(() => shuffle(lesson?.questions ?? []), [lesson, seed]);

  if (!lesson || !lesson.available)
    return <EmptyState icon="🔒" title="Bài học này sắp ra mắt" action={{ label: 'Về trang ngữ pháp', to: '/grammar' }} />;

  const sentences = (lesson.sentenceIds ?? []).map((id) => sentenceById.get(id)).filter((s): s is NonNullable<typeof s> => !!s);
  const next = grammar.find((g) => g.order > lesson.order && g.available);
  const best = progress.grammarLessons[lesson.id]?.bestScore;

  return (
    <div className="stack-lg narrow">
      <PageHeader icon={lesson.icon} title={lesson.title} subtitle={`${lesson.titleDe} · ${lesson.summary}`} back={{ to: '/grammar', label: 'Ngữ pháp' }} />

      <section className="card stack-sm" aria-labelledby="explain">
        <h2 id="explain" className="h3">
          1. Giải thích
        </h2>
        {lesson.explanation?.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {lesson.table && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  {lesson.table.headers.map((h) => (
                    <th key={h} scope="col">
                      {h}
                    </th>
                  ))}
                  <th scope="col">
                    <span className="sr-only">Nghe</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {lesson.table.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j} lang={lesson.table!.audioCols.includes(j) ? 'de' : undefined}>
                        {c}
                      </td>
                    ))}
                    <td className="td-audio">
                      <AudioButton text={lesson.table!.audioCols.map((j) => r[j]).join(' ')} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {lesson.tip && <div className="tip">💡 {lesson.tip}</div>}
      </section>

      {lesson.structure && (
        <section className="card" aria-labelledby="structure">
          <h2 id="structure" className="h3">
            2. Cấu trúc câu
          </h2>
          {lesson.structureLabel && <p className="muted">{lesson.structureLabel}</p>}
          <div className="structure structure-lg">
            {lesson.structure.map((t, i) => (
              <span key={i} className={`chip role-${t.role}`}>
                <span lang="de">{t.text}</span>
                <small>{ROLE_LABELS[t.role]}</small>
              </span>
            ))}
            <AudioButton text={lesson.structure.map((t) => t.text).join(' ')} size="sm" />
          </div>
        </section>
      )}

      {lesson.examples && (
        <section className="card" aria-labelledby="examples">
          <h2 id="examples" className="h3">
            {lesson.structure ? '3' : '2'}. Ví dụ
          </h2>
          <ul className="phrase-list">
            {lesson.examples.map((e) => (
              <li key={e.de} className="phrase">
                <div className="grow">
                  <p className="phrase-de" lang="de">
                    <Highlighted text={e.de} parts={e.highlight} />
                  </p>
                  <p className="phrase-vi">{e.vi}</p>
                </div>
                <AudioButton text={e.de} size="sm" />
                <AudioButton text={e.de} size="sm" slow />
              </li>
            ))}
          </ul>
        </section>
      )}

      {sentences.length > 0 && (
        <section className="card" aria-labelledby="practice">
          <h2 id="practice" className="h3">
            🧱 Bài tập: Ghép câu
          </h2>
          <SentenceSet sentences={sentences} onDone={() => setShowQuiz(true)} />
        </section>
      )}

      <section className="card" aria-labelledby="mini-quiz">
        <div className="card-head">
          <h2 id="mini-quiz" className="h3">
            ✅ Mini quiz
          </h2>
          {best !== undefined && <span className="badge badge-good">Điểm cao nhất: {best}%</span>}
        </div>
        {showQuiz || !sentences.length ? (
          <QuizRunner
            key={seed}
            questions={questions}
            onRestart={() => setSeed((s) => s + 1)}
            onFinish={(c, t) => completeGrammarLesson(lesson.id, Math.round((c / t) * 100))}
            finishExtra={
              next && (
                <Link to={`/grammar/${next.id}`} className="btn btn-ghost">
                  Bài tiếp: {next.title} →
                </Link>
              )
            }
          />
        ) : (
          <div className="row gap-sm center-y wrap">
            <p className="muted grow">Hoàn thành bài ghép câu hoặc làm quiz ngay.</p>
            <button className="btn btn-primary" onClick={() => setShowQuiz(true)}>
              Làm quiz
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
