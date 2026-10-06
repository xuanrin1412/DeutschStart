import type { CefrLevel, Lesson, ScoreStat, UserProgress } from '@/types/models';
import type { ContentBundle } from './content/contentRepository';
import { dailyGoals } from '@/data/achievements';
import { dueQueue } from './srs';
import { levelMastery, nextLesson as nextInCurriculum } from './curriculum';

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

/** The level of the lesson the learner should study next. */
export function currentLevel(p: UserProgress, c: ContentBundle): CefrLevel {
  return nextInCurriculum(p, c.lessons)?.level ?? 'A1';
}

/** Readiness for A1: mastery of every A0 and A1 unit (a unit counts fully only after its mastery gate). */
export function a1Progress(p: UserProgress, c: ContentBundle) {
  const a0 = levelMastery('A0', c.lessons, p);
  const a1 = levelMastery('A1', c.lessons, p);
  return Math.round((a0.overall * a0.total + a1.overall * a1.total) / Math.max(1, a0.total + a1.total));
}

/** The lesson to study next (respects prerequisites and mastery). */
export function nextLesson(p: UserProgress, lessons: Lesson[]): Lesson | undefined {
  return nextInCurriculum(p, lessons);
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
