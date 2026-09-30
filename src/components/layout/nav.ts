export interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

export const MAIN_NAV: NavItem[] = [
  { to: '/', label: 'Trang chủ', icon: '🏠', end: true },
  { to: '/learn', label: 'Học từ đầu', icon: '🎓' },
  { to: '/vocabulary', label: 'Từ vựng', icon: '📖' },
  { to: '/grammar', label: 'Ngữ pháp', icon: '🧩' },
  { to: '/listening', label: 'Luyện nghe', icon: '🎧' },
  { to: '/pronunciation', label: 'Phát âm', icon: '🗣️' },
  { to: '/conversations', label: 'Hội thoại', icon: '💬' },
  { to: '/review', label: 'Ôn tập', icon: '🔁' },
  { to: '/progress', label: 'Tiến độ', icon: '📈' },
];

export const BOTTOM_NAV: NavItem[] = [
  { to: '/', label: 'Trang chủ', icon: '🏠', end: true },
  { to: '/learn', label: 'Học', icon: '🎓' },
  { to: '/vocabulary', label: 'Từ vựng', icon: '📖' },
  { to: '/review', label: 'Ôn tập', icon: '🔁' },
];

export const MORE_NAV: NavItem[] = [
  { to: '/alphabet', label: 'Bảng chữ cái', icon: '🔤' },
  { to: '/grammar', label: 'Ngữ pháp', icon: '🧩' },
  { to: '/listening', label: 'Luyện nghe', icon: '🎧' },
  { to: '/pronunciation', label: 'Phát âm', icon: '🗣️' },
  { to: '/conversations', label: 'Hội thoại', icon: '💬' },
  { to: '/flashcards', label: 'Flashcards', icon: '🃏' },
  { to: '/articles', label: 'Luyện mạo từ', icon: '🎯' },
  { to: '/quiz', label: 'Quiz', icon: '✅' },
  { to: '/mistakes', label: 'Sổ lỗi sai', icon: '📕' },
  { to: '/progress', label: 'Tiến độ', icon: '📈' },
  { to: '/profile', label: 'Tài khoản', icon: '👤' },
];
