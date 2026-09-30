import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function Spinner({ label = 'Đang tải…' }: { label?: string }) {
  return (
    <span className="spinner-wrap" role="status">
      <span className="spinner" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function FullPageLoader({ label }: { label: string }) {
  return (
    <div className="fullpage">
      <div className="flag-bar" aria-hidden="true" />
      <Spinner label={label} />
      <p className="muted">{label}</p>
    </div>
  );
}

export function FullPageError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="fullpage" role="alert">
      <div className="state-icon" aria-hidden="true">
        😕
      </div>
      <h1 className="h3">Có lỗi xảy ra</h1>
      <p className="muted">{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Thử lại
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, children, action }: { icon: string; title: string; children?: ReactNode; action?: { label: string; to: string } }) {
  return (
    <div className="empty">
      <div className="state-icon" aria-hidden="true">
        {icon}
      </div>
      <h3>{title}</h3>
      {children && <p className="muted">{children}</p>}
      {action && (
        <Link className="btn btn-primary" to={action.to}>
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p className="error-note" role="alert">
      {children}
    </p>
  );
}
