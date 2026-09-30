import type { CefrLevel, Lesson, ScoreStat, UserProgress } from '@/types/models';
import type { ContentBundle } from './content/contentRepository';
import { dailyGoals } from '@/data/achievements';
import { dueQueue } from './srs';

export const learnedWordIds = (p: UserProgress) => Object.values(p.vocabulary).filter((v) => v.state !== 'new').map((v) => v.wordId);
export const masteredCount = (p: UserProgress) => Object.values(p.vocabulary).filter((v) => v.state === 'mastered').length;
export const savedWordIds = (p: UserProgress) => Object.values(p.vocabulary).filter((v) => v.saved).map((v) => v.wordId);
export const completedLessons = (p: UserProgress) => Object.entries(p.lessons).filter(([, l]) => l.completed).map(([id]) => id);
export const openMistakes = (p: UserProgress) => Object.values(p.mistakes).filter((m) => !m.resolved).sort((a, b) => b.count - a.count || b.lastAt.localeCompare(a.lastAt));

/** Accuracy in % or null when there is no data yet. */
export const accuracy = (s: ScoreStat) => (s.total ? Math.round((s.correct / s.total) * 100) : null);

export const dueCount = (p: UserProgress) => dueQueue(p.vocabulary).length;

export function dailyPercent(p: UserProgress) {
  const sum = dailyGoals.reduce((acc, g) => acc + Math.min(p.daily[g.key], g.target) / g.target, 0);
  return Math.round((sum / dailyGoals.length) * 100);
}

export function currentLevel(p: UserProgress, c: ContentBundle): CefrLevel {
  const a0 = c.lessons.filter((l) => l.level === 'A0');
  const done = completedLessons(p);
  return a0.every((l) => done.includes(l.id)) ? 'A1' : 'A0';
}

/** Overall A1 readiness: vocabulary 40%, Level 0 lessons 30%, grammar 30%. */
export function a1Progress(p: UserProgress, c: ContentBundle) {
  const vocab = learnedWordIds(p).length / Math.max(1, c.vocabulary.length);
  const lessons = completedLessons(p).length / Math.max(1, c.lessons.length);
  const available = c.grammar.filter((g) => g.available);
  const grammar = available.filter((g) => p.grammarLessons[g.id]?.completed).length / Math.max(1, available.length);
  return Math.round((vocab * 0.4 + lessons * 0.3 + grammar * 0.3) * 100);
}

export function nextLesson(p: UserProgress, lessons: Lesson[]): Lesson | undefined {
  const current = lessons.find((l) => l.id === p.currentLessonId);
  if (current && !p.lessons[current.id]?.completed) return current;
  return lessons.find((l) => !p.lessons[l.id]?.completed);
}

export const lessonPercent = (p: UserProgress, l: Lesson) => {
  const lp = p.lessons[l.id];
  if (!lp) return 0;
  if (lp.completed) return 100;
  return Math.round((lp.step / Math.max(1, lp.totalSteps)) * 100);
};

export const formatMinutes = (seconds: number) => {
  const m = Math.round(seconds / 60);
  return m < 60 ? `${m} phút` : `${Math.floor(m / 60)} giờ ${m % 60} phút`;
};
