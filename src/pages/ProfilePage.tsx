import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { audioService } from '@/services/audio/audioService';
import { speechRecognizer } from '@/services/speech/speechRecognition';
import { formatMinutes } from '@/services/selectors';

export default function ProfilePage() {
  const { user, logout, mode } = useAuth();
  const { progress } = useProgress();

  return (
    <div className="stack-lg narrow">
      <PageHeader icon="👤" title="Tài khoản" />
      <section className="card stack-sm">
        {user ? (
          <>
            <div className="row gap-md center-y">
              <span className="avatar avatar-lg">{user.name.charAt(0).toUpperCase()}</span>
              <div>
                <h2 className="h3">{user.name}</h2>
                <p className="muted">{user.email}</p>
                <p className="muted small">Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={() => void logout()}>
              🚪 Đăng xuất
            </button>
          </>
        ) : (
          <>
            <h2 className="h3">Bạn đang học với tư cách Khách</h2>
            <p className="muted">Đăng ký để lưu tiến độ, chuỗi học và từ vựng đã lưu. Tiến độ hiện tại sẽ được chuyển sang tài khoản mới.</p>
            <div className="row gap-sm wrap">
              <Link to="/register" className="btn btn-primary">
                Đăng ký miễn phí
              </Link>
              <Link to="/login" className="btn btn-ghost">
                Đăng nhập
              </Link>
            </div>
          </>
        )}
      </section>

      <section className="card">
        <h2 className="h3">Tóm tắt</h2>
        <ul className="plain-list">
          <li>🔥 Chuỗi học: {progress.streak.current} ngày (kỷ lục {progress.streak.longest})</li>
          <li>⏱ Thời gian học: {formatMinutes(progress.studySeconds)}</li>
          <li>⭐ Từ đã lưu: {Object.values(progress.vocabulary).filter((v) => v.saved).length}</li>
        </ul>
      </section>

      <section className="card">
        <h2 className="h3">Thiết bị & âm thanh</h2>
        <ul className="plain-list">
          <li>{audioService.hasGermanVoice() ? '✅ Đã tìm thấy giọng đọc tiếng Đức' : '⚠️ Chưa có giọng đọc tiếng Đức – hãy cài gói giọng nói "Deutsch" trong cài đặt hệ điều hành để nghe chuẩn hơn.'}</li>
          <li>{speechRecognizer.isSupported() ? '✅ Hỗ trợ luyện nói với micro' : 'ℹ️ Luyện nói với micro cần Chrome hoặc Edge.'}</li>
          <li>
            💾 Lưu trữ: {mode === 'local' ? 'trên trình duyệt này (chế độ offline)' : 'đồng bộ đám mây'}
          </li>
        </ul>
      </section>
    </div>
  );
}
