import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MAIN_NAV } from './nav';
import { FavoriteCount } from '@/components/lesson/FavoriteStar';
import { useProgress, isDailyComplete } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { usePopover } from '@/hooks/usePopover';
import { useHeaderCollapsed } from '@/hooks/useSetting';
import { dueCount, openMistakes } from '@/services/selectors';
import { achievements } from '@/data/achievements';
import { today } from '@/services/srs';

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="DeutschStart – trang chủ">
      <span className="logo-flag" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="logo-text">
        Deutsch<strong>Start</strong>
      </span>
    </Link>
  );
}

function SearchBox() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };
  return (
    <form className="search-box" role="search" onSubmit={submit}>
      <span aria-hidden="true">🔍</span>
      <label htmlFor="global-search" className="sr-only">
        Tìm kiếm
      </label>
      <input id="global-search" type="search" placeholder="Tìm từ: Apfel, quả táo…" value={q} onChange={(e) => setQ(e.target.value)} />
    </form>
  );
}

function Notifications() {
  const { progress } = useProgress();
  const { open, toggle, ref, setOpen } = usePopover();
  const due = dueCount(progress);
  const mistakes = openMistakes(progress).length;
  const items: { icon: string; text: string; to: string }[] = [];
  if (due > 0) items.push({ icon: '🔁', text: `${due} từ cần ôn hôm nay`, to: '/review' });
  if (!isDailyComplete(progress)) items.push({ icon: '🎯', text: 'Thử thách hôm nay chưa hoàn thành', to: '/review' });
  if (progress.streak.current > 0 && progress.streak.lastDate !== today())
    items.push({ icon: '🔥', text: `Giữ chuỗi ${progress.streak.current} ngày – hoàn thành thử thách hôm nay!`, to: '/review' });
  if (mistakes > 0) items.push({ icon: '📕', text: `${mistakes} câu sai đang chờ ôn lại`, to: '/mistakes' });
  const recent = achievements.filter((a) => {
    const at = progress.achievements[a.id];
    return at && Date.now() - new Date(at).getTime() < 3 * 86_400_000;
  });
  recent.forEach((a) => items.push({ icon: a.icon, text: `Thành tích mới: ${a.title}`, to: '/progress' }));

  return (
    <div className="popover-wrap" ref={ref}>
      <button className="icon-btn" aria-label={`Thông báo (${items.length})`} aria-expanded={open} onClick={toggle}>
        🔔
        {items.length > 0 && <span className="badge-dot">{items.length}</span>}
      </button>
      {open && (
        <div className="popover" role="menu">
          <p className="popover-title">Thông báo</p>
          {items.length === 0 && <p className="muted small pad">Bạn đã hoàn thành mọi việc hôm nay 🎉</p>}
          {items.map((n, i) => (
            <Link key={i} to={n.to} className="popover-item" role="menuitem" onClick={() => setOpen(false)}>
              <span aria-hidden="true">{n.icon}</span> {n.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileMenu() {
  const { user, logout } = useAuth();
  const { open, toggle, ref, setOpen } = usePopover();
  const initial = (user?.name ?? 'K').charAt(0).toUpperCase();
  return (
    <div className="popover-wrap" ref={ref}>
      <button className="avatar" aria-label="Tài khoản" aria-expanded={open} onClick={toggle}>
        {user ? initial : '👤'}
      </button>
      {open && (
        <div className="popover popover-right" role="menu">
          <p className="popover-title">{user ? user.name : 'Khách'}</p>
          {user && <p className="muted small pad-x">{user.email}</p>}
          <Link to="/profile" className="popover-item" role="menuitem" onClick={() => setOpen(false)}>
            👤 Hồ sơ & cài đặt
          </Link>
          <Link to="/progress" className="popover-item" role="menuitem" onClick={() => setOpen(false)}>
            📈 Tiến độ học
          </Link>
          <Link to="/settings" className="popover-item" role="menuitem" onClick={() => setOpen(false)}>
            ⚙️ Cài đặt & sao lưu tiến độ
          </Link>
          {user ? (
            <button
              className="popover-item"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                void logout();
              }}
            >
              🚪 Đăng xuất
            </button>
          ) : (
            <>
              <Link to="/login" className="popover-item" role="menuitem" onClick={() => setOpen(false)}>
                🔑 Đăng nhập
              </Link>
              <Link to="/register" className="popover-item" role="menuitem" onClick={() => setOpen(false)}>
                ✨ Đăng ký miễn phí
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Chevron({ down }: { down?: boolean }) {
  return (
    <svg className={`chevron${down ? ' is-down' : ''}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Matches the height transition in global.css (.header-body). */
const FOLD_MS = 300;

export function Header() {
  const { progress } = useProgress();
  const [collapsed, setCollapsed] = useHeaderCollapsed();
  // While the height animates the header clips its content; once open again, popovers may overflow it.
  const [folding, setFolding] = useState(false);
  const foldRef = useRef<HTMLButtonElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const fold = (next: boolean) => {
    setFolding(true);
    setCollapsed(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFolding(false), FOLD_MS + 50);
    // The pressed button disappears: keep keyboard focus on the one that replaces it.
    requestAnimationFrame(() => (next ? tabRef : foldRef).current?.focus());
  };

  return (
    <header className={`header${collapsed ? ' is-collapsed' : ''}${folding ? ' is-folding' : ''}`}>
      <div className="header-body" id="site-header">
        <div className="header-inner">
          <div className="header-top container">
            <Logo />
            <SearchBox />
            <div className="header-actions">
              <Link to="/search" className="icon-btn only-mobile" aria-label="Tìm kiếm">
                🔍
              </Link>
              <Link to="/progress" className="streak-pill" aria-label={`Chuỗi học: ${progress.streak.current} ngày`}>
                🔥 <strong>{progress.streak.current}</strong>
              </Link>
              <Notifications />
              <ProfileMenu />
              <button ref={foldRef} type="button" className="icon-btn header-fold" aria-label="Thu gọn thanh đầu trang" aria-expanded={true} aria-controls="site-header" title="Thu gọn" onClick={() => fold(true)}>
                <Chevron />
              </button>
            </div>
          </div>
          <nav className="main-nav container" aria-label="Điều hướng chính">
            {MAIN_NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <span aria-hidden="true">{n.icon}</span> {n.label}
                {n.count === 'favorites' && <FavoriteCount />}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      {collapsed && (
        <button ref={tabRef} type="button" className="header-tab" aria-expanded={false} aria-controls="site-header" onClick={() => fold(false)}>
          <span className="flag-de" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          Hiện menu
          <Chevron down />
        </button>
      )}
    </header>
  );
}
