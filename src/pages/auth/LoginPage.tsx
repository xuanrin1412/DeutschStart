import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout, Field, validators } from '@/components/auth/AuthForm';
import { ErrorNote, Spinner } from '@/components/ui/States';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = { email: validators.email(email), password: validators.required(password) };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    setLoading(true);
    setSubmitError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đăng nhập" subtitle="Chào mừng trở lại! Tiếp tục hành trình học tiếng Đức.">
      <form onSubmit={submit} noValidate className="stack-sm">
        <Field id="email" label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <Field id="password" label="Mật khẩu" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        {submitError && <ErrorNote>{submitError}</ErrorNote>}
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? <Spinner label="Đang đăng nhập" /> : 'Đăng nhập'}
        </button>
      </form>
      <div className="auth-links">
        <Link to="/reset-password">Quên mật khẩu?</Link>
        <span>
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </span>
        <Link to="/" className="muted small">
          Tiếp tục với tư cách Khách →
        </Link>
      </div>
    </AuthLayout>
  );
}
