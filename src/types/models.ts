/**
 * Core domain models for DeutschStart.
 * Content models (Vocabulary, Lesson, GrammarLesson, …) are pure data and can be
 * served from local files today or from Supabase / any API later.
 * User models (UserProgress, UserVocabulary, Mistake, …) are per-learner state.
 */

export type CefrLevel = 'A0' | 'A1' | 'A2' | 'B1';
export type Article = 'der' | 'die' | 'das';
export type WordType = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'conjunction' | 'preposition' | 'phrase' | 'interjection';
export type Difficulty = 1 | 2 | 3;

/* ---------- Media ---------- */

/** Picture for a word. `emoji` is the MVP fallback; `url` can point to a real image later. */
export interface MediaImage {
  emoji?: string;
  url?: string;
  alt: string;
}

/**
 * Audio reference. `text` is always present so TTS can speak it;
 * `url` (optional) points to a recorded/pre-generated file.
 */
export interface AudioRef {
  text: string;
  url?: string;
  lang?: string;
}

/* ---------- Content ---------- */

export interface VocabularyTopic {
  id: string;
  name: string; // Vietnamese
  nameDe: string;
  icon: string;
  description: string;
}

export interface Vocabulary {
  id: string;
  word: string; // without article, e.g. "Apfel"
  article?: Article;
  plural?: string; // e.g. "die Äpfel"
  type: WordType;
  ipa: string;
  meaning: string; // Vietnamese
  image: MediaImage;
  audio?: AudioRef; // defaults to article + word
  example: string;
  exampleVi: string;
  topicId: string;
  level: CefrLevel;
  difficulty: Difficulty;
  /** Optional hint shown after an article quiz answer. */
  articleHint?: string;
}

export interface AlphabetLetter {
  letter: string;
  name: string; // how the letter is spoken, e.g. "A" → "a"
  speak: string; // text sent to TTS; German spelling that forces the right vowel length, e.g. "C" → "Zeh"
  nameIpa: string;
  word: string; // example word incl. article
  wordIpa: string;
  image: MediaImage;
  meaning: string;
  example: string;
  exampleVi: string;
  tip?: string; // Vietnamese explanation for difficult letters
  special?: boolean; // Ä Ö Ü ß
}

export interface ExampleWord {
  de: string;
  ipa: string;
  vi: string;
}

export type LipShape = 'rounded' | 'spread' | 'neutral' | 'open' | 'lips';
export type TonguePosition = 'front-high' | 'back-high' | 'low' | 'tip-teeth' | 'uvular' | 'front-mid' | 'lips';

export interface PronunciationSound {
  id: string;
  grapheme: string; // ch, r, ü …
  ipa: string;
  title: string;
  category: 'vowel' | 'consonant' | 'special';
  explanation: string; // Vietnamese
  mouthTip: string;
  vietnameseHint?: string; // closest Vietnamese sound
  examples: ExampleWord[];
  mouth: { lips: LipShape; tongue: TonguePosition };
}

export interface Phrase {
  de: string;
  vi: string;
  ipa?: string;
  note?: string;
  emoji?: string;
}

/** A curriculum lesson is a sequence of steps rendered by the generic lesson player. */
export type LessonStep =
  | { type: 'intro'; title: string; body: string; why?: string }
  | { type: 'tip'; title: string; body: string }
  | { type: 'phrases'; title: string; items: Phrase[] }
  | { type: 'letters'; title: string; letters: string[] }
  | { type: 'sounds'; title: string; soundIds: string[] }
  | { type: 'builder'; title: string; sentenceIds: string[] }
  | { type: 'quiz'; title: string; count?: number };

export interface Lesson {
  id: string;
  level: CefrLevel;
  order: number;
  title: string;
  titleDe: string;
  description: string;
  minutes: number;
  icon: string;
  steps: LessonStep[];
}

export type TokenRole = 'subject' | 'verb' | 'time' | 'object' | 'place' | 'negation' | 'question' | 'other' | 'verb2';

export interface SentenceToken {
  text: string;
  role: TokenRole;
}

export interface SentenceExercise {
  id: string;
  tokens: SentenceToken[]; // in correct order
  vi: string;
  structure: string; // e.g. "Chủ ngữ + Động từ + Thời gian + Tân ngữ"
  punctuation?: '.' | '?' | '!';
  /** Other word orders that are also grammatically correct. */
  alternatives?: string[];
}

export interface GrammarExample {
  de: string;
  vi: string;
  /** Parts of the German sentence to highlight. */
  highlight?: string[];
}

export interface GrammarTable {
  headers: string[];
  rows: string[][];
  /** Column indices (German) that are read aloud together for each row. */
  audioCols: number[];
}

export interface GrammarLesson {
  id: string;
  order: number;
  title: string;
  titleDe: string;
  level: CefrLevel;
  summary: string;
  icon: string;
  available: boolean;
  explanation?: string[];
  table?: GrammarTable;
  structure?: SentenceToken[];
  structureLabel?: string;
  examples?: GrammarExample[];
  sentenceIds?: string[];
  questions?: Question[];
  tip?: string;
}

