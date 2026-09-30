import { useMemo, useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { QuizRunner } from '@/components/exercises/QuizRunner';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { personalizedArticleQuiz } from '@/services/quiz';
import { accuracy } from '@/services/selectors';
import { ARTICLES, ARTICLE_LABELS } from '@/constants';

export default function ArticlesPage() {
  const { vocabulary } = useContent();
  const { progress } = useProgress();
  const [round, setRound] = useState(0);
  const [started, setStarted] = useState(false);

  const nouns = useMemo(() => vocabulary.filter((w) => w.article), [vocabulary]);
  const wrongIds = Object.values(progress.mistakes)
    .filter((m) => !m.resolved && m.question.type === 'article' && m.question.wordId)
    .map((m) => m.question.wordId!);
  // Regenerated per round, weighted by the learner's weakest article.
  const questions = useMemo(() => personalizedArticleQuiz(nouns, progress.articleStats, 10, wrongIds), [round, nouns]); // eslint-disable-line react-hooks/exhaustive-deps

  const weakest = [...ARTICLES].sort((a, b) => (accuracy(progress.articleStats[a]) ?? 101) - (accuracy(progress.articleStats[b]) ?? 101))[0];
  const hasData = ARTICLES.some((a) => progress.articleStats[a].total > 0);

  return (
    <div className="stack-lg narrow">
      <PageHeader
        icon="🎯"
        title="der · die · das"
        subtitle="Luyện mạo từ – thử thách lớn nhất của người mới học tiếng Đức."
        why="Mạo từ quyết định cách chia tính từ, đại từ và các cách (Kasus). Học đúng từ đầu sẽ giúp bạn rất nhiều ở A2, B1."
      />

      <div className="grid grid-3">
        {ARTICLES.map((a) => {
          const acc = accuracy(progress.articleStats[a]);
          return (
            <div key={a} className={`card article-stat article-card-${a}`}>
              <p className={`article-name article-${a}`}>{a.toUpperCase()}</p>
              <p className="muted small">{ARTICLE_LABELS[a]}</p>
              <p className="stat-big">{acc === null ? '—' : `${acc}%`}</p>
              <ProgressBar value={acc ?? 0} label={`Độ chính xác ${a}`} tone={a} size="sm" />
              <p className="muted small">
                {progress.articleStats[a].correct}/{progress.articleStats[a].total} câu đúng
              </p>
            </div>
          );
        })}
      </div>

      {hasData && (
        <p className="why">
          🎯 Bài luyện được cá nhân hóa: bạn đang yếu nhất ở <strong className={`article-${weakest}`}>{weakest.toUpperCase()}</strong>, nên sẽ gặp nhiều từ {weakest} hơn, cùng các từ bạn từng trả lời sai.
        </p>
      )}

      <section className="card">
        {!started ? (
          <div className="stack-sm center-text">
            <h2 className="h3">Quy tắc nhanh</h2>
            <ul className="rule-list">
              <li>
                <span className="article-der">der</span> – người nam, ngày, tháng, mùa: der Vater, der Montag
              </li>
              <li>
                <span className="article-die">die</span> – -ung, -heit, -keit, phần lớn -e, số nhiều: die Wohnung, die Lampe
              </li>
              <li>
                <span className="article-das">das</span> – -chen, -lein: das Mädchen
              </li>
            </ul>
            <button className="btn btn-primary btn-lg" onClick={() => setStarted(true)}>
              Bắt đầu 10 câu
            </button>
          </div>
        ) : (
          <QuizRunner key={round} questions={questions} onRestart={() => setRound((r) => r + 1)} />
        )}
      </section>
    </div>
  );
}
