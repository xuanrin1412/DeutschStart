import { Link } from 'react-router-dom';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { completedLessons, lessonPercent, nextLesson } from '@/services/selectors';

export default function CurriculumPage() {
  const { lessons } = useContent();
  const { progress } = useProgress();
  const done = completedLessons(progress).length;
  const next = nextLesson(progress, lessons);

  return (
    <div className="stack-lg">
      <PageHeader
        icon="🎓"
        title="Học từ đầu"
        subtitle="Level 0 – Nền tảng tiếng Đức. 12 bài ngắn, học theo thứ tự."
        why="Bảng chữ cái, phát âm và những câu đầu tiên là nền móng cho mọi kỹ năng sau này. Học chắc Level 0, bạn sẽ đọc được hầu hết từ mới."
      />

      <section className="card level-card">
        <div className="card-head">
          <div>
            <p className="eyebrow">Level 0 · A0</p>
            <h2 className="h3">German Basics – Kiến thức nền tảng</h2>
          </div>
          <span className="badge">
            {done}/{lessons.length} bài
          </span>
        </div>
        <ProgressBar value={(done / lessons.length) * 100} label="Tiến độ Level 0" size="lg" showValue />
      </section>

      <ol className="lesson-list">
        {lessons.map((l) => {
          const pct = lessonPercent(progress, l);
          const isNext = next?.id === l.id;
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

      <section className="card coming">
        <p className="eyebrow">Sắp ra mắt</p>
        <h2 className="h3">Level 1 – A1: Cuộc sống hằng ngày</h2>
        <p className="muted">Mua sắm, hẹn giờ, nói về gia đình và công việc. Trong lúc chờ, hãy luyện Ngữ pháp và Hội thoại.</p>
        <div className="row gap-sm wrap">
          <Link to="/grammar" className="btn btn-ghost">
            🧩 Ngữ pháp A1
          </Link>
          <Link to="/conversations" className="btn btn-ghost">
            💬 Hội thoại
          </Link>
        </div>
      </section>
    </div>
  );
}
