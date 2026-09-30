import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout, Field, validators } from '@/components/auth/AuthForm';
import { ErrorNote, Spinner } from '@/components/ui/States';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = {
      name: validators.name(form.name),
      email: validators.email(form.email),
      password: validators.password(form.password),
      confirm: form.confirm !== form.password ? 'Mật khẩu nhập lại không khớp.' : '',
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    setLoading(true);
    setSubmitError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Đăng ký thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Tạo tài khoản" subtitle="Lưu tiến độ, chuỗi học và từ vựng của bạn. Tiến độ khi học với tư cách Khách sẽ được giữ lại.">
      <form onSubmit={submit} noValidate className="stack-sm">
        <Field id="name" label="Tên của bạn" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
        <Field id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        <Field id="password" label="Mật khẩu" type="password" autoComplete="new-password" value={form.password} onChange={set('password')} error={errors.password} hint="Ít nhất 8 ký tự, gồm chữ và số." />
        <Field id="confirm" label="Nhập lại mật khẩu" type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        {submitError && <ErrorNote>{submitError}</ErrorNote>}
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? <Spinner label="Đang tạo tài khoản" /> : 'Đăng ký miễn phí'}
        </button>
      </form>
      <div className="auth-links">
        <span>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </span>
      </div>
    </AuthLayout>
  );
}
