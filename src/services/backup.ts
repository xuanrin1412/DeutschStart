import type { Lesson, LessonProgress, Mistake, ScoreStat, Skill, SrsState, UserProgress, UserVocabulary } from '@/types/models';
import { createEmptyProgress } from './progressRepository';
import { storage } from './storage';
import { isMastered, levelMastery, nextLesson } from './curriculum';
import { REVIEW_INTERVALS, today } from './srs';

/**
 * Learning-progress backup: one JSON file that holds the complete `UserProgress` plus learning
 * preferences. The same `UserProgress` model is used by localStorage, a future database and this
 * file, so a backup restores the site exactly as it was. No passwords, tokens or account data.
 */

export const BACKUP_APP = 'DeutschStart';
/** Bump when the file format changes and add a migration below. */
export const BACKUP_VERSION = 1;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

/** Learning preferences stored outside UserProgress (localStorage keys without the prefix). */
const PREFERENCE_KEYS = ['settings.autoSpeak', 'settings.vocabPractice'];

export interface BackupFile {
  app: typeof BACKUP_APP;
  version: number;
  exportedAt: string;
  /** Readable overview (for people opening the file). Import never trusts it – it uses `data`. */
  summary: ReturnType<typeof summarize>;
  /** The complete learning progress. */
  data: Omit<UserProgress, 'userId'>;
  preferences: Record<string, unknown>;
}

export type ImportMode = 'replace' | 'merge';

/* ---------------- Export ---------------- */

/** Human-readable overview of a progress object (also used for the import preview). */
export function summarize(p: UserProgress, lessons: Lesson[]) {
  const words = Object.values(p.vocabulary);
  const byState = (s: SrsState) => words.filter((w) => w.state === s).map((w) => w.wordId);
  const current = nextLesson(p, lessons);
  const done = lessons.filter((l) => p.lessons[l.id]?.completed).map((l) => l.id);
  const lastDates = [
    ...Object.values(p.lessons).map((l) => l.updatedAt?.slice(0, 10)),
    ...words.map((w) => w.lastReviewedAt),
    p.streak.lastDate,
  ].filter((d): d is string => !!d);
  return {
    currentLevel: current?.level ?? 'A1',
    currentLesson: current ? { id: current.id, level: current.level, unit: current.unit, title: current.title } : null,
    completedLessons: done,
    masteredLessons: lessons.filter((l) => isMastered(p.lessons[l.id])).map((l) => l.id),
    mastery: { A0: levelMastery('A0', lessons, p).overall, A1: levelMastery('A1', lessons, p).overall },
    vocabulary: {
      learned: words.filter((w) => w.state !== 'new').map((w) => w.wordId),
      mastered: byState('mastered'),
      difficult: words.filter((w) => w.wrong >= 2 && w.wrong > w.correct).map((w) => w.wordId),
      saved: words.filter((w) => w.saved).map((w) => w.wordId),
      reviewSchedule: words.filter((w) => w.state !== 'new').map((w) => ({ wordId: w.wordId, state: w.state, dueAt: w.dueAt })),
    },
    mistakes: Object.values(p.mistakes).filter((m) => !m.resolved).length,
    favorites: Object.entries(p.favorites ?? {}).map(([lessonId, createdAt]) => ({ lessonId, createdAt })),
    statistics: {
      totalStudyMinutes: Math.round(p.studySeconds / 60),
      currentStreak: p.streak.current,
      longestStreak: p.streak.longest,
      achievements: Object.keys(p.achievements).length,
      lastStudyDate: lastDates.sort().pop() ?? null,
    },
  };
}

export function createBackup(p: UserProgress, lessons: Lesson[]): BackupFile {
  const { userId: _account, ...data } = p;
  const preferences: Record<string, unknown> = {};
  for (const key of PREFERENCE_KEYS) {
    const v = storage.get<unknown>(key, undefined);
    if (v !== undefined) preferences[key] = v;
  }
  return { app: BACKUP_APP, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), summary: summarize(p, lessons), data, preferences };
}

