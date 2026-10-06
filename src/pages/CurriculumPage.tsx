import { Link } from 'react-router-dom';
import type { CefrLevel, Lesson } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FlagDE } from '@/components/ui/GermanWord';
import { lessonStatus, levelMastery, missingPrerequisites, nextLesson, type LessonStatus } from '@/services/curriculum';

const LEVELS: { level: CefrLevel; title: string; text: string }[] = [
  { level: 'A0', title: 'Nền tảng tiếng Đức', text: 'Chữ cái, phát âm, những từ và câu đầu tiên. Mọi thứ được giải thích từ số 0.' },
  { level: 'A1', title: 'Cuộc sống hằng ngày', text: 'Gia đình, mua sắm, giờ giấc, nhà ở, công việc – đủ cho kỳ thi A1.' },
  { level: 'A2', title: 'Giao tiếp tự tin', text: 'Câu phức, quá khứ, so sánh, giải quyết tình huống hằng ngày.' },
  { level: 'B1', title: 'Độc lập trong tiếng Đức', text: 'Nêu ý kiến, công việc, xã hội – và luyện thi B1.' },
];

const STATUS: Record<LessonStatus, { label: string; cls: string }> = {
  mastered: { label: '✓ Đã thành thạo', cls: 'badge-good' },
  review: { label: '⚠️ Cần ôn để mở bài sau', cls: 'badge-warn' },
  'in-progress': { label: '→ Đang học', cls: '' },
  available: { label: 'Sẵn sàng', cls: '' },
  locked: { label: '🔒 Chưa mở', cls: 'badge-muted' },
  planned: { label: 'Sắp có', cls: 'badge-muted' },
};

export default function CurriculumPage() {
  const { lessons } = useContent();
  const { progress } = useProgress();
  const next = nextLesson(progress, lessons);

  return (
    <div className="stack-lg">
      <section className="course-hero card">
        <h1 className="h1">
          <FlagDE /> Học tiếng Đức từ số 0
        </h1>
        <p className="lesson-text">Bạn chưa cần biết bất kỳ từ tiếng Đức nào. Chúng ta sẽ học từng bước và không bỏ qua kiến thức nền tảng.</p>
        <ul className="course-promises">
          <li>✓ Mỗi từ mới đều được giải thích trước khi dùng</li>
          <li>✓ Mỗi bài chỉ một khái niệm, 5–15 phút</li>
          <li>✓ Bài sau chỉ mở khi bạn đã thật sự nắm bài trước</li>
        </ul>
        {next && (
          <div className="row gap-sm center-y wrap">
            <Link to={`/learn/${next.id}`} className="btn btn-primary">
              {progress.lessons[next.id] ? 'Tiếp tục' : 'Bắt đầu'}: {next.icon} {next.title} →
            </Link>
            <span className="muted small">
              {next.level} · Unit {next.unit}
            </span>
          </div>
        )}
      </section>

      {LEVELS.map(({ level, title, text }) => {
        const items = lessons.filter((l) => l.level === level).sort((a, b) => a.order - b.order);
        if (!items.length) return null;
        const planned = items.every((l) => l.available === false);
        const m = levelMastery(level, lessons, progress);
        const body = <UnitList lessons={items} nextId={next?.id} />;
        return (
          <section key={level} className="stack-md" aria-labelledby={`level-${level}`}>
            <div className="card level-card">
              <div className="card-head">
                <div>
                  <p className="eyebrow">Level {level}</p>
                  <h2 id={`level-${level}`} className="h3">
                    {title}
                  </h2>
                  <p className="muted small">{text}</p>
                </div>
                <span className="badge">{planned ? `${items.length} bài – sắp có` : `${m.mastered}/${m.total} bài thành thạo`}</span>
              </div>
              {!planned && <ProgressBar value={m.overall} label={`Mức thành thạo ${level}`} size="lg" showValue />}
            </div>
            {planned ? (
              <details className="card roadmap">
                <summary>Xem lộ trình {level} ({items.length} bài)</summary>
                {body}
              </details>
            ) : (
              body
            )}
          </section>
        );
      })}
    </div>
  );
}

function UnitList({ lessons, nextId }: { lessons: Lesson[]; nextId?: string }) {
  const { progress } = useProgress();
  const { lessonById } = useContent();
  return (
    <ol className="lesson-list">
      {lessons.map((l) => {
        const status = lessonStatus(l, progress);
        const isNext = nextId === l.id;
        const missing = status === 'locked' ? lessonById.get(missingPrerequisites(l, progress)[0]) : undefined;
        return (
          <li key={l.id} className={`lesson-item card${isNext ? ' is-next' : ''} is-${status}`}>
            <span className="lesson-num" aria-hidden="true">
              {status === 'mastered' ? '✓' : status === 'locked' || status === 'planned' ? '🔒' : l.unit}
            </span>
            <span className="lesson-icon" aria-hidden="true">
              {l.icon}
            </span>
            <div className="grow">
              <h3>
                <span className="sr-only">Unit {l.unit}: </span>
                {l.title} <span className="muted small" lang="de">· {l.titleDe}</span>
              </h3>
              <p className="muted small">{l.description}</p>
              <p className="small">
                <span className={`badge ${STATUS[status].cls}`}>{STATUS[status].label}</span>
                {missing && <span className="muted"> Hoàn thành Unit {missing.unit} ({missing.title}) trước</span>}
                {status !== 'planned' && <span className="muted"> · ⏱ {l.minutes} phút</span>}
              </p>
            </div>
            {status === 'planned' ? null : (
              <Link to={`/learn/${l.id}`} className={`btn ${isNext ? 'btn-primary' : 'btn-ghost'}`}>
                {status === 'mastered' ? 'Ôn lại' : status === 'review' ? 'Ôn để mở khóa' : status === 'in-progress' ? 'Tiếp tục' : status === 'locked' ? 'Xem trước' : 'Bắt đầu'}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
