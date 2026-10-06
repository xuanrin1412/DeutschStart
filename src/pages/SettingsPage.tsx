import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { PageHeader } from '@/components/common/PageHeader';
import { AutoSpeakSwitch } from '@/components/ui/AutoSpeakSwitch';
import { useAutoSpeak } from '@/hooks/useAutoSpeak';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { a1Progress, currentLevel } from '@/services/selectors';
import {
  applyPreferences,
  BackupError,
  backupIsRecent,
  BACKUP_STALE_DAYS,
  downloadBackup,
  lastBackupAt,
  mergeProgress,
  parseBackup,
  summarize,
  type ImportMode,
  type ParsedBackup,
} from '@/services/backup';

const fmtDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '—');

export default function SettingsPage() {
  const content = useContent();
  const { progress } = useProgress();
  const { user } = useAuth();
  const [, setRefresh] = useState(0);
  const last = lastBackupAt(progress.userId);
  const recent = backupIsRecent(progress.userId);

  const exportNow = () => {
    downloadBackup(progress, content.lessons);
    setRefresh((n) => n + 1);
  };

  return (
    <div className="stack-lg narrow">
      <PageHeader icon="⚙️" title="Cài đặt" subtitle={user ? `Tài khoản: ${user.email}` : 'Bạn đang học với chế độ Khách.'} />

      <section className="card stack-sm" aria-labelledby="prefs">
        <h2 id="prefs" className="h3">
          🎧 Học tập
        </h2>
        <AutoSpeakSwitch />
        <p className="muted small">Tự động đọc từ tiếng Đức khi từ xuất hiện (thẻ từ, flashcard, luyện từ vựng).</p>
      </section>

      <section className="card stack-md" aria-labelledby="data">
        <h2 id="data" className="h3">
          📚 Dữ liệu học tập
        </h2>
        <div className="data-grid">
          <div>
            <p className="eyebrow">Tiến độ hiện tại</p>
            <p className="h3">
              {currentLevel(progress, content)} — {a1Progress(progress, content)}%
            </p>
            <ProgressBar value={a1Progress(progress, content)} label="Tiến độ đến A1" size="sm" />
          </div>
          <div>
            <p className="eyebrow">Lần sao lưu gần nhất</p>
            <p className="h3">{fmtDate(last)}</p>
            <p className={`small ${recent ? 'text-good' : 'backup-warn'}`} role="status">
              {recent ? '✓ Đã sao lưu gần đây' : last ? `⚠️ Chưa sao lưu trong ${BACKUP_STALE_DAYS} ngày qua` : '⚠️ Bạn chưa sao lưu lần nào'}
            </p>
          </div>
        </div>

        <div className="row gap-sm wrap">
          <button className="btn btn-primary" onClick={exportNow}>
            📤 Xuất tiến độ
          </button>
        </div>
        <p className="muted small">Tải về một file chứa toàn bộ tiến độ: bài đã học, điểm từng kỹ năng, từ vựng và lịch ôn, sổ lỗi sai, chuỗi ngày học, thành tích. Không chứa mật khẩu hay thông tin tài khoản.</p>

        <ImportPanel />
        <ResetPanel onExport={exportNow} />

        <p className="tip">💡 Hãy sao lưu tiến độ định kỳ để tránh mất dữ liệu – nhất là trước khi xóa dữ liệu trình duyệt hoặc chuyển sang máy tính khác.</p>
      </section>
    </div>
  );
}

