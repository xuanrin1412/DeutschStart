import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useContent } from '@/context/ContentContext';
import { PageHeader } from '@/components/common/PageHeader';
import { WordTile } from '@/components/vocab/VocabCard';
import { QuizRunner } from '@/components/exercises/QuizRunner';
import { EmptyState } from '@/components/ui/States';
import { imageQuestion, listeningWordQuestion, meaningQuestion, reverseMeaningQuestion, shuffle, articleQuestion } from '@/services/quiz';

export default function TopicPage() {
  const { topicId = '' } = useParams();
  const { topicById, vocabulary } = useContent();
  const topic = topicById.get(topicId);
  const words = vocabulary.filter((w) => w.topicId === topicId);
  const [quiz, setQuiz] = useState(false);
  const [seed, setSeed] = useState(0);

  const questions = useMemo(() => {
    const gens = [meaningQuestion, reverseMeaningQuestion, imageQuestion, listeningWordQuestion];
    const topicWords = vocabulary.filter((w) => w.topicId === topicId);
    return shuffle(topicWords).map((w, i) => (w.article && i % 3 === 2 ? articleQuestion(w) : gens[i % gens.length](w, vocabulary)));
    // `seed` regenerates the quiz on "Làm lại".
  }, [topicId, vocabulary, seed]);

  if (!topic) return <EmptyState icon="🔍" title="Không tìm thấy chủ đề" action={{ label: 'Về trang từ vựng', to: '/vocabulary' }} />;

  return (
    <div className="stack-lg">
      <PageHeader
        icon={topic.icon}
        title={topic.name}
        subtitle={`${topic.nameDe} · ${topic.description}`}
        back={{ to: '/vocabulary', label: 'Từ vựng' }}
        actions={
          <>
            <Link to={`/flashcards?topic=${topic.id}`} className="btn btn-primary">
              🃏 Học bằng flashcard
            </Link>
            <button className="btn btn-ghost" onClick={() => setQuiz((q) => !q)} aria-expanded={quiz}>
              ✅ {quiz ? 'Ẩn quiz' : 'Làm quiz chủ đề'}
            </button>
          </>
        }
      />

      {quiz && (
        <section className="card" aria-label="Quiz chủ đề">
          <QuizRunner key={seed} questions={questions} onRestart={() => setSeed((s) => s + 1)} />
        </section>
      )}

      {words.length ? (
        <div className="grid grid-words">
          {words.map((w) => (
            <WordTile key={w.id} word={w} />
          ))}
        </div>
      ) : (
        <EmptyState icon="🌱" title="Chủ đề này đang được bổ sung">
          Nội dung mới sẽ sớm có mặt.
        </EmptyState>
      )}
    </div>
  );
}
