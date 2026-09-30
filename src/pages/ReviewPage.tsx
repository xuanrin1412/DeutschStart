import { Link } from 'react-router-dom';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { DailyChallenge } from '@/components/common/DailyChallenge';
import { WordTile } from '@/components/vocab/VocabCard';
import { dueQueue } from '@/services/srs';
import { openMistakes } from '@/services/selectors';
import { REVIEW_INTERVALS } from '@/services/srs';
import { SRS_LABELS } from '@/constants';
import type { SrsState } from '@/types/models';

export default function ReviewPage() {
  const { wordById } = useContent();
  const { progress } = useProgress();
  const due = dueQueue(progress.vocabulary);
  const mistakes = openMistakes(progress);
  const counts = Object.values(progress.vocabulary).reduce<Record<SrsState, number>>(
    (acc, v) => ({ ...acc, [v.state]: acc[v.state] + 1 }),
    { new: 0, learning: 0, review: 0, mastered: 0 },
  );

  return (
    <div className="stack-lg">
      <PageHeader
        icon="🔁"
        title="Ôn tập hôm nay"
        subtitle={`Lặp lại ngắt quãng: mỗi từ được ôn lại sau ${REVIEW_INTERVALS.join(' → ')} ngày. Từ bạn hay sai sẽ được ưu tiên.`}
        why="Não bộ quên 70% kiến thức mới sau 1 ngày nếu không ôn. Ôn đúng lúc giúp chuyển từ vựng vào trí nhớ dài hạn."
      />

      <div className="grid grid-2">
        <section className="card review-hero">
          <p className="eyebrow">Ôn tập hôm nay</p>
          <p className="stat-big">
            {due.length} <span className="stat-unit">từ cần ôn</span>
          </p>
          {due.length > 0 ? (
            <Link to="/flashcards?mode=due" className="btn btn-primary btn-lg">
              Bắt đầu ôn tập
            </Link>
          ) : (
            <>
              <p className="muted">Tuyệt vời, bạn đã ôn hết! Học thêm từ mới nhé.</p>
              <Link to="/flashcards?mode=new" className="btn btn-primary">
                🌱 Học từ mới
              </Link>
            </>
          )}
          <div className="srs-states">
            {(Object.keys(counts) as SrsState[]).filter((s) => s !== 'new').map((s) => (
              <div key={s} className={`srs-state state-${s}`}>
                <strong>{counts[s]}</strong>
                <span>{SRS_LABELS[s]}</span>
              </div>
            ))}
          </div>
        </section>
        <DailyChallenge />
      </div>

      <div className="grid grid-3">
        <Link to="/mistakes" className="card card-hover quick">
          <span className="quick-icon" aria-hidden="true">
            📕
          </span>
          <strong>Sổ lỗi sai</strong>
          <span className="muted small">{mistakes.length ? `${mistakes.length} câu cần ôn lại` : 'Chưa có lỗi nào'}</span>
        </Link>
        <Link to="/quiz" className="card card-hover quick">
          <span className="quick-icon" aria-hidden="true">
            ✅
          </span>
          <strong>Quiz tổng hợp</strong>
          <span className="muted small">6 dạng câu hỏi</span>
        </Link>
        <Link to="/articles" className="card card-hover quick">
          <span className="quick-icon" aria-hidden="true">
            🎯
          </span>
          <strong>Luyện mạo từ</strong>
          <span className="muted small">Cá nhân hóa theo điểm yếu</span>
        </Link>
      </div>

      {due.length > 0 && (
        <section aria-labelledby="due-list">
          <h2 id="due-list" className="h3">
            Từ đến hạn (ưu tiên từ hay sai)
          </h2>
          <div className="grid grid-words">
            {due.slice(0, 12).map((id) => {
              const w = wordById.get(id);
              return w && <WordTile key={id} word={w} />;
            })}
          </div>
        </section>
      )}
    </div>
  );
}
