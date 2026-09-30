import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { SrsState } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { WordTile } from '@/components/vocab/VocabCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/States';
import { SRS_LABELS } from '@/constants';
import { fold } from '@/services/search';

type Filter = 'all' | SrsState | 'saved';

export default function VocabularyPage() {
  const { topics, vocabulary } = useContent();
  const { progress, getWord } = useProgress();
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');

  const words = useMemo(() => {
    const f = fold(q);
    return vocabulary.filter((w) => {
      const uv = getWord(w.id);
      if (filter === 'saved' && !uv.saved) return false;
      if (filter !== 'all' && filter !== 'saved' && uv.state !== filter) return false;
      return !f || fold(w.word).includes(f) || fold(w.meaning).includes(f);
    });
  }, [vocabulary, filter, q, getWord]);

  const learnedIn = (topicId: string) => vocabulary.filter((w) => w.topicId === topicId && progress.vocabulary[w.id] && progress.vocabulary[w.id].state !== 'new').length;

  return (
    <div className="stack-lg">
      <PageHeader
        icon="📖"
        title="Từ vựng"
        subtitle={`${vocabulary.length} từ A1–A2 theo chủ đề, có hình ảnh, IPA, âm thanh và câu ví dụ.`}
        why="Mỗi từ được học cùng mạo từ, hình ảnh và câu ví dụ – giúp bạn nhớ lâu và dùng được ngay."
        actions={
          <>
            <Link to="/flashcards" className="btn btn-primary">
              🃏 Flashcards
            </Link>
            <Link to="/articles" className="btn btn-ghost">
              🎯 der · die · das
            </Link>
          </>
        }
      />

      <section aria-labelledby="topics">
        <h2 id="topics" className="h3">
          Chủ đề
        </h2>
        <div className="grid grid-topics">
          {topics.map((t) => {
            const total = vocabulary.filter((w) => w.topicId === t.id).length;
            const learned = learnedIn(t.id);
            return (
              <Link key={t.id} to={`/vocabulary/topic/${t.id}`} className="card card-hover topic-card">
                <span className="topic-icon" aria-hidden="true">
                  {t.icon}
                </span>
                <strong>{t.name}</strong>
                <span className="muted small" lang="de">
                  {t.nameDe}
                </span>
                <ProgressBar value={total ? (learned / total) * 100 : 0} label={`Đã học ${learned}/${total} từ chủ đề ${t.name}`} size="sm" />
                <span className="muted small">
                  {learned}/{total} từ
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="all">
        <div className="section-head">
          <h2 id="all" className="h3">
            Tất cả từ vựng
          </h2>
          <input className="input input-sm" type="search" placeholder="Lọc từ…" aria-label="Lọc từ vựng" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="chips" role="group" aria-label="Lọc theo trạng thái">
          {(['all', 'new', 'learning', 'review', 'mastered', 'saved'] as Filter[]).map((f) => (
            <button key={f} className={`chip-btn${filter === f ? ' active' : ''}`} aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Tất cả' : f === 'saved' ? '⭐ Đã lưu' : SRS_LABELS[f]}
            </button>
          ))}
        </div>
        {words.length ? (
          <div className="grid grid-words">
            {words.map((w) => (
              <WordTile key={w.id} word={w} />
            ))}
          </div>
        ) : (
          <EmptyState icon="🗂️" title="Không có từ nào">
            {filter === 'saved' ? 'Bấm "Lưu từ" trên thẻ từ vựng để thêm vào danh sách này.' : 'Thử bộ lọc khác nhé.'}
          </EmptyState>
        )}
      </section>
    </div>
  );
}
