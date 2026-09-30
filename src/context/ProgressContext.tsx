import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Article, Question, UserProgress, UserVocabulary } from '@/types/models';
import { createEmptyProgress, progressRepository } from '@/services/progressRepository';
import * as srs from '@/services/srs';
import { achievements, dailyGoals } from '@/data/achievements';
import { GUEST_ID, useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { FullPageLoader } from '@/components/ui/States';

type DailyKey = (typeof dailyGoals)[number]['key'];

interface ProgressApi {
  progress: UserProgress;
  getWord(id: string): UserVocabulary;
  learnWord(id: string): void;
  gradeWord(id: string, grade: srs.Grade): void;
  markKnown(id: string): void;
  toggleSaved(id: string): void;
  recordAnswer(q: Question, correct: boolean, userAnswer: string): void;
  resolveMistake(id: string): void;
  removeMistake(id: string): void;
  recordPronunciation(soundId: string, matched?: boolean): void;
  updateLesson(id: string, step: number, totalSteps: number, completed?: boolean): void;
  markLetterSeen(letter: string): void;
  completeGrammarLesson(id: string, score: number): void;
  addStudySeconds(seconds: number): void;
  resetProgress(): void;
}

const ProgressContext = createContext<ProgressApi | null>(null);

/** New day → fresh daily challenge; missed a day → streak resets. */
function normalizeForToday(p: UserProgress): UserProgress {
  const t = srs.today();
  let next = p;
  if (p.daily.date !== t) next = { ...next, daily: { date: t, words: 0, grammar: 0, listening: 0, quiz: 0, pronunciation: 0, rewarded: false } };
  if (p.streak.lastDate && srs.daysBetween(p.streak.lastDate, t) > 1 && p.streak.current !== 0) next = { ...next, streak: { ...next.streak, current: 0 } };
  return next;
}

export const isDailyComplete = (p: UserProgress) => dailyGoals.every((g) => p.daily[g.key] >= g.target);

/** Pure: grant streak on completed daily challenge and unlock achievements. */
function applyRewards(p: UserProgress): UserProgress {
  let next = p;
  if (!p.daily.rewarded && isDailyComplete(p)) {
    const t = srs.today();
    const { lastDate, current, longest } = p.streak;
    const cur = lastDate === t ? current : lastDate === srs.addDays(t, -1) ? current + 1 : 1;
    next = { ...next, daily: { ...next.daily, rewarded: true }, streak: { current: cur, longest: Math.max(longest, cur), lastDate: t } };
  }
  const unlocked = achievements.filter((a) => !next.achievements[a.id] && a.isUnlocked(next));
  if (unlocked.length) {
    const stamp = new Date().toISOString();
    next = { ...next, achievements: { ...next.achievements, ...Object.fromEntries(unlocked.map((a) => [a.id, stamp])) } };
  }
  return next;
}

const bump = (p: UserProgress, key: DailyKey, n = 1): UserProgress => ({ ...p, daily: { ...p.daily, [key]: p.daily[key] + n } });
const stat = (s: { correct: number; total: number }, ok: boolean) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 });

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, initializing } = useAuth();
  const toast = useToast();
  const userId = user?.id ?? GUEST_ID;
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const prev = useRef<UserProgress | null>(null);

  useEffect(() => {
    if (initializing) return;
    let alive = true;
    setProgress(null);
    prev.current = null;
    progressRepository.load(userId).then((p) => {
      if (alive) setProgress(normalizeForToday(p ?? createEmptyProgress(userId)));
    });
    return () => {
      alive = false;
    };
  }, [userId, initializing]);

  // Persist + celebrate.
  useEffect(() => {
    if (!progress) return;
    const before = prev.current;
    if (before && before.userId === progress.userId) {
      if (!before.daily.rewarded && progress.daily.rewarded) toast('🔥', `Hoàn thành thử thách hôm nay! Chuỗi: ${progress.streak.current} ngày`);
      achievements.filter((a) => progress.achievements[a.id] && !before.achievements[a.id]).forEach((a) => toast(a.icon, `Thành tích mới: ${a.title}`));
    }
    prev.current = progress;
    void progressRepository.save(progress);
  }, [progress, toast]);

  const update = useCallback((fn: (p: UserProgress) => UserProgress) => {
    setProgress((p) => (p ? applyRewards(fn(normalizeForToday(p))) : p));
  }, []);

  const withWord = (p: UserProgress, id: string, fn: (uv: UserVocabulary) => UserVocabulary): UserProgress => ({
    ...p,
    vocabulary: { ...p.vocabulary, [id]: fn(p.vocabulary[id] ?? srs.newUserVocab(id)) },
  });

  const api = useMemo<ProgressApi | null>(() => {
    if (!progress) return null;
    return {
      progress,
      getWord: (id) => progress.vocabulary[id] ?? srs.newUserVocab(id),
      learnWord: (id) =>
        update((p) => {
          const wasNew = (p.vocabulary[id]?.state ?? 'new') === 'new';
          const next = withWord(p, id, srs.startLearning);
          return wasNew ? bump(next, 'words') : next;
        }),
      gradeWord: (id, grade) => update((p) => bump(withWord(p, id, (uv) => srs.gradeWord(uv, grade)), 'words')),
      markKnown: (id) => update((p) => bump(withWord(p, id, srs.markKnown), 'words')),
      toggleSaved: (id) => update((p) => withWord(p, id, (uv) => ({ ...uv, saved: !uv.saved }))),
      recordAnswer: (q, correct, userAnswer) =>
        update((p) => {
          let next = p;
          if (q.type === 'article' && ['der', 'die', 'das'].includes(q.answer)) {
            const a = q.answer as Article;
            next = { ...next, articleStats: { ...next.articleStats, [a]: stat(next.articleStats[a], correct) } };
          }
          if (q.category === 'listening') next = bump({ ...next, listening: stat(next.listening, correct) }, 'listening');
          else if (q.category === 'grammar' || q.category === 'article') next = bump({ ...next, grammar: stat(next.grammar, correct) }, 'grammar');
          else next = bump({ ...next, quiz: stat(next.quiz, correct) }, 'quiz');

          if (q.wordId) next = withWord(next, q.wordId, (uv) => (correct ? { ...uv, correct: uv.correct + 1 } : srs.lapse(uv)));

          const existing = next.mistakes[q.id];
          if (!correct) {
            next = {
              ...next,
              mistakes: { ...next.mistakes, [q.id]: { id: q.id, question: q, userAnswer, count: (existing?.count ?? 0) + 1, lastAt: new Date().toISOString(), resolved: false } },
            };
          } else if (existing && !existing.resolved) {
            next = { ...next, mistakes: { ...next.mistakes, [q.id]: { ...existing, resolved: true } } };
          }
          return next;
        }),
      resolveMistake: (id) =>
        update((p) => (p.mistakes[id] ? { ...p, mistakes: { ...p.mistakes, [id]: { ...p.mistakes[id], resolved: true } } } : p)),
      removeMistake: (id) =>
        update((p) => {
          const { [id]: _removed, ...rest } = p.mistakes;
          return { ...p, mistakes: rest };
        }),
      recordPronunciation: (soundId, matched) =>
        update((p) =>
          bump(
            {
              ...p,
              pronunciation: {
                practiced: p.pronunciation.practiced + 1,
                matched: p.pronunciation.matched + (matched ? 1 : 0),
                sounds: p.pronunciation.sounds.includes(soundId) ? p.pronunciation.sounds : [...p.pronunciation.sounds, soundId],
              },
            },
            'pronunciation',
          ),
        ),
      updateLesson: (id, step, totalSteps, completed) =>
        update((p) => {
          const prevL = p.lessons[id];
          const done = completed || prevL?.completed || false;
          return {
            ...p,
            currentLessonId: id,
            lessons: { ...p.lessons, [id]: { step: Math.max(step, done ? totalSteps : 0), totalSteps, completed: done, updatedAt: new Date().toISOString() } },
          };
        }),
      markLetterSeen: (letter) => update((p) => (p.alphabetSeen.includes(letter) ? p : { ...p, alphabetSeen: [...p.alphabetSeen, letter] })),
      completeGrammarLesson: (id, score) =>
        update((p) => ({
          ...p,
          grammarLessons: { ...p.grammarLessons, [id]: { completed: true, bestScore: Math.max(score, p.grammarLessons[id]?.bestScore ?? 0) } },
        })),
      addStudySeconds: (seconds) => update((p) => ({ ...p, studySeconds: p.studySeconds + seconds })),
      resetProgress: () => {
        prev.current = null;
        setProgress(createEmptyProgress(userId));
      },
    };
  }, [progress, update, userId]);

  if (!api) return <FullPageLoader label="Đang tải tiến độ học…" />;
  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
