import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CefrLevel, Lesson } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { FavoriteStar } from '@/components/lesson/FavoriteStar';
import { lessonScore, lessonStatus, STATUS_LABELS, type LessonStatus } from '@/services/curriculum';

type Sort = 'newest' | 'oldest' | 'level' | 'progress';
const LEVELS: CefrLevel[] = ['A0', 'A1', 'A2', 'B1'];
const SORTS: { id: Sort; label: string }[] = [
  { id: 'newest', label: 'Mới lưu nhất' },
  { id: 'oldest', label: 'Cũ nhất' },
  { id: 'level', label: 'Theo cấp độ' },
  { id: 'progress', label: 'Theo tiến độ' },
];
/** "Theo tiến độ": lessons in progress first, then the ones to review, new, locked, finished, planned. */
const PROGRESS_RANK: Record<LessonStatus, number> = { 'in-progress': 0, review: 1, available: 2, locked: 3, mastered: 4, planned: 5 };

export default function FavoritesPage() {
  const { lessonById } = useContent();
  const { progress } = useProgress();
  const [level, setLevel] = useState<CefrLevel | 'all'>('all');
  const [sort, setSort] = useState<Sort>('newest');
  const favorites = progress.favorites ?? {};

  const saved = useMemo(
    () =>
      Object.entries(favorites)
        .map(([id, at]) => ({ lesson: lessonById.get(id), at }))
        .filter((x): x is { lesson: Lesson; at: string } => !!x.lesson),
    [favorites, lessonById],
  );

  const shown = saved
    .filter((x) => level === 'all' || x.lesson.level === level)
    .sort((a, b) => {
      if (sort === 'newest') return b.at.localeCompare(a.at);
      if (sort === 'oldest') return a.at.localeCompare(b.at);
      if (sort === 'level') return a.lesson.order - b.lesson.order;
      const ra = PROGRESS_RANK[lessonStatus(a.lesson, progress)];
      const rb = PROGRESS_RANK[lessonStatus(b.lesson, progress)];
      return ra - rb || lessonScore(progress.lessons[b.lesson.id]) - lessonScore(progress.lessons[a.lesson.id]) || a.lesson.order - b.lesson.order;
    });

  if (!saved.length)
    return (
      <div className="stack-lg narrow">
        <PageHeader icon="⭐" title="Bài học đã lưu" subtitle="Những bài bạn muốn học hoặc xem lại sau." />
        <EmptyState icon="⭐" title="Chưa có bài học nào" action={{ label: 'Xem khóa học', to: '/learn' }}>
          Bạn có thể nhấn ☆ ở bất kỳ bài học nào để lưu lại và học sau – kể cả bài chưa mở khóa.
        </EmptyState>
      </div>
    );

  return (
    <div className="stack-lg narrow">
      <PageHeader icon="⭐" title="Bài học đã lưu" subtitle="Những bài bạn muốn học hoặc xem lại sau." />

      <div className="card stack-sm">
        <p className="small">
          <strong>{saved.length}</strong> bài học đã lưu{level !== 'all' && ` · đang xem ${shown.length} bài ${level}`}
        </p>
        <div className="row gap-sm wrap center-y space-between">
          <div className="chips" role="group" aria-label="Lọc theo cấp độ">
            {(['all', ...LEVELS] as const).map((l) => (
              <button key={l} className={`chip-btn${level === l ? ' active' : ''}`} aria-pressed={level === l} onClick={() => setLevel(l)}>
                {l === 'all' ? 'Tất cả' : l}
              </button>
            ))}
          </div>
          <label className="row gap-xs center-y small">
            Sắp xếp:
            <select className="input input-sm" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="muted center-text">Không có bài đã lưu nào ở cấp độ {level}.</p>
      ) : (
        <ul className="lesson-list">
          {shown.map(({ lesson, at }) => {
            const status = lessonStatus(lesson, progress);
            return (
              <li key={lesson.id} className={`lesson-item card is-${status}`}>
                <span className="lesson-icon" aria-hidden="true">
                  {lesson.icon}
                </span>
                <div className="grow">
                  <h2 className="h4">
                    {lesson.title} <span className="muted small" lang="de">· {lesson.titleDe}</span>
                  </h2>
                  <p className="muted small">
                    {lesson.level} · Unit {lesson.unit} · đã lưu {new Date(at).toLocaleDateString('vi-VN')}
                  </p>
                  <p className="small">
                    <span className={`badge ${STATUS_LABELS[status].cls}`}>{STATUS_LABELS[status].fav}</span>
                  </p>
                </div>
                <FavoriteStar lesson={lesson} />
                {status === 'planned' ? (
                  <span className="badge badge-muted">Sắp có</span>
                ) : (
                  <Link to={`/learn/${lesson.id}`} className="btn btn-primary btn-sm">
                    {status === 'mastered' ? 'Ôn lại' : status === 'in-progress' ? 'Học tiếp' : 'Học ngay'}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
