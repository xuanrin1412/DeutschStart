import { Link } from 'react-router-dom';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function ReadingPage() {
  const { readings } = useContent();
  const { progress } = useProgress();
  const done = readings.filter((r) => progress.readings?.[r.id]).length;

  return (
    <div className="stack-lg">
      <PageHeader
        icon="📰"
        title="Đọc hiểu"
        subtitle="Email, tin nhắn, biển báo, quảng cáo – những loại bài đọc ngắn giống phần thi Đọc (Lesen) của kỳ thi A1."
        why="Ở Đức bạn đọc mỗi ngày: biển báo, lịch tàu, thư từ cơ quan. Bạn không cần hiểu từng từ – hãy tìm thông tin quan trọng: ai, khi nào, ở đâu, bao nhiêu."
      />

      <div className="card">
        <div className="row gap-sm center-y">
          <span className="small">
            Đã đọc {done}/{readings.length} bài
          </span>
          <div className="grow">
            <ProgressBar value={(done / Math.max(1, readings.length)) * 100} label="Tiến độ đọc hiểu" size="sm" />
          </div>
        </div>
      </div>

      <div className="grid grid-3">
        {readings.map((r) => {
          const best = progress.readings?.[r.id]?.bestScore;
          return (
            <Link key={r.id} to={`/reading/${r.id}`} className="card card-hover convo-card">
              <span className="topic-icon" aria-hidden="true">
                {r.icon}
              </span>
              <div className="grow">
                <p className="eyebrow">
                  {r.level} · <span lang="de">{r.kind}</span> · {r.questions.length} câu hỏi
                </p>
                <h2 className="h4">{r.title}</h2>
                <p className="muted small" lang="de">
                  {r.titleDe}
                </p>
                {best !== undefined && <span className="badge badge-good">✓ {best}%</span>}
              </div>
            </Link>
          );
        })}
      </div>

      <section className="card tip-card">
        <h2 className="h3">💡 Mẹo làm bài đọc</h2>
        <p>Đọc câu hỏi trước, rồi mới đọc bài để tìm thông tin. Chú ý những từ nhỏ làm thay đổi nghĩa: nicht, kein, nur, ab, bis.</p>
      </section>
    </div>
  );
}
