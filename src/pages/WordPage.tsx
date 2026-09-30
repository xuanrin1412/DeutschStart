import { Link, useParams } from 'react-router-dom';
import { useContent } from '@/context/ContentContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { VocabCard, WordTile } from '@/components/vocab/VocabCard';
import { EmptyState } from '@/components/ui/States';
import { fullWord } from '@/services/quiz';

export default function WordPage() {
  const { wordId = '' } = useParams();
  const { wordById, vocabulary, topicById } = useContent();
  const word = wordById.get(wordId);
  useDocumentTitle(word ? fullWord(word) : 'Từ vựng');
  if (!word) return <EmptyState icon="🔍" title="Không tìm thấy từ này" action={{ label: 'Về trang từ vựng', to: '/vocabulary' }} />;

  const topic = topicById.get(word.topicId);
  const related = vocabulary.filter((w) => w.topicId === word.topicId && w.id !== word.id).slice(0, 6);
  const idx = vocabulary.findIndex((w) => w.id === word.id);
  const prev = vocabulary[idx - 1];
  const next = vocabulary[idx + 1];

  return (
    <div className="stack-lg narrow">
      <Link to={topic ? `/vocabulary/topic/${topic.id}` : '/vocabulary'} className="back-link">
        ← {topic ? `${topic.icon} ${topic.name}` : 'Từ vựng'}
      </Link>
      <VocabCard key={word.id} word={word} />
      <div className="row space-between">
        {prev ? (
          <Link to={`/vocabulary/word/${prev.id}`} className="btn btn-ghost">
            ← {fullWord(prev)}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/vocabulary/word/${next.id}`} className="btn btn-ghost">
            {fullWord(next)} →
          </Link>
        )}
      </div>
      {related.length > 0 && (
        <section aria-labelledby="related">
          <h2 id="related" className="h3">
            Từ liên quan
          </h2>
          <div className="grid grid-words">
            {related.map((w) => (
              <WordTile key={w.id} word={w} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
