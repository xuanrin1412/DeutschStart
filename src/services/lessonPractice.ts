import type { AlphabetLetter, Lesson, LessonExample, Lexeme, PronunciationSound, Question, SentenceExercise, SentenceToken, Skill, TokenRole, UserProgress, Vocabulary } from '@/types/models';
import { analyze, type LexiconIndex } from './lexicon';
import { articleQuestion, fullWord, phraseQuestions, sample, sentenceText, shuffle } from './quiz';
import { buildQuestion, DEFAULT_SETTINGS } from './vocabPractice';

/**
 * Practice rounds for a lesson, generated from what the lesson teaches:
 * recognition → article → meaning → German recognition → listening → picture →
 * sentence meaning → fill the article → build the sentence → recall (typing).
 * Every question carries the skill it measures, so the mastery gate can score each skill.
 */

export interface PracticeContext {
  lexicon: LexiconIndex;
  wordById: Map<string, Vocabulary>;
  letterByChar: Map<string, AlphabetLetter>;
  soundById: Map<string, PronunciationSound>;
  sentenceById: Map<string, SentenceExercise>;
  vocabulary: Vocabulary[];
  /** Lexemes this lesson teaches (explicit or derived). */
  teaches: string[];
  /** Lexemes taught before this lesson – a pool for wrong options. */
  knownBefore: Set<string>;
  /** Sentences of earlier lessons – wrong options for "what does this sentence mean?". */
  earlierSentences: LessonExample[];
  progress: UserProgress;
}

export interface PracticeOptions {
  /** Only these skills (targeted review after a failed mastery gate). */
  onlySkills?: Skill[];
  /** Items per round (default 6, more for weak skills). */
  perRound?: number;
}

const PER_ROUND = 5;
/** Smaller rounds (meaning with article, picture, recall, phrase recall). */
const SMALL_ROUND = 3;

const isNoun = (w?: Vocabulary) => !!w && !!w.article;
const lemmaOf = (l: Lexeme, w?: Vocabulary) => (w ? fullWord(w) : l.lemma);
const typable = (s: string) => !/[…/()?!]/.test(s) && s.length <= 30;

function distractorTexts(correct: string, pools: string[][], n = 3) {
  const seen = new Set([correct]);
  const out: string[] = [];
  for (const pool of pools)
    for (const x of shuffle(pool)) {
      if (out.length >= n) return out;
      if (!seen.has(x)) {
        seen.add(x);
        out.push(x);
      }
    }
  return out;
}

const ROLE_BY_TYPE: Partial<Record<string, TokenRole>> = { pronoun: 'subject', verb: 'verb', noun: 'object', adverb: 'other', adjective: 'other' };
const QUESTION_WORDS = new Set(['wer', 'was', 'wo', 'woher', 'wohin', 'wie', 'wann', 'warum']);

/** Sentence → draggable word tokens (punctuation kept aside), with a guessed role for the colour chip. */
function tokensFor(lexicon: LexiconIndex, sentence: string): { tokens: SentenceToken[]; punctuation: '.' | '?' | '!' } | null {
  if (sentence.includes('–')) return null;
  const words = analyze(lexicon, sentence).filter((s) => s.kind === 'word');
  if (words.length < 3 || words.length > 8) return null;
  const tokens = words.map((w): SentenceToken => {
    const lower = w.text.toLowerCase();
    const lx = w.kind === 'word' ? w.lexemes[0] : undefined;
    const role: TokenRole = QUESTION_WORDS.has(lower) ? 'question' : lower === 'nicht' ? 'negation' : ROLE_BY_TYPE[lx?.type ?? ''] ?? 'other';
    return { text: w.text, role };
  });
  const last = sentence.trim().slice(-1);
  return { tokens, punctuation: last === '?' || last === '!' ? last : '.' };
}

