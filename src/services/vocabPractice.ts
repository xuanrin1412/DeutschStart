import type { Question, UserProgress, Vocabulary } from '@/types/models';
import { fullWord, listeningWordQuestion, meaningQuestion, reverseMeaningQuestion, sample, shuffle } from './quiz';
import { dueQueue } from './srs';

/** What the learner sees → what they answer. */
export type Direction = 'de-vi' | 'vi-de' | 'listen' | 'cloze';
/** How they answer. */
export type AnswerKind = 'choice' | 'typing';
export type WordSource = 'smart' | 'new' | 'due' | 'weak' | 'learned' | 'saved' | 'topic';

export interface PracticeSettings {
  directions: Direction[];
  kinds: AnswerKind[];
  source: WordSource;
  topicId: string;
  /** Words per round; 0 = every word in the chosen group. */
  count: number;
  /** Typing German nouns: "der Apfel" required, not just "Apfel". */
  requireArticle: boolean;
  /** A wrong word comes back later in the same round. */
  repeatWrong: boolean;
}

export const DEFAULT_SETTINGS: PracticeSettings = {
  directions: ['de-vi', 'vi-de'],
  kinds: ['choice', 'typing'],
  source: 'smart',
  topicId: '',
  count: 10,
  requireArticle: true,
  repeatWrong: true,
};