export const backupFileName = () => `deutschstart-progress-${today()}.json`;

/** Saves the backup as a file and remembers when the last backup was made. */
export function downloadBackup(p: UserProgress, lessons: Lesson[]) {
  const blob = new Blob([JSON.stringify(createBackup(p, lessons), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = backupFileName();
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  markBackedUp(p.userId);
}

/* ---------------- Backup status & reminder ---------------- */

const lastBackupKey = (userId: string) => `backup.lastAt.${userId}`;
const SNOOZE_KEY = 'backup.reminderSnoozedUntil';

export const lastBackupAt = (userId: string) => storage.get<string | null>(lastBackupKey(userId), null);
export const markBackedUp = (userId: string) => storage.set(lastBackupKey(userId), new Date().toISOString());

/** A backup older than this counts as "not recent". */
export const BACKUP_STALE_DAYS = 14;

export function backupIsRecent(userId: string) {
  const at = lastBackupAt(userId);
  return !!at && Date.now() - new Date(at).getTime() < BACKUP_STALE_DAYS * 86_400_000;
}

/** Days since the learner's first recorded activity (for "Bạn đã học được N ngày"). */
export function daysLearning(p: UserProgress) {
  const dates = [...Object.values(p.lessons).map((l) => l.updatedAt), ...Object.values(p.mistakes).map((m) => m.lastAt)].filter(Boolean).sort();
  if (!dates.length) return 0;
  return Math.max(1, Math.ceil((Date.now() - new Date(dates[0]).getTime()) / 86_400_000));
}

/** Remind when there is real progress to lose, no recent backup, and the reminder was not dismissed in the last 7 days. */
export function shouldRemindBackup(p: UserProgress) {
  const hasProgress = Object.values(p.lessons).filter((l) => l.completed).length >= 3 || Object.values(p.vocabulary).filter((v) => v.state !== 'new').length >= 30;
  if (!hasProgress || backupIsRecent(p.userId)) return false;
  const snoozed = storage.get<string | null>(SNOOZE_KEY, null);
  return !snoozed || new Date(snoozed).getTime() < Date.now();
}

export const snoozeBackupReminder = (days = 7) => storage.set(SNOOZE_KEY, new Date(Date.now() + days * 86_400_000).toISOString());

/* ---------------- Import: parse, validate, migrate ---------------- */

export class BackupError extends Error {}

const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const num = (x: unknown, d = 0) => (typeof x === 'number' && Number.isFinite(x) && x >= 0 ? x : d);
const str = (x: unknown, d = '') => (typeof x === 'string' ? x : d);
const scoreStat = (x: unknown): ScoreStat => (isObj(x) ? { correct: num(x.correct), total: Math.max(num(x.total), num(x.correct)) } : { correct: 0, total: 0 });
const STATES: SrsState[] = ['new', 'learning', 'review', 'mastered'];

/**
 * Older file formats → current one. Key = version the file has; each step returns the next version.
 * Version 0 = a raw progress object (e.g. copied from localStorage before backups existed).
 */
const MIGRATIONS: Record<number, (f: Record<string, unknown>) => Record<string, unknown>> = {
  0: (raw) => {
    const { userId: _u, ...data } = raw;
    return { app: BACKUP_APP, version: 1, exportedAt: str(raw.exportedAt, new Date().toISOString()), data, preferences: {} };
  },
};

/** Turns any value into a complete, safe UserProgress (unknown fields dropped, bad values defaulted). */
function sanitize(data: Record<string, unknown>, userId: string): UserProgress {
  const base = createEmptyProgress(userId);
  const vocabulary: Record<string, UserVocabulary> = {};
  if (isObj(data.vocabulary))
    for (const [id, v] of Object.entries(data.vocabulary)) {
      if (!isObj(v)) continue;
      const state = STATES.includes(v.state as SrsState) ? (v.state as SrsState) : 'new';
      vocabulary[id] = {
        wordId: id,
        state,
        step: Math.min(Math.max(Math.round(typeof v.step === 'number' ? v.step : -1), -1), REVIEW_INTERVALS.length - 1),
        dueAt: /^\d{4}-\d{2}-\d{2}$/.test(str(v.dueAt)) ? str(v.dueAt) : today(),
        correct: num(v.correct),
        wrong: num(v.wrong),
        saved: v.saved === true,
        lastReviewedAt: typeof v.lastReviewedAt === 'string' ? v.lastReviewedAt : undefined,
      };
    }
  const lessons: Record<string, LessonProgress> = {};
  if (isObj(data.lessons))
    for (const [id, l] of Object.entries(data.lessons)) {
      if (!isObj(l)) continue;
      const skills = isObj(l.skills) ? (Object.fromEntries(Object.entries(l.skills).filter(([, v]) => typeof v === 'number').map(([k, v]) => [k, Math.min(100, num(v))])) as Partial<Record<Skill, number>>) : undefined;
      lessons[id] = { step: num(l.step), totalSteps: num(l.totalSteps), completed: l.completed === true, updatedAt: str(l.updatedAt, new Date().toISOString()), skills, mastered: l.mastered === true };
    }
  const mistakes: Record<string, Mistake> = {};
  if (isObj(data.mistakes))
    for (const [id, m] of Object.entries(data.mistakes)) {
      if (!isObj(m) || !isObj(m.question) || typeof (m.question as { answer?: unknown }).answer !== 'string') continue;
      mistakes[id] = { id, question: m.question as unknown as Mistake['question'], userAnswer: str(m.userAnswer), count: Math.max(1, num(m.count, 1)), lastAt: str(m.lastAt, new Date().toISOString()), resolved: m.resolved === true };
    }
  const record = <T,>(x: unknown, map: (v: Record<string, unknown>) => T): Record<string, T> =>
    isObj(x) ? Object.fromEntries(Object.entries(x).filter(([, v]) => isObj(v)).map(([k, v]) => [k, map(v as Record<string, unknown>)])) : {};
  const art = isObj(data.articleStats) ? data.articleStats : {};
  const streak = isObj(data.streak) ? data.streak : {};
  const pron = isObj(data.pronunciation) ? data.pronunciation : {};
  const daily = isObj(data.daily) ? data.daily : {};
  const skillStats = isObj(data.skillStats) ? Object.fromEntries(Object.entries(data.skillStats).map(([k, v]) => [k, scoreStat(v)])) : undefined;

  return {
    ...base,
    vocabulary,
    lessons,
    mistakes,
    articleStats: { der: scoreStat(art.der), die: scoreStat(art.die), das: scoreStat(art.das) },
    listening: scoreStat(data.listening),
    quiz: scoreStat(data.quiz),
    grammar: scoreStat(data.grammar),
    skillStats: skillStats as UserProgress['skillStats'],
    pronunciation: { practiced: num(pron.practiced), matched: num(pron.matched), sounds: Array.isArray(pron.sounds) ? pron.sounds.filter((s): s is string => typeof s === 'string') : [] },
    grammarLessons: record(data.grammarLessons, (v) => ({ completed: v.completed === true, bestScore: Math.min(100, num(v.bestScore)) })),
    readings: record(data.readings, (v) => ({ bestScore: Math.min(100, num(v.bestScore)) })),
    favorites: isObj(data.favorites) ? (Object.fromEntries(Object.entries(data.favorites).filter(([, v]) => typeof v === 'string')) as Record<string, string>) : {},
    alphabetSeen: Array.isArray(data.alphabetSeen) ? data.alphabetSeen.filter((s): s is string => typeof s === 'string') : [],
    currentLessonId: typeof data.currentLessonId === 'string' ? data.currentLessonId : undefined,
    streak: { current: num(streak.current), longest: Math.max(num(streak.longest), num(streak.current)), lastDate: typeof streak.lastDate === 'string' ? streak.lastDate : undefined },
    daily: { ...base.daily, ...(typeof daily.date === 'string' ? { date: daily.date } : {}), words: num(daily.words), grammar: num(daily.grammar), listening: num(daily.listening), quiz: num(daily.quiz), pronunciation: num(daily.pronunciation), rewarded: daily.rewarded === true },
    studySeconds: num(data.studySeconds),
    achievements: isObj(data.achievements) ? (Object.fromEntries(Object.entries(data.achievements).filter(([, v]) => typeof v === 'string')) as Record<string, string>) : {},
  };
}

export interface ParsedBackup {
  progress: UserProgress;
  preferences: Record<string, unknown>;
  exportedAt: string;
  version: number;
}

/** Reads a backup file's text. Throws BackupError with a friendly Vietnamese message. */
export function parseBackup(text: string, userId: string): ParsedBackup {
  if (text.length > MAX_FILE_BYTES) throw new BackupError('File quá lớn – đây không phải file tiến độ DeutschStart.');
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new BackupError('Không đọc được file. File có thể bị hỏng hoặc không phải file tiến độ DeutschStart.');
  }
  if (!isObj(json)) throw new BackupError('File không đúng định dạng tiến độ DeutschStart.');

  let file: Record<string, unknown> = json;
  // A raw progress object (no wrapper) is treated as version 0.
  if (file.app === undefined && isObj(file.vocabulary) && isObj(file.lessons)) file = { ...file, version: 0 };
  else if (file.app !== BACKUP_APP) throw new BackupError('Đây không phải file tiến độ của DeutschStart.');

  let version = typeof file.version === 'number' ? file.version : NaN;
  if (!Number.isInteger(version) || version < 0) throw new BackupError('File tiến độ không có số phiên bản hợp lệ.');
  if (version > BACKUP_VERSION) throw new BackupError('File tiến độ không tương thích với phiên bản hiện tại. File được tạo bởi phiên bản DeutschStart mới hơn – hãy tải lại trang để cập nhật.');
  const original = version;
  while (version < BACKUP_VERSION) {
    const step = MIGRATIONS[version];
    if (!step) throw new BackupError('File tiến độ không tương thích với phiên bản hiện tại. Vui lòng sử dụng file backup mới hơn.');
    file = step(file);
    version = file.version as number;
  }
  if (!isObj(file.data)) throw new BackupError('File tiến độ bị thiếu dữ liệu học tập.');
  return {
    progress: sanitize(file.data, userId),
    preferences: isObj(file.preferences) ? file.preferences : {},
    exportedAt: str(file.exportedAt),
    version: original,
  };
}

export function applyPreferences(prefs: Record<string, unknown>) {
  for (const key of PREFERENCE_KEYS) if (key in prefs) storage.set(key, prefs[key]);
}

/* ---------------- Merge: never downgrade ---------------- */

const STATE_RANK: Record<SrsState, number> = { new: 0, learning: 1, review: 2, mastered: 3 };
const later = (a?: string, b?: string) => ((a ?? '') >= (b ?? '') ? a : b);
const bigger = (a: ScoreStat, b: ScoreStat) => (b.total > a.total ? b : a);

/** The more advanced word state wins (higher review step); counters keep the larger value. */
function mergeWord(a: UserVocabulary, b: UserVocabulary): UserVocabulary {
  const aRank = STATE_RANK[a.state] * 10 + a.step;
  const bRank = STATE_RANK[b.state] * 10 + b.step;
  const best = bRank > aRank || (bRank === aRank && b.dueAt > a.dueAt) ? b : a;
  return { ...best, correct: Math.max(a.correct, b.correct), wrong: Math.max(a.wrong, b.wrong), saved: a.saved || b.saved, lastReviewedAt: later(a.lastReviewedAt, b.lastReviewedAt) };
}

function mergeLesson(a: LessonProgress, b: LessonProgress): LessonProgress {
  const skills: Partial<Record<Skill, number>> = { ...a.skills };
  for (const [k, v] of Object.entries(b.skills ?? {}) as [Skill, number][]) skills[k] = Math.max(v, skills[k] ?? 0);
  return {
    step: Math.max(a.step, b.step),
    totalSteps: Math.max(a.totalSteps, b.totalSteps),
    completed: a.completed || b.completed,
    mastered: !!(a.mastered || b.mastered),
    updatedAt: later(a.updatedAt, b.updatedAt)!,
    skills: a.skills || b.skills ? skills : undefined,
  };
}

function mergeRecords<T>(a: Record<string, T>, b: Record<string, T>, both: (x: T, y: T) => T): Record<string, T> {
  const out: Record<string, T> = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = k in out ? both(out[k], v) : v;
  return out;
}

/**
 * Current + imported progress → one, keeping the more advanced state of everything
 * (word mastery, lesson completion and scores, streak, achievements…). Also usable later
 * for syncing a device with a server without silently overwriting data.
 */
export function mergeProgress(current: UserProgress, imported: UserProgress, lessons: Lesson[]): UserProgress {
  const order = new Map(lessons.map((l) => [l.id, l.order]));
  const currentLessonId =
    (order.get(imported.currentLessonId ?? '') ?? -1) > (order.get(current.currentLessonId ?? '') ?? -1) ? imported.currentLessonId : current.currentLessonId;
  const newerStreak = (imported.streak.lastDate ?? '') > (current.streak.lastDate ?? '') ? imported.streak : current.streak;
  const daily =
    current.daily.date === imported.daily.date
      ? {
          date: current.daily.date,
          words: Math.max(current.daily.words, imported.daily.words),
          grammar: Math.max(current.daily.grammar, imported.daily.grammar),
          listening: Math.max(current.daily.listening, imported.daily.listening),
          quiz: Math.max(current.daily.quiz, imported.daily.quiz),
          pronunciation: Math.max(current.daily.pronunciation, imported.daily.pronunciation),
          rewarded: current.daily.rewarded || imported.daily.rewarded,
        }
      : current.daily.date > imported.daily.date
        ? current.daily
        : imported.daily;

  return {
    ...current,
    vocabulary: mergeRecords(current.vocabulary, imported.vocabulary, mergeWord),
    lessons: mergeRecords(current.lessons, imported.lessons, mergeLesson),
    grammarLessons: mergeRecords(current.grammarLessons, imported.grammarLessons, (a, b) => ({ completed: a.completed || b.completed, bestScore: Math.max(a.bestScore, b.bestScore) })),
    readings: mergeRecords(current.readings ?? {}, imported.readings ?? {}, (a, b) => ({ bestScore: Math.max(a.bestScore, b.bestScore) })),
    favorites: mergeRecords(current.favorites ?? {}, imported.favorites ?? {}, (a, b) => (a < b ? a : b)),
    mistakes: mergeRecords(current.mistakes, imported.mistakes, (a, b) => {
      const newer = b.lastAt > a.lastAt ? b : a;
      return { ...newer, count: Math.max(a.count, b.count) };
    }),
    articleStats: { der: bigger(current.articleStats.der, imported.articleStats.der), die: bigger(current.articleStats.die, imported.articleStats.die), das: bigger(current.articleStats.das, imported.articleStats.das) },
    listening: bigger(current.listening, imported.listening),
    quiz: bigger(current.quiz, imported.quiz),
    grammar: bigger(current.grammar, imported.grammar),
    skillStats: mergeRecords(current.skillStats ?? {}, imported.skillStats ?? {}, bigger) as UserProgress['skillStats'],
    pronunciation: {
      practiced: Math.max(current.pronunciation.practiced, imported.pronunciation.practiced),
      matched: Math.max(current.pronunciation.matched, imported.pronunciation.matched),
      sounds: [...new Set([...current.pronunciation.sounds, ...imported.pronunciation.sounds])],
    },
    alphabetSeen: [...new Set([...current.alphabetSeen, ...imported.alphabetSeen])],
    currentLessonId,
    streak: { ...newerStreak, longest: Math.max(current.streak.longest, imported.streak.longest) },
    daily,
    studySeconds: Math.max(current.studySeconds, imported.studySeconds),
    achievements: mergeRecords(current.achievements, imported.achievements, (a, b) => (a < b ? a : b)),
  };
}