export function buildPractice(lesson: Lesson, ctx: PracticeContext, opts: PracticeOptions = {}): Question[] {
  const want = (s: Skill) => !opts.onlySkills || opts.onlySkills.includes(s);
  const base = opts.perRound ?? PER_ROUND;
  // Adaptive: skills the learner is weak at site-wide get extra items.
  const stats = ctx.progress.skillStats ?? {};
  const per = (s: Skill) => {
    const st = stats[s];
    const weak = st && st.total >= 10 && st.correct / st.total < 0.7;
    return base + (weak ? 3 : 0);
  };

  const lexemes = ctx.teaches.map((id) => ctx.lexicon.byId.get(id)).filter((l): l is Lexeme => !!l && l.type !== 'name');
  const vocabOf = (l: Lexeme) => (l.vocabId ? ctx.wordById.get(l.vocabId) : undefined);
  const nouns = lexemes.map(vocabOf).filter(isNoun) as Vocabulary[];
  const knownLex = [...ctx.knownBefore].map((id) => ctx.lexicon.byId.get(id)).filter((l): l is Lexeme => !!l);
  const meaningPool = [lexemes.map((l) => l.meaning), knownLex.map((l) => l.meaning), ctx.vocabulary.map((w) => w.meaning)];
  const lemmaPool = [lexemes.map((l) => lemmaOf(l, vocabOf(l))), knownLex.map((l) => lemmaOf(l, vocabOf(l)))];
  const qid = (round: string, key: string) => `ls-${lesson.id}-${round}-${key}`;
  const out: Question[] = [];
  const push = (_key: string, label: string, qs: Question[]) => out.push(...qs.map((q) => ({ ...q, round: label })));

  // Letters and sounds (alphabet / pronunciation lessons).
  const letters = lesson.steps.flatMap((s) => (s.type === 'letters' ? s.letters : [])).map((c) => ctx.letterByChar.get(c)).filter((l): l is AlphabetLetter => !!l);
  if (letters.length && want('pronunciation')) {
    const all = [...ctx.letterByChar.values()];
    push('letter-hear', 'Nghe tên chữ cái', sample(letters, Math.min(per('pronunciation') + 2, letters.length)).map((l) => ({
      id: qid('letter-hear', l.letter), type: 'listening', skill: 'pronunciation', category: 'listening',
      prompt: 'Nghe tên chữ cái và chọn chữ đúng', audioText: l.speak,
      options: shuffle([l.letter, ...distractorTexts(l.letter, [letters.map((x) => x.letter), all.map((x) => x.letter)])]), answer: l.letter,
      explanation: `${l.letter} đọc là "${l.name}" ${l.nameIpa}.`,
    })));
    push('letter-name', 'Tên chữ cái', sample(letters, Math.min(per('pronunciation'), letters.length)).map((l) => ({
      id: qid('letter-name', l.letter), type: 'multiple-choice', skill: 'pronunciation', category: 'quiz',
      prompt: `Chữ "${l.letter}" đọc là gì khi đánh vần?`, display: l.letter, audioText: l.speak,
      options: shuffle([`"${l.name}"`, ...distractorTexts(`"${l.name}"`, [letters.map((x) => `"${x.name}"`), all.map((x) => `"${x.name}"`)])]), answer: `"${l.name}"`,
      explanation: `${l.letter} = "${l.name}" ${l.nameIpa}.`,
    })));
  }
  const sounds = lesson.steps.flatMap((s) => (s.type === 'sounds' ? s.soundIds : [])).map((id) => ctx.soundById.get(id)).filter((s): s is PronunciationSound => !!s);
  if (sounds.length && want('pronunciation')) {
    const examples = sounds.flatMap((s) => s.examples.map((e) => ({ ...e, sound: s })));
    push('sound-hear', 'Nghe và nhận ra âm', sample(examples, Math.min(per('pronunciation'), examples.length)).map((e) => ({
      id: qid('sound-hear', e.de), type: 'listening', skill: 'pronunciation', category: 'listening',
      prompt: 'Nghe và chọn từ bạn nghe được', audioText: e.de,
      options: shuffle([e.de, ...distractorTexts(e.de, [examples.map((x) => x.de)])]), answer: e.de,
      explanation: `${e.de} ${e.ipa} – ${e.vi}. Âm "${e.sound.grapheme}".`,
    })));
  }

  // Phrase lists (A1 lessons in phrase format).
  const phrases = lesson.steps.flatMap((s) => (s.type === 'phrases' ? s.items : []));
  if (phrases.length >= 2) {
    const qs = phraseQuestions(phrases, Math.min(per('vocab'), phrases.length)).map((q) => ({ ...q, id: qid('phrase', q.id), skill: (q.type === 'listening' ? 'listening' : 'vocab') as Skill }));
    push('phrases', 'Hiểu câu giao tiếp', qs.filter((q) => want(q.skill)));
    if (want('vocab'))
      push('phrase-recall', 'Nói bằng tiếng Đức', sample(phrases, Math.min(SMALL_ROUND, phrases.length)).map((p) => ({
        id: qid('phrase-recall', p.de), type: 'multiple-choice', skill: 'vocab', category: 'quiz',
        prompt: `Nói "${p.vi}" bằng tiếng Đức thế nào?`,
        options: shuffle([p.de, ...distractorTexts(p.de, [phrases.map((x) => x.de)])]), answer: p.de, audioText: p.de,
        explanation: `${p.de} = ${p.vi}`,
      })));
  }

  if (lexemes.length) {
    const pick = (list: Lexeme[], s: Skill) => sample(list, Math.min(phrases.length ? SMALL_ROUND : per(s), list.length));
    // R1 recognition: the bare word → meaning ("Frau" nghĩa là gì?)
    if (want('vocab'))
      push('recognize', 'Vòng 1 · Nhận biết từ', pick(lexemes, 'vocab').map((l) => {
        const w = vocabOf(l);
        const shown = w?.article ? w.word : l.lemma;
        return {
          id: qid('recognize', l.id), type: 'multiple-choice', skill: 'vocab', category: 'quiz', wordId: w?.id,
          prompt: `"${shown}" nghĩa là gì?`, display: shown, audioText: lemmaOf(l, w), speakOnShow: true,
          options: shuffle([l.meaning, ...distractorTexts(l.meaning, meaningPool)]), answer: l.meaning,
          explanation: `${lemmaOf(l, w)} = ${l.meaning}`,
        } satisfies Question;
      }));
    // R2 article
    if (nouns.length && want('article'))
      push('article', 'Vòng 2 · Mạo từ', sample(nouns, Math.min(per('article'), nouns.length)).map((w) => ({ ...articleQuestion(w), id: qid('article', w.id), skill: 'article' as Skill })));
    // R3 meaning with the article ("die Frau" nghĩa là gì?)
    if (nouns.length && want('vocab'))
      push('meaning', 'Vòng 3 · Hiểu cụm từ', sample(nouns, Math.min(SMALL_ROUND, nouns.length)).map((w) => ({
        id: qid('meaning', w.id), type: 'multiple-choice', skill: 'vocab', category: 'quiz', wordId: w.id,
        prompt: `"${fullWord(w)}" nghĩa là gì?`, display: fullWord(w), audioText: fullWord(w),
        options: shuffle([w.meaning, ...distractorTexts(w.meaning, meaningPool)]), answer: w.meaning,
        explanation: `${w.article} = mạo từ, ${w.word} = ${w.meaning} → ${fullWord(w)} = ${w.meaning}.`,
      })));
    // R4 German recognition (Vietnamese → choose German)
    if (want('vocab'))
      push('find', 'Vòng 4 · Tìm từ tiếng Đức', pick(lexemes, 'vocab').map((l) => {
        const w = vocabOf(l);
        const right = lemmaOf(l, w);
        return {
          id: qid('find', l.id), type: 'multiple-choice', skill: 'vocab', category: 'quiz', wordId: w?.id,
          prompt: `Từ nào nghĩa là "${l.meaning}"?`,
          options: shuffle([right, ...distractorTexts(right, lemmaPool)]), answer: right, audioText: right,
          explanation: `${right} = ${l.meaning}`,
        } satisfies Question;
      }));
    // R5 listening
    if (want('listening'))
      push('hear', 'Vòng 5 · Nghe', pick(lexemes, 'listening').map((l) => {
        const w = vocabOf(l);
        const right = lemmaOf(l, w);
        return {
          id: qid('hear', l.id), type: 'listening', skill: 'listening', category: 'listening', wordId: w?.id,
          prompt: 'Nghe và chọn từ bạn nghe được', audioText: right,
          options: shuffle([right, ...distractorTexts(right, lemmaPool)]), answer: right,
          explanation: `Bạn vừa nghe: ${right} – ${l.meaning}`,
        } satisfies Question;
      }));
    // R6 picture
    const pictured = nouns.filter((w) => w.image.emoji || w.image.url);
    if (pictured.length && want('vocab'))
      push('image', 'Vòng 6 · Hình ảnh', sample(pictured, Math.min(SMALL_ROUND, pictured.length)).map((w) => ({
        id: qid('image', w.id), type: 'image', skill: 'vocab', category: 'quiz', wordId: w.id,
        prompt: 'Đây là gì trong tiếng Đức?', image: w.image,
        options: shuffle([fullWord(w), ...distractorTexts(fullWord(w), lemmaPool)]), answer: fullWord(w),
        explanation: `${fullWord(w)} = ${w.meaning}`,
      })));
  }

  // Sentences of this lesson (explicit + sentence builder).
  const builder = lesson.steps
    .flatMap((s) => (s.type === 'builder' ? s.sentenceIds : []))
    .map((id) => ctx.sentenceById.get(id))
    .filter((s): s is SentenceExercise => !!s)
    .map((s) => ({ de: sentenceText(s), vi: s.vi }));
  const sentences = [...(lesson.sentences ?? []), ...builder];
  if (sentences.length) {
    const viPool = [sentences.map((s) => s.vi), ctx.earlierSentences.map((s) => s.vi)];
    // R7 sentence comprehension
    if (want('sentence'))
      push('sentence-meaning', 'Vòng 7 · Hiểu câu', sample(sentences, Math.min(per('sentence') - 2, sentences.length)).map((s) => ({
        id: qid('sentence-meaning', s.de), type: 'multiple-choice', skill: 'sentence', category: 'quiz',
        prompt: 'Câu này nghĩa là gì?', display: s.de, audioText: s.de,
        options: shuffle([s.vi, ...distractorTexts(s.vi, viPool)]), answer: s.vi,
        explanation: `${s.de} = ${s.vi}`,
      })));
    // R8 fill the article into a sentence
    if (want('article')) {
      const fills: Question[] = [];
      for (const s of sentences) {
        const segs = analyze(ctx.lexicon, s.de);
        for (let i = 0; i < segs.length; i++) {
          const a = segs[i];
          if (a.kind !== 'word' || !['der', 'die', 'das'].includes(a.text.toLowerCase())) continue;
          const noun = segs.slice(i + 1).find((x) => x.kind === 'word');
          const w = noun?.kind === 'word' ? noun.lexemes.map((l) => (l.vocabId ? ctx.wordById.get(l.vocabId) : undefined)).find(isNoun) : undefined;
          if (!w || w.article !== a.text.toLowerCase() || noun?.kind !== 'word' || noun.text !== w.word) continue;
          const before = segs.slice(0, i).map((x) => x.text).join('');
          const after = segs.slice(i + 1).map((x) => x.text).join('');
          const cap = i === 0 || /[.!?]\s*$/.test(before);
          const opts = ['der', 'die', 'das'].map((o) => (cap ? o[0].toUpperCase() + o.slice(1) : o));
          fills.push({
            id: qid('fill', s.de), type: 'fill-blank', skill: 'article', category: 'article', wordId: w.id,
            prompt: `Điền mạo từ đúng – "${s.vi}"`, display: `${before}___${after}`, audioText: s.de,
            options: opts, answer: cap ? a.text[0].toUpperCase() + a.text.slice(1) : a.text,
            explanation: `${fullWord(w)} (${w.meaning}) → ${s.de}`,
          });
          break;
        }
      }
      push('fill', 'Vòng 8 · Điền vào chỗ trống', sample(fills, Math.min(per('article') - 2, fills.length)));
    }
    // R9 build the sentence
    if (want('sentence')) {
      const built = sentences.map((s) => ({ s, t: tokensFor(ctx.lexicon, s.de) })).filter((x) => x.t);
      push('build', 'Vòng 9 · Ghép câu', sample(built, Math.min(3, built.length)).map(({ s, t }) => ({
        id: qid('build', s.de), type: 'ordering', skill: 'sentence', category: 'grammar',
        prompt: 'Sắp xếp thành câu đúng', display: s.vi, tokens: t!.tokens, audioText: s.de,
        answer: t!.tokens.map((x) => x.text).join(' ') + t!.punctuation,
        explanation: lesson.patterns?.length ? `Mẫu câu: ${lesson.patterns.join(' · ')}` : 'Động từ đứng ở vị trí 2 trong câu kể.',
      })));
    }
  }

  // Hand-written questions of the lesson (grammar rules, pronunciation rules…).
  (lesson.questions ?? []).forEach((lq, i) => {
    const skill = lq.skill ?? 'grammar';
    if (!want(skill)) return;
    out.push({
      id: qid('q', String(i)), type: 'fill-blank', skill, category: skill === 'pronunciation' ? 'quiz' : 'grammar',
      prompt: lq.prompt, display: lq.display, options: shuffle(lq.options), answer: lq.answer, explanation: lq.explanation,
      round: skill === 'pronunciation' ? 'Quy tắc phát âm' : 'Ngữ pháp',
    });
  });

  // R10 recall: type the German word yourself.
  if (lexemes.length && want('vocab')) {
    const recall = lexemes.filter((l) => typable(lemmaOf(l, vocabOf(l))));
    push('recall', 'Vòng 10 · Nhớ lại', sample(recall, Math.min(SMALL_ROUND, recall.length)).map((l) => {
      const w = vocabOf(l);
      if (w) return { ...buildQuestion(w, ctx.vocabulary, 'vi-de', 'typing', { ...DEFAULT_SETTINGS, requireArticle: true }), id: qid('recall', l.id), skill: 'vocab' as Skill };
      return {
        id: qid('recall', l.id), type: 'typing', skill: 'vocab', category: 'quiz',
        prompt: 'Viết từ tiếng Đức', display: l.meaning, displayLang: 'vi', answer: l.lemma, audioText: l.lemma, speakOnAnswer: true,
        hint: [...l.lemma].map((c, j) => (j === 0 || c === ' ' ? c : '_')).join(' '),
        explanation: `${l.lemma} = ${l.meaning}`,
      } satisfies Question;
    }));
  }
  return out;
}

