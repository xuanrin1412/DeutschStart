import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BOTTOM_NAV, MORE_NAV } from './nav';
import { FavoriteCount } from '@/components/lesson/FavoriteStar';

export function BottomNav() {
  const [more, setMore] = useState(false);
  const location = useLocation();

  useEffect(() => setMore(false), [location.pathname]);
  useEffect(() => {
    if (!more) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMore(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [more]);

  return (
    <>
      {more && (
        <div className="sheet-backdrop" onClick={() => setMore(false)}>
          <div className="sheet" role="dialog" aria-label="Thêm mục" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" aria-hidden="true" />
            <div className="sheet-grid">
              {MORE_NAV.map((n) => (
                <Link key={n.to} to={n.to} className="sheet-item">
                  <span aria-hidden="true">{n.icon}</span>
                  {n.label}
                  {n.count === 'favorites' && <FavoriteCount />}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      <nav className="bottom-nav" aria-label="Điều hướng nhanh">
        {BOTTOM_NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `bottom-link${isActive ? ' active' : ''}`}>
            <span aria-hidden="true">{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
        <button className={`bottom-link${more ? ' active' : ''}`} onClick={() => setMore((m) => !m)} aria-expanded={more}>
          <span aria-hidden="true">☰</span>
          Thêm
        </button>
      </nav>
    </>
  );
}
