import { useState } from 'react';
import type { Mistake, Question } from '@/types/models';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { QuizRunner } from '@/components/exercises/QuizRunner';
import { EmptyState } from '@/components/ui/States';
import { shuffle } from '@/services/quiz';
import { openMistakes } from '@/services/selectors';

const describe = (q: Question) => (q.display ? `${q.prompt}: ${q.display}` : q.prompt);

export default function MistakesPage() {
  const { progress, removeMistake } = useProgress();
  const [session, setSession] = useState<Question[] | null>(null);
  const [seed, setSeed] = useState(0);
  const open = openMistakes(progress);
  const resolved = Object.values(progress.mistakes).filter((m) => m.resolved).length;

  // Re-shuffle options so the learner can't memorise positions.
  const toQuestions = (ms: Mistake[]) => shuffle(ms.map((m) => ({ ...m.question, options: m.question.options ? shuffle(m.question.options) : undefined })));

  if (session) {
    return (
      <div className="stack-lg narrow">
        <PageHeader icon="📕" title="Ôn lại lỗi sai" subtitle="Trả lời đúng một câu sẽ đánh dấu lỗi đó là đã sửa." />
        <section className="card">
          <QuizRunner
            key={seed}
            questions={session}
            onRestart={() => {
              const remaining = openMistakes(progress);
              if (remaining.length) {
                setSession(toQuestions(remaining));
                setSeed((s) => s + 1);
              } else setSession(null);
            }}
            finishExtra={
              <button className="btn btn-ghost" onClick={() => setSession(null)}>
                Về sổ lỗi sai
              </button>
            }
          />
        </section>
      </div>
    );
  }

  return (
    <div className="stack-lg narrow">
      <PageHeader
        icon="📕"
        title="Sổ lỗi sai"
        subtitle={`Mỗi câu trả lời sai được lưu lại ở đây. Đã sửa: ${resolved} lỗi.`}
        why="Lỗi sai là tín hiệu tốt nhất cho biết bạn cần ôn gì. Ôn lại đúng chỗ yếu giúp tiến bộ nhanh hơn."
        actions={
          open.length > 0 && (
            <button className="btn btn-primary" onClick={() => setSession(toQuestions(open))}>
              🔁 Ôn lại tất cả ({open.length})
            </button>
          )
        }
      />

      {open.length === 0 ? (
        <EmptyState icon="🌟" title="Không có lỗi nào cần ôn" action={{ label: 'Làm quiz', to: '/quiz' }}>
          Khi bạn trả lời sai, câu hỏi sẽ xuất hiện ở đây để ôn lại.
        </EmptyState>
      ) : (
        <ul className="mistake-list">
          {open.map((m) => (
            <li key={m.id} className="card mistake">
              <p className="small muted">{describe(m.question)}</p>
              <p>
                ❌ Bạn trả lời: <s lang="de">{m.question.type === 'article' ? `${m.userAnswer} ${m.question.display?.replace('___ ', '')}` : m.userAnswer}</s>
              </p>
              <p>
                ✅ Đáp án đúng: <strong lang="de">{m.question.type === 'article' ? `${m.question.answer} ${m.question.display?.replace('___ ', '')}` : m.question.answer}</strong>
              </p>
              {m.question.explanation && <p className="muted small">{m.question.explanation}</p>}
              <div className="row gap-sm center-y wrap">
                <span className={`badge ${m.count >= 3 ? 'badge-bad' : ''}`}>Bạn đã sai câu này {m.count} lần</span>
                <span className="grow" />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setSession(toQuestions([m]));
                    setSeed((s) => s + 1);
                  }}
                >
                  Ôn lại
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => removeMistake(m.id)} aria-label={`Xóa lỗi: ${describe(m.question)}`}>
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
