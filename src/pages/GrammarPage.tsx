import { Link } from 'react-router-dom';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function GrammarPage() {
  const { grammar } = useContent();
  const { progress } = useProgress();
  const available = grammar.filter((g) => g.available);
  const done = available.filter((g) => progress.grammarLessons[g.id]?.completed).length;
  const next = available.find((g) => !progress.grammarLessons[g.id]?.completed);

  return (
    <div className="stack-lg">
      <PageHeader
        icon="🧩"
        title="Ngữ pháp"
        subtitle="Ngữ pháp A1 giải thích bằng tiếng Việt đơn giản, có ví dụ, cấu trúc câu và bài tập."
        why="Ngữ pháp giúp bạn tự tạo câu mới thay vì chỉ học thuộc lòng. Mỗi bài chỉ 5–10 phút."
        actions={
          next && (
            <Link to={`/grammar/${next.id}`} className="btn btn-primary">
              Học tiếp: {next.title}
            </Link>
          )
        }
      />
      <div className="card">
        <div className="row gap-sm center-y">
          <span className="small">
            Đã hoàn thành {done}/{available.length} bài
          </span>
          <div className="grow">
            <ProgressBar value={(done / Math.max(1, available.length)) * 100} label="Tiến độ ngữ pháp" size="sm" />
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        {grammar.map((g) => {
          const gp = progress.grammarLessons[g.id];
          const body = (
            <>
              <span className="lesson-icon" aria-hidden="true">
                {g.icon}
              </span>
              <div className="grow">
                <p className="eyebrow">
                  Bài {g.order} · {g.level}
                </p>
                <h2 className="h4">{g.title}</h2>
                <p className="muted small" lang="de">
                  {g.titleDe}
                </p>
                <p className="small">{g.summary}</p>
              </div>
              {g.available ? (
                gp?.completed ? (
                  <span className="badge badge-good">✓ {gp.bestScore}%</span>
                ) : (
                  <span className="badge">Học ngay</span>
                )
              ) : (
                <span className="badge badge-muted">🔒 Sắp có</span>
              )}
            </>
          );
          return g.available ? (
            <Link key={g.id} to={`/grammar/${g.id}`} className="card card-hover grammar-item">
              {body}
            </Link>
          ) : (
            <div key={g.id} className="card grammar-item is-locked" aria-disabled="true">
              {body}
            </div>
          );
        })}
      </div>

      <section className="card">
        <h2 className="h3">🧱 Luyện ghép câu</h2>
        <p className="muted">Kéo thả các từ để tạo câu đúng trật tự – cách nhanh nhất để "cảm" được ngữ pháp tiếng Đức.</p>
        <Link to="/grammar/word-order" className="btn btn-ghost">
          Mở bài Trật tự từ
        </Link>
      </section>
    </div>
  );
}
