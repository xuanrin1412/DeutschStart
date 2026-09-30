import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout, Field, validators } from '@/components/auth/AuthForm';
import { ErrorNote, Spinner } from '@/components/ui/States';

type Stage = 'request' | 'set' | 'sent' | 'done';

export default function ResetPasswordPage() {
  const { requestPasswordReset, resetPassword, mode } = useAuth();
  const [stage, setStage] = useState<Stage>('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setLoading(true);
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  const request = (e: FormEvent) => {
    e.preventDefault();
    const err = validators.email(email);
    setFieldError(err);
    if (err) return;
    void run(async () => {
      await requestPasswordReset(email);
      // Local demo mode: no e-mail can be sent, so let the user set a new password here.
      setStage(mode === 'local' && resetPassword ? 'set' : 'sent');
    });
  };

  const setNew = (e: FormEvent) => {
    e.preventDefault();
    const err = validators.password(password);
    setFieldError(err);
    if (err || !resetPassword) return;
    void run(async () => {
      await resetPassword(email, password);
      setStage('done');
    });
  };

  return (
    <AuthLayout title="Đặt lại mật khẩu" subtitle="Nhập email bạn đã dùng để đăng ký.">
      {stage === 'request' && (
        <form onSubmit={request} noValidate className="stack-sm">
          <Field id="email" label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={fieldError} />
          {error && <ErrorNote>{error}</ErrorNote>}
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? <Spinner label="Đang xử lý" /> : 'Tiếp tục'}
          </button>
        </form>
      )}
      {stage === 'set' && (
        <form onSubmit={setNew} noValidate className="stack-sm">
          <p className="tip small">Chế độ demo (không có máy chủ): bạn có thể đặt mật khẩu mới ngay tại đây. Khi kết nối Supabase, một liên kết đặt lại sẽ được gửi qua email.</p>
          <Field id="new-password" label="Mật khẩu mới" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={fieldError} hint="Ít nhất 8 ký tự, gồm chữ và số." />
          {error && <ErrorNote>{error}</ErrorNote>}
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? <Spinner label="Đang lưu" /> : 'Lưu mật khẩu mới'}
          </button>
        </form>
      )}
      {stage === 'sent' && <p role="status">📧 Chúng tôi đã gửi liên kết đặt lại mật khẩu tới {email}. Hãy kiểm tra hộp thư.</p>}
      {stage === 'done' && (
        <p role="status">
          ✅ Đã đổi mật khẩu. <Link to="/login">Đăng nhập ngay</Link>
        </p>
      )}
      <div className="auth-links">
        <Link to="/login">← Quay lại đăng nhập</Link>
      </div>
    </AuthLayout>
  );
}
