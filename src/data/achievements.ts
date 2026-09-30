import type { Achievement, DailyGoal } from '@/types/models';

const learnedCount = (p: Parameters<Achievement['isUnlocked']>[0]) =>
  Object.values(p.vocabulary).filter((v) => v.state !== 'new').length;

export const achievements: Achievement[] = [
  { id: 'first-word', icon: '🌱', title: 'Từ đầu tiên', description: 'Học từ vựng đầu tiên.', isUnlocked: (p) => learnedCount(p) >= 1 },
  { id: 'words-10', icon: '📚', title: 'Mười từ', description: 'Học 10 từ vựng.', isUnlocked: (p) => learnedCount(p) >= 10 },
  { id: 'words-50', icon: '🏅', title: 'Năm mươi từ', description: 'Học 50 từ vựng.', isUnlocked: (p) => learnedCount(p) >= 50 },
  { id: 'alphabet', icon: '🔤', title: 'Bậc thầy chữ cái', description: 'Xem hết 30 chữ cái.', isUnlocked: (p) => p.alphabetSeen.length >= 30 },
  { id: 'first-lesson', icon: '🎓', title: 'Bài học đầu tiên', description: 'Hoàn thành một bài học.', isUnlocked: (p) => Object.values(p.lessons).some((l) => l.completed) },
  { id: 'level0', icon: '🚀', title: 'Hoàn thành A0', description: 'Hoàn thành cả 12 bài Level 0.', isUnlocked: (p) => Object.values(p.lessons).filter((l) => l.completed).length >= 12 },
  { id: 'streak-3', icon: '🔥', title: 'Ba ngày liền', description: 'Chuỗi học 3 ngày.', isUnlocked: (p) => p.streak.longest >= 3 },
  { id: 'streak-7', icon: '⚡', title: 'Một tuần kiên trì', description: 'Chuỗi học 7 ngày.', isUnlocked: (p) => p.streak.longest >= 7 },
  { id: 'article-pro', icon: '🎯', title: 'Cao thủ mạo từ', description: 'Trả lời đúng 30 câu mạo từ.', isUnlocked: (p) => p.articleStats.der.correct + p.articleStats.die.correct + p.articleStats.das.correct >= 30 },
  { id: 'listener', icon: '🎧', title: 'Đôi tai vàng', description: 'Trả lời đúng 20 câu luyện nghe.', isUnlocked: (p) => p.listening.correct >= 20 },
  { id: 'speaker', icon: '🎙️', title: 'Giọng Đức chuẩn', description: 'Luyện 10 âm phát âm.', isUnlocked: (p) => p.pronunciation.practiced >= 10 },
  { id: 'fixer', icon: '🩹', title: 'Sửa sai', description: 'Sửa 5 lỗi trong Sổ lỗi sai.', isUnlocked: (p) => Object.values(p.mistakes).filter((m) => m.resolved).length >= 5 },
];

/** Daily challenge definition – tweak targets here. */
export const dailyGoals: DailyGoal[] = [
  { key: 'words', label: 'từ vựng', target: 10, icon: '📖', to: '/flashcards' },
  { key: 'grammar', label: 'câu ngữ pháp', target: 5, icon: '🧩', to: '/grammar' },
  { key: 'listening', label: 'câu luyện nghe', target: 5, icon: '🎧', to: '/listening' },
  { key: 'quiz', label: 'câu quiz', target: 5, icon: '✅', to: '/quiz' },
  { key: 'pronunciation', label: 'bài phát âm', target: 3, icon: '🗣️', to: '/pronunciation' },
];
