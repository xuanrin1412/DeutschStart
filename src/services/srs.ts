import type { SrsState, UserVocabulary } from '@/types/models';

/** Review intervals in days, indexed by step. */
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30];
export type Grade = 'again' | 'good' | 'easy';

const pad = (n: number) => String(n).padStart(2, '0');
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const today = () => toISODate(new Date());
export const addDays = (iso: string, days: number) => {
  const [y, m, d] = iso.split('-').map(Number);
  return toISODate(new Date(y, m - 1, d + days));
};
export const daysBetween = (a: string, b: string) => {
  const [y1, m1, d1] = a.split('-').map(Number);
  const [y2, m2, d2] = b.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
};

export const newUserVocab = (wordId: string): UserVocabulary => ({
  wordId,
  state: 'new',
  step: -1,
  dueAt: today(),
  correct: 0,
  wrong: 0,
  saved: false,
});

const stateForStep = (step: number): SrsState => (step < 0 ? 'new' : step === 0 ? 'learning' : step >= REVIEW_INTERVALS.length - 1 ? 'mastered' : 'review');

/** Put a word into the learning queue (due today). */
export function startLearning(uv: UserVocabulary): UserVocabulary {
  if (uv.state !== 'new') return uv;
  return { ...uv, state: 'learning', step: 0, dueAt: today() };
}

/**
 * Grade a flashcard.
 * again → back to step 0, due today (seen again in this session) and counted as a lapse.
 * good  → next step. easy → skip one step.
 */
export function gradeWord(uv: UserVocabulary, grade: Grade): UserVocabulary {
  const t = today();
  if (grade === 'again') {
    return { ...uv, step: 0, state: 'learning', dueAt: t, wrong: uv.wrong + 1, lastReviewedAt: t };
  }
  const jump = grade === 'easy' ? 2 : 1;
  const step = Math.min(Math.max(uv.step, -1) + jump, REVIEW_INTERVALS.length - 1);
  return { ...uv, step, state: stateForStep(step), dueAt: addDays(t, REVIEW_INTERVALS[step]), correct: uv.correct + 1, lastReviewedAt: t };
}

export function markKnown(uv: UserVocabulary): UserVocabulary {
  const step = REVIEW_INTERVALS.length - 1;
  return { ...uv, step, state: 'mastered', dueAt: addDays(today(), REVIEW_INTERVALS[step]) };
}

/** A wrong quiz answer pulls the word back into today's review. */
export function lapse(uv: UserVocabulary): UserVocabulary {
  const step = uv.state === 'new' ? 0 : Math.max(0, uv.step - 1);
  return { ...uv, step, state: stateForStep(step), dueAt: today(), wrong: uv.wrong + 1 };
}

export const isDue = (uv: UserVocabulary) => uv.state !== 'new' && uv.dueAt <= today();

/** Due words, the ones you get wrong most often first. */
export function dueQueue(vocab: Record<string, UserVocabulary>) {
  return Object.values(vocab)
    .filter(isDue)
    .sort((a, b) => b.wrong - b.correct * 0.3 - (a.wrong - a.correct * 0.3) || a.dueAt.localeCompare(b.dueAt))
    .map((v) => v.wordId);
}