/** Picks the words for one round. */
export function pickWords(all: Vocabulary[], p: UserProgress, s: PracticeSettings): Vocabulary[] {
  const state = (w: Vocabulary) => p.vocabulary[w.id]?.state ?? 'new';
  const wrong = (w: Vocabulary) => p.vocabulary[w.id]?.wrong ?? 0;
  const byId = new Map(all.map((w) => [w.id, w]));
  const due = dueQueue(p.vocabulary)
    .map((id) => byId.get(id))
    .filter((w): w is Vocabulary => !!w);
  const fresh = all.filter((w) => state(w) === 'new').sort((a, b) => a.difficulty - b.difficulty);
  const learned = all.filter((w) => state(w) !== 'new');
  const weak = all.filter((w) => wrong(w) > 0).sort((a, b) => wrong(b) - wrong(a));

  const n = s.count > 0 ? s.count : all.length;

  switch (s.source) {
    case 'new':
      return fresh.slice(0, n);
    case 'due':
      return due.slice(0, n);
    case 'weak':
      return weak.slice(0, n);
    case 'learned':
      return sample(learned, n);
    case 'saved':
      return sample(
        all.filter((w) => p.vocabulary[w.id]?.saved),
        n,
      );
    case 'topic':
      return sample(
        all.filter((w) => w.topicId === s.topicId),
        n,
      );
    case 'smart': {
      // Due reviews first, then words often answered wrong, then a few new words.
      const picked: Vocabulary[] = [];
      const add = (list: Vocabulary[], max: number) => {
        for (const w of list) {
          if (picked.length >= max) return;
          if (!picked.includes(w)) picked.push(w);
        }
      };
      add(due, Math.ceil(n * 0.5));
      add(weak, Math.ceil(n * 0.7));
      add(fresh, n);
      add(shuffle(learned), n);
      return shuffle(picked);
    }
  }
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Finds the word inside its own example sentence (only exact forms, e.g. "Apfel" in "Ich esse einen Apfel."). */
function clozeMatch(w: Vocabulary) {
  const m = new RegExp(`(^|[^\\p{L}])(${escapeRe(w.word)})(?=[^\\p{L}]|$)`, 'iu').exec(w.example);
  if (!m) return null;
  const start = m.index + m[1].length;
  return { found: m[2], sentence: w.example.slice(0, start) + '___' + w.example.slice(start + m[2].length) };
}

export const canCloze = (w: Vocabulary) => !!clozeMatch(w);

/** "der Apfel" → "der A _ _ _ _": article and first letter of each word, the rest as gaps. */
function germanHint(text: string, keepArticle: boolean) {
  const parts = text.split(' ');
  return parts
    .map((part, i) =>
      keepArticle && i === 0 && ['der', 'die', 'das'].includes(part)
        ? part
        : [...part].map((c, j) => (j === 0 || !/\p{L}/u.test(c) ? c : '_')).join(' '),
    )
    .join('   ');
}

/** Vietnamese meaning split into acceptable answers: "đồng hồ; giờ" → ["đồng hồ", "giờ"], "(nam)" dropped. */
function meaningAnswers(meaning: string) {
  const clean = meaning.replace(/\(.*?\)/g, '').trim();
  return [...new Set([meaning, clean, ...clean.split(/[;,]/).map((x) => x.trim())].filter(Boolean))];
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** One question for one word in the given direction and answer kind. */
export function buildQuestion(w: Vocabulary, pool: Vocabulary[], dir: Direction, kind: AnswerKind, s: PracticeSettings): Question {
  const full = fullWord(w);
  const detail = `${full} = ${w.meaning}${w.plural ? ` · số nhiều: ${w.plural}` : ''}`;
  const base = { id: `vp-${dir}-${kind}-${w.id}`, wordId: w.id, audioText: full, speakOnAnswer: true, explanation: `${detail}. Ví dụ: ${w.example}` };
  // Nouns may be typed without the article unless the setting requires it.
  const germanAccepted = w.article && !s.requireArticle ? [w.word] : [];
  const articleNote = w.article ? (s.requireArticle ? ' (kèm mạo từ der/die/das)' : '') : '';

  if (dir === 'de-vi') {
    if (kind === 'choice') return { ...meaningQuestion(w, pool), ...base, speakOnShow: true };
    return {
      ...base,
      type: 'typing',
      category: 'quiz',
      prompt: `"${w.word}" nghĩa là gì? Gõ nghĩa tiếng Việt`,
      display: full,
      inputLang: 'vi',
      match: 'loose',
      answer: w.meaning,
      accepted: meaningAnswers(w.meaning),
      hint: `Bắt đầu bằng "${w.meaning.charAt(0)}…" · ${w.meaning.split(/[;,]/)[0].trim().split(' ').length} chữ`,
      speakOnShow: true,
    };
  }

  if (dir === 'vi-de') {
    if (kind === 'choice') return { ...reverseMeaningQuestion(w, pool), ...base };
    return {
      ...base,
      type: 'typing',
      category: 'quiz',
      prompt: `Viết từ tiếng Đức${articleNote}`,
      display: w.meaning,
      displayLang: 'vi',
      image: w.image.emoji || w.image.url ? w.image : undefined,
      answer: full,
      accepted: germanAccepted,
      hint: germanHint(full, true),
    };
  }

  if (dir === 'listen') {
    if (kind === 'choice') return { ...listeningWordQuestion(w, pool), ...base, speakOnAnswer: false };
    return {
      ...base,
      type: 'typing',
      category: 'listening',
      prompt: `Nghe và viết lại từ tiếng Đức${articleNote}`,
      answer: full,
      accepted: germanAccepted,
      hint: germanHint(full, true),
      speakOnAnswer: false,
    };
  }

  // Cloze: the word is missing from its example sentence.
  const cz = clozeMatch(w)!;
  const prompt = `Điền từ còn thiếu – "${w.exampleVi}"`;
  if (kind === 'choice') {
    const upper = cz.found.charAt(0) === cz.found.charAt(0).toUpperCase();
    const others = sample(
      pool.filter((x) => x.id !== w.id && x.type === w.type && x.word.toLowerCase() !== cz.found.toLowerCase()),
      3,
    ).map((x) => (upper ? cap(x.word) : x.word));
    return { ...base, type: 'multiple-choice', category: 'quiz', prompt, display: cz.sentence, options: shuffle([cz.found, ...others]), answer: cz.found, audioText: w.example };
  }
  return { ...base, type: 'typing', category: 'quiz', prompt, display: cz.sentence, answer: cz.found, hint: germanHint(cz.found, false), audioText: w.example };
}

/** A round: each word gets a random direction/kind from the chosen settings (cloze only where the word appears in its example). */
export function buildRound(words: Vocabulary[], pool: Vocabulary[], s: PracticeSettings): Question[] {
  return words.map((w) => {
    const dirs = s.directions.filter((d) => d !== 'cloze' || canCloze(w));
    const dir = dirs.length ? dirs[Math.floor(Math.random() * dirs.length)] : 'de-vi';
    const kind = s.kinds[Math.floor(Math.random() * s.kinds.length)] ?? 'choice';
    return buildQuestion(w, pool, dir, kind, s);
  });
}
