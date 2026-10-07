import { useState } from 'react';
import type { Lesson } from '@/types/models';
import { useProgress } from '@/context/ProgressContext';
import { useToast } from '@/context/ToastContext';

/**
 * ☆ / ⭐ bookmark for a lesson. Works on every lesson – also locked and planned ones –
 * and is only a bookmark: it never unlocks, completes or scores anything.
 */
export function FavoriteStar({ lesson }: { lesson: Pick<Lesson, 'id' | 'title'> }) {
  const { progress, toggleFavorite } = useProgress();
  const toast = useToast();
  const [pop, setPop] = useState(false);
  const saved = !!progress.favorites?.[lesson.id];

  return (
    <button
      type="button"
      className={`fav-star${saved ? ' is-on' : ''}${pop ? ' pop' : ''}`}
      aria-pressed={saved}
      aria-label={saved ? `Bỏ lưu bài "${lesson.title}"` : `Lưu bài "${lesson.title}" để học sau`}
      title={saved ? 'Bỏ khỏi bài học đã lưu' : 'Lưu bài học này'}
      onClick={(e) => {
        // Cards around the star may be links: never navigate away.
        e.preventDefault();
        e.stopPropagation();
        const now = toggleFavorite(lesson.id);
        toast(now ? '⭐' : '☆', now ? 'Đã lưu vào bài học yêu thích' : 'Đã bỏ khỏi bài học yêu thích');
        setPop(true);
        setTimeout(() => setPop(false), 320);
      }}
    >
      <span aria-hidden="true">{saved ? '⭐' : '☆'}</span>
    </button>
  );
}

/** "⭐ Đã lưu 5" – the number of saved lessons, hidden when there are none. */
export function FavoriteCount() {
  const { progress } = useProgress();
  const n = Object.keys(progress.favorites ?? {}).length;
  if (!n) return null;
  return (
    <span className="nav-count">
      {n}
      <span className="sr-only"> bài</span>
    </span>
  );
}
