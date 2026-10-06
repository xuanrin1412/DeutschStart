import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { daysLearning, downloadBackup, shouldRemindBackup, snoozeBackupReminder } from '@/services/backup';

/** Gentle reminder to export progress: only with real progress, no recent backup, at most once a week. */
export function BackupReminder() {
  const { lessons } = useContent();
  const { progress } = useProgress();
  const [hidden, setHidden] = useState(false);
  if (hidden || !shouldRemindBackup(progress)) return null;
  const days = daysLearning(progress);

  return (
    <section className="card backup-reminder" role="status" aria-label="Nhắc sao lưu tiến độ">
      <span className="backup-icon" aria-hidden="true">
        💾
      </span>
      <div className="grow">
        <p className="h4">{days > 1 ? `Bạn đã học được ${days} ngày.` : 'Bạn đã có tiến độ học.'} Hãy sao lưu tiến độ để tránh mất dữ liệu.</p>
        <p className="muted small">
          Tiến độ đang lưu trong trình duyệt này. Một file sao lưu giúp bạn khôi phục khi đổi máy hoặc xóa dữ liệu trình duyệt. <Link to="/settings">Xem dữ liệu học tập</Link>
        </p>
      </div>
      <div className="row gap-sm wrap">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            downloadBackup(progress, lessons);
            setHidden(true);
          }}
        >
          📤 Sao lưu ngay
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            snoozeBackupReminder();
            setHidden(true);
          }}
        >
          Để sau
        </button>
      </div>
    </section>
  );
}