/** A few questions about earlier lessons, shown before new content starts. Not part of the mastery score. */
export function buildWarmup(ctx: PracticeContext, previous: string[]): Question[] {
  const lex = sample(previous, 6)
    .map((id) => ctx.lexicon.byId.get(id))
    .filter((l): l is Lexeme => !!l)
    .slice(0, 4);
  const pool = [[...ctx.knownBefore].map((id) => ctx.lexicon.byId.get(id)?.meaning).filter((m): m is string => !!m), ctx.vocabulary.map((w) => w.meaning)];
  return lex.map((l) => {
    const w = l.vocabId ? ctx.wordById.get(l.vocabId) : undefined;
    if (w?.article && Math.random() < 0.5) return { ...articleQuestion(w), id: `warmup-art-${w.id}`, round: 'Ôn bài cũ' };
    const shown = lemmaOf(l, w);
    return {
      id: `warmup-${l.id}`, type: 'multiple-choice', category: 'quiz', wordId: w?.id, round: 'Ôn bài cũ',
      prompt: `"${shown}" nghĩa là gì?`, display: shown, audioText: shown,
      options: shuffle([l.meaning, ...distractorTexts(l.meaning, pool)]), answer: l.meaning,
      explanation: `${shown} = ${l.meaning}`,
    } satisfies Question;
  });
}

/** A skill counts for the mastery gate only with at least this many questions (one slip must not block a lesson). */
export const MIN_QUESTIONS_FOR_GATE = 3;

/** First-try score per skill (%) from answered questions; skills with too few questions are left out. */
export function scoreBySkill(results: { skill: Skill; ok: boolean }[]): Partial<Record<Skill, number>> {
  const acc: Partial<Record<Skill, { c: number; t: number }>> = {};
  for (const r of results) {
    const a = (acc[r.skill] ??= { c: 0, t: 0 });
    a.t++;
    if (r.ok) a.c++;
  }
  return Object.fromEntries(
    Object.entries(acc)
      .filter(([, v]) => v!.t >= MIN_QUESTIONS_FOR_GATE)
      .map(([k, v]) => [k, Math.round((v!.c / v!.t) * 100)]),
  ) as Partial<Record<Skill, number>>;
}