/** Choose a backup file → preview → replace or merge. */
function ImportPanel() {
  const { lessons } = useContent();
  const { progress, restoreProgress } = useProgress();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; parsed: ParsedBackup } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ImportMode>('merge');
  const [done, setDone] = useState<string | null>(null);
  const [, setAutoSpeak] = useAutoSpeak();

  const onPick = async (f: File | undefined) => {
    setError(null);
    setDone(null);
    setFile(null);
    if (!f) return;
    try {
      const parsed = parseBackup(await f.text(), progress.userId);
      setFile({ name: f.name, parsed });
    } catch (e) {
      setError(e instanceof BackupError ? e.message : 'Không đọc được file. Vui lòng thử lại.');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const restore = () => {
    if (!file) return;
    const next = mode === 'replace' ? file.parsed.progress : mergeProgress(progress, file.parsed.progress, lessons);
    restoreProgress(next);
    applyPreferences(file.parsed.preferences);
    // The auto-speak switch keeps its value in memory: update it too, not only localStorage.
    if ('settings.autoSpeak' in file.parsed.preferences) setAutoSpeak(file.parsed.preferences['settings.autoSpeak'] === true);
    toast('📥', mode === 'replace' ? 'Đã khôi phục tiến độ từ file' : 'Đã gộp tiến độ từ file');
    setDone(mode);
    setFile(null);
  };

  const s = file ? summarize(file.parsed.progress, lessons) : null;

  return (
    <div className="stack-sm">
      <div className="row gap-sm wrap center-y">
        <button className="btn btn-ghost" onClick={() => inputRef.current?.click()}>
          📥 Nhập tiến độ
        </button>
        <span className="muted small">Chọn file tiến độ bạn đã xuất trước đó.</span>
        <input ref={inputRef} type="file" accept=".json,application/json" className="sr-only" aria-label="Chọn file tiến độ" onChange={(e) => onPick(e.target.files?.[0])} />
      </div>

      {error && (
        <p className="feedback feedback-bad" role="alert">
          ❌ {error}
        </p>
      )}
      {done && (
        <p className="feedback feedback-good" role="status">
          ✅ {done === 'replace' ? 'Tiến độ đã được khôi phục.' : 'Tiến độ đã được gộp.'} <Link to="/learn">Tiếp tục học →</Link>
        </p>
      )}

      {file && s && (
        <div className="restore-card" role="region" aria-label="Xem trước tiến độ trong file">
          <h3 className="h4">📥 Khôi phục tiến độ</h3>
          <dl className="restore-facts">
            <div>
              <dt>File</dt>
              <dd className="break">{file.name}</dd>
            </div>
            <div>
              <dt>Trình độ</dt>
              <dd>
                {s.currentLevel}
                {s.currentLesson && ` · Unit ${s.currentLesson.unit}: ${s.currentLesson.title}`}
              </dd>
            </div>
            <div>
              <dt>Bài đã hoàn thành</dt>
              <dd>{s.completedLessons.length}</dd>
            </div>
            <div>
              <dt>Từ đã học</dt>
              <dd>{s.vocabulary.learned.length}</dd>
            </div>
            <div>
              <dt>Từ đã thuộc</dt>
              <dd>{s.vocabulary.mastered.length}</dd>
            </div>
            <div>
              <dt>Chuỗi học</dt>
              <dd>
                {s.statistics.currentStreak} ngày (kỷ lục {s.statistics.longestStreak})
              </dd>
            </div>
            <div>
              <dt>Học lần cuối</dt>
              <dd>{fmtDate(s.statistics.lastStudyDate)}</dd>
            </div>
            <div>
              <dt>Ngày tạo file</dt>
              <dd>{fmtDate(file.parsed.exportedAt)}</dd>
            </div>
          </dl>
          {file.parsed.version < 1 && <p className="muted small">File này có định dạng cũ – đã được chuyển đổi tự động.</p>}

          <fieldset className="stack-sm option-group">
            <legend className="h4">Cách khôi phục</legend>
            <label className="option-card">
              <input type="radio" name="import-mode" checked={mode === 'merge'} onChange={() => setMode('merge')} />
              <span>
                <strong>➕ Gộp với tiến độ hiện tại</strong>
                <small>Gộp dữ liệu trong file với tiến độ hiện tại. Mỗi bài, mỗi từ giữ trạng thái tiến bộ hơn – không bị mất hay lùi tiến độ.</small>
              </span>
            </label>
            <label className="option-card">
              <input type="radio" name="import-mode" checked={mode === 'replace'} onChange={() => setMode('replace')} />
              <span>
                <strong>🔄 Thay thế toàn bộ tiến độ hiện tại</strong>
                <small>Xóa tiến độ hiện tại trên trình duyệt này và dùng tiến độ trong file.</small>
              </span>
            </label>
          </fieldset>

          <div className="row gap-sm wrap space-between">
            <button className="btn btn-ghost" onClick={() => setFile(null)}>
              Hủy
            </button>
            <button className="btn btn-primary" onClick={restore}>
              Khôi phục tiến độ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Delete all progress – only after a checkbox, with a strong hint to export first. */
function ResetPanel({ onExport }: { onExport: () => void }) {
  const { resetProgress } = useProgress();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [understood, setUnderstood] = useState(false);

  if (!open)
    return (
      <div>
        <button className="btn btn-ghost" onClick={() => setOpen(true)}>
          🗑️ Xóa tiến độ
        </button>
      </div>
    );

  return (
    <div className="danger-zone card stack-sm" role="region" aria-label="Xóa toàn bộ tiến độ">
      <p className="h4">Bạn có chắc chắn muốn xóa toàn bộ tiến độ?</p>
      <p>Mọi bài đã học, điểm thành thạo, từ vựng, lịch ôn tập, sổ lỗi sai, chuỗi ngày học và thành tích sẽ bị xóa. Không thể hoàn tác.</p>
      <p className="tip">
        💡 Bạn nên xuất file backup trước khi xóa.{' '}
        <button className="btn btn-ghost btn-sm" onClick={onExport}>
          📤 Xuất backup
        </button>
      </p>
      <label className="switch">
        <input type="checkbox" checked={understood} onChange={(e) => setUnderstood(e.target.checked)} /> Tôi hiểu rằng toàn bộ tiến độ học sẽ bị xóa.
      </label>
      <div className="row gap-sm wrap">
        <button
          className="btn btn-danger"
          disabled={!understood}
          onClick={() => {
            resetProgress();
            toast('🗑️', 'Đã xóa toàn bộ tiến độ');
            setOpen(false);
            setUnderstood(false);
          }}
        >
          Xóa tiến độ
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => {
            setOpen(false);
            setUnderstood(false);
          }}
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
