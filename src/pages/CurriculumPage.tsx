import { Link } from 'react-router-dom';
import type { Lesson } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { lessonPercent, nextLesson } from '@/services/selectors';

const LEVELS = [
  { level: 'A0', eyebrow: 'Level 0 · A0', title: 'German Basics – Kiến thức nền tảng' },
  { level: 'A1', eyebrow: 'Level 1 · A1', title: 'Cuộc sống hằng ngày' },
] as const;

export default function CurriculumPage() {
  const { lessons } = useContent();
  const { progress } = useProgress();
  const next = nextLesson(progress, lessons);

  return (
    <div className="stack-lg">
      <PageHeader
        icon="🎓"
        title="Học từ đầu"
        subtitle={`${lessons.length} bài ngắn từ con số 0 đến A1, học theo thứ tự.`}
        why="Level 0 dạy bảng chữ cái, phát âm và những câu đầu tiên. Level 1 đưa bạn vào cuộc sống hằng ngày ở Đức – đúng các chủ đề của kỳ thi A1."
      />

      {LEVELS.map(({ level, eyebrow, title }) => {
        const items = lessons.filter((l) => l.level === level);
        if (!items.length) return null;
        const done = items.filter((l) => progress.lessons[l.id]?.completed).length;
        return (
          <section key={level} className="stack-md" aria-labelledby={`level-${level}`}>
            <div className="card level-card">
              <div className="card-head">
                <div>
                  <p className="eyebrow">{eyebrow}</p>
                  <h2 id={`level-${level}`} className="h3">
                    {title}
                  </h2>
                </div>
                <span className="badge">
                  {done}/{items.length} bài
                </span>
              </div>
              <ProgressBar value={(done / items.length) * 100} label={`Tiến độ ${eyebrow}`} size="lg" showValue />
            </div>
            <LessonList lessons={items} nextId={next?.id} />
          </section>
        );
      })}

      <section className="card">
        <h2 className="h3">Học song song</h2>
        <p className="muted">Mỗi bài Level 1 đi kèm một chủ đề ngữ pháp. Kết hợp với Ngữ pháp, Đọc hiểu và Hội thoại để luyện đủ 4 kỹ năng của kỳ thi A1.</p>
        <div className="row gap-sm wrap">
          <Link to="/grammar" className="btn btn-ghost">
            🧩 Ngữ pháp A1
          </Link>
          <Link to="/reading" className="btn btn-ghost">
            📰 Đọc hiểu
          </Link>
          <Link to="/conversations" className="btn btn-ghost">
            💬 Hội thoại
          </Link>
        </div>
      </section>
    </div>
  );
}

function LessonList({ lessons, nextId }: { lessons: Lesson[]; nextId?: string }) {
  const { progress } = useProgress();
  return (
    <ol className="lesson-list">
      {lessons.map((l) => {
        const pct = lessonPercent(progress, l);
        const isNext = nextId === l.id;
        return (
          <li key={l.id} className={`lesson-item card${isNext ? ' is-next' : ''}${pct === 100 ? ' is-done' : ''}`}>
            <span className="lesson-num" aria-hidden="true">
              {pct === 100 ? '✓' : l.order}
            </span>
            <span className="lesson-icon" aria-hidden="true">
              {l.icon}
            </span>
            <div className="grow">
              <h3>
                <span className="sr-only">Bài {l.order}: </span>
                {l.title} <span className="muted small" lang="de">· {l.titleDe}</span>
              </h3>
              <p className="muted small">{l.description}</p>
              <div className="row gap-sm center-y">
                <span className="small">⏱ {l.minutes} phút</span>
                <div className="grow lesson-bar">
                  <ProgressBar value={pct} label={`Tiến độ bài ${l.title}`} size="sm" tone={pct === 100 ? 'good' : 'brand'} />
                </div>
              </div>
            </div>
            <Link to={`/learn/${l.id}`} className={`btn ${isNext ? 'btn-primary' : 'btn-ghost'}`}>
              {pct === 100 ? 'Ôn lại' : pct > 0 ? 'Tiếp tục' : 'Bắt đầu'}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
