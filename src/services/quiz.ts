import type {
  Article,
  FillBlankItem,
  ListeningSentence,
  Phrase,
  Question,
  ScoreStat,
  SentenceExercise,
  TranslationItem,
  Vocabulary,
} from '@/types/models';
import { fold } from './search';

export const sentenceText = (s: SentenceExercise) => s.tokens.map((x) => x.text).join(' ') + (s.punctuation ?? '');

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const sample = <T,>(arr: readonly T[], n: number) => shuffle(arr).slice(0, n);

/** Word with article, e.g. "der Apfel". */
export const fullWord = (w: Vocabulary) => (w.article ? `${w.article} ${w.word}` : w.word);

const distractors = <T,>(pool: readonly T[], correct: T, key: (x: T) => string, n = 3) =>
  sample(
    pool.filter((x) => key(x) !== key(correct)),
    n,
  );

export function meaningQuestion(w: Vocabulary, pool: Vocabulary[]): Question {
  const opts = shuffle([w.meaning, ...distractors(pool, w, (x) => x.meaning).map((x) => x.meaning)]);
  return { id: `mc-${w.id}`, type: 'multiple-choice', prompt: `"${w.word}" nghĩa là gì?`, display: fullWord(w), audioText: fullWord(w), options: opts, answer: w.meaning, wordId: w.id, category: 'quiz', explanation: `${fullWord(w)} = ${w.meaning}. Ví dụ: ${w.example}` };
}

export function reverseMeaningQuestion(w: Vocabulary, pool: Vocabulary[]): Question {
  const opts = shuffle([fullWord(w), ...distractors(pool, w, (x) => x.id).map(fullWord)]);
  return { id: `rmc-${w.id}`, type: 'multiple-choice', prompt: `Chọn từ tiếng Đức cho "${w.meaning}"`, options: opts, answer: fullWord(w), wordId: w.id, category: 'quiz' };
}

export function articleExplanation(w: Vocabulary) {
  if (w.articleHint) return w.articleHint;
  return `Không có quy tắc chắc chắn – hãy học thuộc cả cụm "${fullWord(w)}".`;
}

export function articleQuestion(w: Vocabulary): Question {
  return {
    id: `art-${w.id}`,
    type: 'article',
    prompt: 'Chọn mạo từ đúng',
    display: `___ ${w.word}`,
    image: w.image,
    audioText: fullWord(w),
    options: ['der', 'die', 'das'],
    answer: w.article!,
    wordId: w.id,
    category: 'article',
    explanation: `${fullWord(w)} (${w.meaning}). ${articleExplanation(w)}`,
  };
}

export function listeningWordQuestion(w: Vocabulary, pool: Vocabulary[]): Question {
  const opts = shuffle([w.meaning, ...distractors(pool, w, (x) => x.meaning).map((x) => x.meaning)]);
  return { id: `lw-${w.id}`, type: 'listening', prompt: 'Nghe và chọn nghĩa đúng', audioText: fullWord(w), options: opts, answer: w.meaning, wordId: w.id, category: 'listening', explanation: `Bạn vừa nghe: ${fullWord(w)} ${w.ipa}` };
}

/** Only concrete nouns with a picture make sense for "Đây là gì?" questions. */
export const hasPicture = (w: Vocabulary) => w.type === 'noun' && !!(w.image.emoji || w.image.url);

export function imageQuestion(w: Vocabulary, pool: Vocabulary[]): Question {
  const opts = shuffle([fullWord(w), ...distractors(pool.filter((x) => x.image.emoji || x.image.url), w, (x) => x.id).map(fullWord)]);
  return { id: `img-${w.id}`, type: 'image', prompt: 'Đây là gì trong tiếng Đức?', image: w.image, options: opts, answer: fullWord(w), wordId: w.id, category: 'quiz', explanation: `${fullWord(w)} = ${w.meaning}` };
}

