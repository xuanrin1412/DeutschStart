import type { CefrLevel, Lesson, LessonProgress, SentenceExercise, Skill, UserProgress } from '@/types/models';
import { analyze, lexemesIn, wordStatus, type LexiconIndex } from './lexicon';
import { sentenceText } from './quiz';

/* ---------- Mastery thresholds ---------- */

/** Minimum first-try score (%) per skill before the next lesson unlocks. */
export const MASTERY: Record<Skill, number> = { vocab: 90, article: 85, listening: 80, sentence: 80, grammar: 80, pronunciation: 80 };

export const SKILL_LABELS: Record<Skill, string> = {
  vocab: 'Từ vựng',
  article: 'Mạo từ',
  listening: 'Nghe',
  sentence: 'Hiểu và ghép câu',
  grammar: 'Ngữ pháp',
  pronunciation: 'Phát âm',
};

export const AREA_LABELS: Record<Lesson['area'], string> = {
  alphabet: 'Bảng chữ cái',
  pronunciation: 'Phát âm',
  phrases: 'Câu giao tiếp',
  grammar: 'Ngữ pháp',
  vocabulary: 'Từ vựng',
  communication: 'Giao tiếp',
};

export const weakSkills = (skills: Partial<Record<Skill, number>>) =>
  (Object.entries(skills) as [Skill, number][]).filter(([s, v]) => v < MASTERY[s]).map(([s]) => s);

export const meetsMastery = (skills: Partial<Record<Skill, number>>) => Object.keys(skills).length > 0 && weakSkills(skills).length === 0;

/** Mastered = passed the gate. Lessons completed before mastery existed (no skill scores) count as mastered. */
export const isMastered = (lp?: LessonProgress) => !!lp && (lp.mastered === true || (lp.completed && !lp.skills));

/* ---------- What each lesson teaches ---------- */

export interface CurriculumIndex {
  /** Lexemes each lesson introduces: its explicit `teaches`, or the new words found in its text. */
  teaches: Map<string, string[]>;
  /** First lesson that teaches a lexeme ("Học từ này" → that lesson). */
  taughtIn: Map<string, string>;
  /** Everything taught before a lesson (for checking examples). */
  knownBefore: Map<string, Set<string>>;
}

interface TextItem {
  de: string;
  gloss?: Record<string, string>;
  where: string;
}

/** Every German text a lesson shows, with where it appears (for deriving new words and validation). */
export function lessonTexts(lesson: Lesson, sentenceById: Map<string, SentenceExercise>): TextItem[] {
  const out: TextItem[] = [];
  lesson.steps.forEach((s, i) => {
    const where = `bước ${i + 1} (${s.title})`;
    if (s.type === 'phrases') s.items.forEach((p) => out.push({ de: p.de, where }));
    if (s.type === 'examples') s.items.forEach((e) => out.push({ de: e.de, gloss: e.gloss, where }));
    if (s.type === 'words') Object.values(s.examples ?? {}).forEach((e) => out.push({ de: e.de, gloss: e.gloss, where }));
    if (s.type === 'builder')
      s.sentenceIds.forEach((id) => {
        const st = sentenceById.get(id);
        if (st) out.push({ de: sentenceText(st), where });
      });
  });
  (lesson.sentences ?? []).forEach((e) => out.push({ de: e.de, gloss: e.gloss, where: 'câu luyện tập' }));
  return out;
}

export function buildCurriculum(lessons: Lesson[], lexicon: LexiconIndex, sentenceById: Map<string, SentenceExercise>): CurriculumIndex {
  const teaches = new Map<string, string[]>();
  const taughtIn = new Map<string, string>();
  const knownBefore = new Map<string, Set<string>>();
  const cumulative = new Set<string>();
  for (const lesson of [...lessons].sort((a, b) => a.order - b.order)) {
    if (lesson.available === false) continue;
    knownBefore.set(lesson.id, new Set(cumulative));
    let ids = lesson.teaches;
    if (!ids.length) {
      const fresh: string[] = [];
      for (const t of lessonTexts(lesson, sentenceById))
        for (const group of lexemesIn(lexicon, t.de)) {
          if (group.some((id) => cumulative.has(id) || fresh.includes(id))) continue;
          fresh.push(group[0]);
        }
      ids = fresh;
    }
    teaches.set(lesson.id, ids);
    for (const id of ids) {
      cumulative.add(id);
      if (!taughtIn.has(id)) taughtIn.set(id, lesson.id);
    }
  }
  return { teaches, taughtIn, knownBefore };
}

/* ---------- What the learner knows ---------- */

const knownCache = new WeakMap<UserProgress, { cur: CurriculumIndex; set: Set<string> }>();

/** Lexemes the learner has been taught: words of completed lessons + words studied in flashcards / vocabulary. */
export function knownLexemes(progress: UserProgress, cur: CurriculumIndex): Set<string> {
  const hit = knownCache.get(progress);
  if (hit && hit.cur === cur) return hit.set;
  const set = new Set<string>();
  for (const [id, lp] of Object.entries(progress.lessons)) if (lp.completed || lp.mastered) cur.teaches.get(id)?.forEach((x) => set.add(x));
  for (const uv of Object.values(progress.vocabulary)) if (uv.state !== 'new') set.add(uv.wordId);
  knownCache.set(progress, { cur, set });
  return set;
}

