import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

interface Props {
  icon: string;
  title: string;
  subtitle?: string;
  /** "Why am I learning this?" – shown as a small note. */
  why?: string;
  back?: { to: string; label: string };
  actions?: ReactNode;
}

export function PageHeader({ icon, title, subtitle, why, back, actions }: Props) {
  useDocumentTitle(title);
  return (
    <div className="page-header">
      {back && (
        <Link to={back.to} className="back-link">
          ← {back.label}
        </Link>
      )}
      <div className="page-header-row">
        <div>
          <h1>
            <span aria-hidden="true">{icon}</span> {title}
          </h1>
          {subtitle && <p className="lead">{subtitle}</p>}
        </div>
        {actions && <div className="row gap-sm wrap">{actions}</div>}
      </div>
      {why && (
        <p className="why">
          <span aria-hidden="true">💡</span> <strong>Tại sao học phần này?</strong> {why}
        </p>
      )}
    </div>
  );
}