export function listeningSentenceQuestion(s: ListeningSentence): Question {
  return { id: `ls-${s.id}`, type: 'listening', prompt: 'Nghe và chọn câu bạn nghe được', audioText: s.de, options: shuffle([s.de, ...s.distractors]), answer: s.de, category: 'listening', explanation: `"${s.de}" – ${s.vi}` };
}

export function fillBlankQuestion(f: FillBlankItem): Question {
  return { id: `fb-${f.id}`, type: 'fill-blank', prompt: 'Nghe và điền từ còn thiếu', display: f.sentence, audioText: f.sentence.replace('___', f.answer), options: shuffle(f.options), answer: f.answer, category: 'listening', explanation: `${f.sentence.replace('___', f.answer)} – ${f.vi}` };
}

export function translationQuestion(t: TranslationItem): Question {
  return { id: `tr-${t.id}`, type: 'translation', prompt: 'Dịch sang tiếng Đức', display: t.vi, answer: t.accepted[0], accepted: t.accepted, audioText: t.accepted[0], category: 'quiz', explanation: `Đáp án gợi ý: ${t.accepted[0]}.` };
}

export function orderingQuestion(s: SentenceExercise): Question {
  return { id: `ord-${s.id}`, type: 'ordering', prompt: 'Sắp xếp thành câu đúng', display: s.vi, tokens: s.tokens, answer: sentenceText(s), accepted: s.alternatives, audioText: sentenceText(s), category: 'grammar', explanation: s.structure };
}

/** Normalise free-text answers: case, punctuation, whitespace, typographic quotes, and ä/ö/ü/ß typed as ae/oe/ue/ss. */
export const normalizeAnswer = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[’']/g, "'")
    .replace(/[.,!?;:"„“]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Edit distance, capped: returns early once it is clearly above `max`. */
function editDistance(a: string, b: string, max = 1) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}

export function isCorrect(q: Question, answer: string) {
  const candidates = [q.answer, ...(q.accepted ?? [])];
  if (q.match === 'loose') {
    // Vietnamese meanings: accents optional, one typo allowed in longer answers.
    const given = fold(normalizeAnswer(answer));
    return candidates.some((c) => {
      const want = fold(normalizeAnswer(c));
      return want === given || (want.length >= 5 && editDistance(want, given) <= 1);
    });
  }
  return candidates.map(normalizeAnswer).includes(normalizeAnswer(answer));
}

/**
 * Personalised article quiz: articles with lower accuracy get more questions.
 */
export function personalizedArticleQuiz(nouns: Vocabulary[], stats: Record<Article, ScoreStat>, count = 10, wrongIds: string[] = []) {
  const acc = (a: Article) => (stats[a].total ? stats[a].correct / stats[a].total : 0.5);
  const weight = (w: Vocabulary) => 1.2 - acc(w.article!) + (wrongIds.includes(w.id) ? 0.8 : 0) + Math.random() * 0.6;
  return [...nouns]
    .sort((a, b) => weight(b) - weight(a))
    .slice(0, count)
    .map(articleQuestion);
}

/** Questions for curriculum lessons, generated from the phrases the lesson shows. */
export function phraseQuestions(items: Phrase[], count: number): Question[] {
  const unique = items.filter((p, i, arr) => arr.findIndex((x) => x.vi === p.vi) === i);
  if (unique.length < 2) return [];
  return sample(unique, Math.min(count, unique.length)).map((p, i) => {
    const others = sample(
      unique.filter((x) => x.vi !== p.vi),
      3,
    );
    const listening = i % 2 === 1;
    return {
      id: `ph-${p.de}`,
      type: listening ? 'listening' : 'multiple-choice',
      prompt: listening ? 'Nghe và chọn nghĩa đúng' : `"${p.de}" nghĩa là gì?`,
      display: listening ? undefined : p.de,
      audioText: p.de,
      options: shuffle([p.vi, ...others.map((o) => o.vi)]),
      answer: p.vi,
      category: listening ? 'listening' : 'quiz',
      explanation: `${p.de} = ${p.vi}`,
    } satisfies Question;
  });
}
