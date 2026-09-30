import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useProgress } from '@/context/ProgressContext';
import { audioService } from '@/services/audio/audioService';

const TICK = 30;

export function Layout() {
  const { addStudySeconds } = useProgress();
  const addRef = useRef(addStudySeconds);
  addRef.current = addStudySeconds;
  const { pathname } = useLocation();

  // Count study time while the tab is visible.
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') addRef.current(TICK);
    }, TICK * 1000);
    return () => clearInterval(id);
  }, []);

  // New page: scroll to top, stop audio.
  useEffect(() => {
    window.scrollTo(0, 0);
    audioService.stop();
  }, [pathname]);

  return (
    <div className="app">
      <a href="#main" className="skip-link">
        Bỏ qua đến nội dung chính
      </a>
      <Header />
      <main id="main" className="container main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="footer container">
        <p className="muted small">
          DeutschStart · Learn German from zero · Âm thanh sử dụng giọng đọc tiếng Đức của trình duyệt
        </p>
      </footer>
      <BottomNav />
    </div>
  );
}