/* ---------- Lesson status and unlocking ---------- */

export type LessonStatus = 'mastered' | 'review' | 'in-progress' | 'available' | 'locked' | 'planned';

/** Status of a lesson as shown next to a bookmark (and its badge colour). */
export const STATUS_LABELS: Record<LessonStatus, { fav: string; cls: string }> = {
  mastered: { fav: '✓ Đã hoàn thành', cls: 'badge-good' },
  review: { fav: '🔄 Cần ôn lại', cls: 'badge-warn' },
  'in-progress': { fav: '▶️ Đang học', cls: '' },
  available: { fav: '○ Chưa học', cls: '' },
  locked: { fav: '🔒 Chưa mở khóa', cls: 'badge-muted' },
  planned: { fav: '🕓 Sắp có', cls: 'badge-muted' },
};

export function missingPrerequisites(lesson: Lesson, progress: UserProgress): string[] {
  return lesson.prerequisites.filter((id) => !isMastered(progress.lessons[id]));
}

export function lessonStatus(lesson: Lesson, progress: UserProgress): LessonStatus {
  if (lesson.available === false) return 'planned';
  const lp = progress.lessons[lesson.id];
  if (isMastered(lp)) return 'mastered';
  if (lp?.completed) return 'review';
  if (lp && lp.step > 0) return 'in-progress';
  return missingPrerequisites(lesson, progress).length ? 'locked' : 'available';
}

/** The lesson to study next: in progress, needs review, or the first unlocked one. */
export function nextLesson(progress: UserProgress, lessons: Lesson[]): Lesson | undefined {
  const sorted = [...lessons].sort((a, b) => a.order - b.order);
  const current = sorted.find((l) => l.id === progress.currentLessonId);
  if (current && ['in-progress', 'review', 'available'].includes(lessonStatus(current, progress))) return current;
  return sorted.find((l) => ['in-progress', 'review', 'available'].includes(lessonStatus(l, progress)));
}

/* ---------- Mastery per level / area / skill ---------- */

/** One lesson as a 0–100 score: mastered = 100, otherwise average of its skill scores. */
export function lessonScore(lp?: LessonProgress) {
  if (isMastered(lp)) return 100;
  const vals = Object.values(lp?.skills ?? {});
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
}

export function levelMastery(level: CefrLevel, lessons: Lesson[], progress: UserProgress) {
  const inLevel = lessons.filter((l) => l.level === level && l.available !== false);
  const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0);
  const overall = avg(inLevel.map((l) => lessonScore(progress.lessons[l.id])));
  const areas = [...new Set(inLevel.map((l) => l.area))].map((area) => {
    const ls = inLevel.filter((l) => l.area === area);
    return { area, label: AREA_LABELS[area], pct: avg(ls.map((l) => lessonScore(progress.lessons[l.id]))), lessons: ls.length };
  });
  const skills = (Object.keys(SKILL_LABELS) as Skill[])
    .map((skill) => {
      const scores = inLevel.map((l) => progress.lessons[l.id]?.skills?.[skill]).filter((v): v is number => v !== undefined);
      return { skill, label: SKILL_LABELS[skill], pct: avg(scores), lessons: scores.length };
    })
    .filter((s) => s.lessons > 0);
  const mastered = inLevel.filter((l) => isMastered(progress.lessons[l.id])).length;
  return { overall, areas, skills, mastered, total: inLevel.length };
}

/* ---------- Dependency check (used by the content validation script) ---------- */

export interface DependencyProblem {
  lessonId: string;
  where: string;
  text: string;
  word: string;
  status: string;
}

/**
 * Lessons that list `teaches` explicitly (A0) must only show words taught before or in the lesson,
 * names, or words with an inline gloss. Returns every violation.
 */
export function validateCurriculum(lessons: Lesson[], lexicon: LexiconIndex, cur: CurriculumIndex, sentenceById: Map<string, SentenceExercise>): DependencyProblem[] {
  const problems: DependencyProblem[] = [];
  for (const lesson of lessons) {
    if (lesson.available === false || !lesson.teaches.length) continue;
    for (const id of lesson.teaches) if (!lexicon.byId.has(id)) problems.push({ lessonId: lesson.id, where: 'teaches', text: id, word: id, status: 'không có trong từ điển' });
    const known = new Set([...(cur.knownBefore.get(lesson.id) ?? []), ...lesson.teaches]);
    for (const t of lessonTexts(lesson, sentenceById))
      for (const seg of analyze(lexicon, t.de)) {
        if (seg.kind !== 'word') continue;
        const st = wordStatus(seg, known, undefined, t.gloss);
        if (st === 'unknown' || st === 'unmapped') problems.push({ lessonId: lesson.id, where: t.where, text: t.de, word: seg.text, status: st });
      }
  }
  return problems;
}
