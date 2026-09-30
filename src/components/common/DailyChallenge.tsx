import { Link } from 'react-router-dom';
import { useProgress } from '@/context/ProgressContext';
import { dailyGoals } from '@/data/achievements';
import { dailyPercent } from '@/services/selectors';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FlagDE } from '@/components/ui/GermanWord';

export function DailyChallenge({ title = 'Thử thách hôm nay' }: { title?: string }) {
  const { progress } = useProgress();
  const pct = dailyPercent(progress);
  return (
    <section className="card daily" aria-labelledby="daily-title">
      <div className="card-head">
        <h2 id="daily-title" className="h3">
          <FlagDE /> {title}
        </h2>
        <span className="badge badge-gold">Daily German</span>
      </div>
      <ul className="goal-list">
        {dailyGoals.map((g) => {
          const done = Math.min(progress.daily[g.key], g.target);
          const ok = done >= g.target;
          return (
            <li key={g.key} className={ok ? 'is-done' : ''}>
              <Link to={g.to} className="goal">
                <span className="goal-check" aria-hidden="true">
                  {ok ? '✓' : g.icon}
                </span>
                <span className="goal-label">
                  {g.target} {g.label}
                </span>
                <span className="goal-count">
                  {done}/{g.target}
                  <span className="sr-only">{ok ? ' – đã xong' : ''}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <ProgressBar value={pct} label="Tiến độ thử thách hôm nay" tone="gold" showValue />
      <p className="reward">{progress.daily.rewarded ? '🎉 Hoàn thành! Chuỗi học đã được cộng thêm 1 ngày.' : 'Phần thưởng: 🔥 +1 ngày chuỗi học'}</p>
    </section>
  );
}