export interface DialogueLine {
  speaker: 'A' | 'B';
  de: string;
  vi: string;
}

export interface Conversation {
  id: string;
  title: string;
  titleDe: string;
  icon: string;
  level: CefrLevel;
  context: string;
  roles: { A: string; B: string };
  lines: DialogueLine[];
  keyPhrases?: Phrase[];
}

export interface ListeningSentence {
  id: string;
  de: string;
  vi: string;
  distractors: string[]; // similar-sounding German sentences
}

export interface FillBlankItem {
  id: string;
  sentence: string; // use ___ for the gap
  answer: string;
  options: string[];
  vi: string;
}

export interface TranslationItem {
  id: string;
  vi: string;
  accepted: string[]; // accepted German answers
}

/** A reading-comprehension question (Richtig/Falsch or multiple choice), like the A1 exam "Lesen" part. */
export interface ReadingQuestion {
  id: string;
  /** German statement or question about the text. */
  statement: string;
  options: string[];
  answer: string;
  /** Vietnamese explanation pointing to the relevant line of the text. */
  explanation: string;
}

export interface ReadingText {
  id: string;
  title: string; // Vietnamese
  titleDe: string;
  icon: string;
  level: CefrLevel;
  /** Kind of text, e.g. "E-Mail", "Anzeige", "Schild". */
  kind: string;
  /** Vietnamese task description. */
  context: string;
  /** German text, one entry per paragraph / line. */
  text: string[];
  /** Vietnamese translation, same length as `text`. */
  textVi: string[];
  glossary?: Phrase[];
  questions: ReadingQuestion[];
}

/* ---------- Questions / exercises ---------- */

export type QuestionType =
  | 'multiple-choice'
  | 'article'
  | 'listening'
  | 'image'
  | 'fill-blank'
  | 'translation'
  | 'typing'
  | 'ordering';

export type SkillCategory = 'vocab' | 'article' | 'listening' | 'grammar' | 'quiz' | 'pronunciation';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  /** Extra German text displayed with the prompt (e.g. "___ Tisch"). */
  display?: string;
  image?: MediaImage;
  /** Text to speak for listening questions. */
  audioText?: string;
  options?: string[];
  answer: string;
  /** Alternative correct answers (translation). */
  accepted?: string[];
  /** Tokens to arrange (ordering). */
  tokens?: SentenceToken[];
  explanation?: string;
  wordId?: string;
  category: SkillCategory;
  /** Language of `display` (default: German; Vietnamese for translation). */
  displayLang?: 'de' | 'vi';
  /** Language the learner types in (typing questions; default German). */
  inputLang?: 'de' | 'vi';
  /** "loose" ignores Vietnamese accents and allows one typo (used for Vietnamese meanings). */
  match?: 'exact' | 'loose';
  /** Revealed by the "Gợi ý" button on typing questions, e.g. "der A _ _ _ _". */
  hint?: string;
  /** With auto-speak on: say `audioText` when the question appears / right after it is answered. */
  speakOnShow?: boolean;
  speakOnAnswer?: boolean;
}

/* ---------- Users & progress ---------- */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export type SrsState = 'new' | 'learning' | 'review' | 'mastered';

export interface UserVocabulary {
  wordId: string;
  state: SrsState;
  step: number; // index into REVIEW_INTERVALS, -1 = not scheduled yet
  dueAt: string; // ISO date (yyyy-mm-dd)
  correct: number;
  wrong: number;
  saved: boolean;
  lastReviewedAt?: string;
}

export interface Mistake {
  id: string; // question id
  question: Question;
  userAnswer: string;
  count: number;
  lastAt: string;
  resolved: boolean;
}

export interface ScoreStat {
  correct: number;
  total: number;
}

export interface LessonProgress {
  step: number;
  totalSteps: number;
  completed: boolean;
  updatedAt: string;
}

export interface DailyChallengeState {
  date: string; // yyyy-mm-dd
  words: number;
  grammar: number;
  listening: number;
  quiz: number;
  pronunciation: number;
  rewarded: boolean;
}

export interface UserProgress {
  userId: string;
  version: 1;
  vocabulary: Record<string, UserVocabulary>;
  articleStats: Record<Article, ScoreStat>;
  listening: ScoreStat;
  quiz: ScoreStat;
  grammar: ScoreStat;
  pronunciation: { practiced: number; matched: number; sounds: string[] };
  lessons: Record<string, LessonProgress>;
  grammarLessons: Record<string, { completed: boolean; bestScore: number }>;
  /** Best score per reading text. Optional: progress saved before this field existed has none. */
  readings?: Record<string, { bestScore: number }>;
  mistakes: Record<string, Mistake>;
  alphabetSeen: string[];
  currentLessonId?: string;
  streak: { current: number; longest: number; lastDate?: string };
  daily: DailyChallengeState;
  studySeconds: number;
  achievements: Record<string, string>; // id → unlocked ISO date
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  isUnlocked: (p: UserProgress) => boolean;
}

export interface DailyGoal {
  key: keyof Omit<DailyChallengeState, 'date' | 'rewarded'>;
  label: string;
  target: number;
  icon: string;
  to: string;
}
