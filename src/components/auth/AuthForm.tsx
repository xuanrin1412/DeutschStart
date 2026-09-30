import type { InputHTMLAttributes, ReactNode } from 'react';
import { Logo } from '@/components/layout/Header';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export const validators = {
  name: (v: string) => (v.trim().length < 2 ? 'Vui lòng nhập tên (ít nhất 2 ký tự).' : ''),
  email: (v: string) => (!v.trim() ? 'Vui lòng nhập email.' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? 'Email không hợp lệ.' : ''),
  password: (v: string) =>
    v.length < 8 ? 'Mật khẩu cần ít nhất 8 ký tự.' : !/[A-Za-z]/.test(v) || !/\d/.test(v) ? 'Mật khẩu cần có cả chữ và số.' : '',
  required: (v: string) => (!v ? 'Vui lòng nhập mật khẩu.' : ''),
};

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

export function Field({ id, label, error, hint, ...rest }: FieldProps) {
  const describedBy = [error && `${id}-err`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className={`input${error ? ' has-error' : ''}`} aria-invalid={!!error} aria-describedby={describedBy} {...rest} />
      {hint && !error && (
        <small id={`${id}-hint`} className="muted">
          {hint}
        </small>
      )}
      {error && (
        <small id={`${id}-err`} className="field-error">
          {error}
        </small>
      )}
    </div>
  );
}

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  useDocumentTitle(title);
  return (
    <div className="auth">
      <div className="auth-card card">
        <Logo />
        <h1 className="h2">{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
