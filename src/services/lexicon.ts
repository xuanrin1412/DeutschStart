import type { Lexeme, Vocabulary } from '@/types/models';
import { EXTRA_FORMS, grammarLexemes, NAMES } from '@/data/lexicon';
import { fullWord } from './quiz';

/**
 * The lexicon maps every spelling found in German text to the word that explains it:
 * bin → sein, Katzen → die Katze, "guten morgen" → Guten Morgen. It powers the
 * unknown-word detection: a sentence is split into words and each word is checked
 * against what the learner has already been taught.
 */
export interface LexiconIndex {
  byId: Map<string, Lexeme>;
  /** Single-word form → candidate lexemes (e.g. "die" → article die; "sein" → verb sein + possessive sein). */
  forms: Map<string, Lexeme[]>;
  /** Multi-word forms ("guten morgen") → lexemes; matched before single words. */
  phrases: Map<string, Lexeme[]>;
  maxPhraseWords: number;
  names: Set<string>;
}

export type Segment =
  | { kind: 'text'; text: string }
  | {
      kind: 'word';
      text: string;
      /** Alternatives: the word is understood if ANY of them is known. */
      lexemes: Lexeme[];
      /** Compound / number made of parts: understood only if ALL parts are known. */
      parts?: Lexeme[];
      name?: boolean;
    };

const norm = (s: string) => s.toLowerCase().replace(/'/g, '’');

const SEPARABLE = ['zurück', 'fern', 'auf', 'aus', 'ein', 'mit', 'an', 'ab', 'um', 'zu', 'vor'];
const NOT_SEPARABLE = new Set(['wiederholen', 'unterschreiben', 'anprobieren']);
const INSEPARABLE_PREFIX = /^(be|ver|er|ent|ge|zer|emp|miss)/;

function verbForms(inf: string): string[] {
  const out: string[] = [inf];
  let prefix = '';
  let base = inf;
  const sep = SEPARABLE.find((p) => inf.startsWith(p) && inf.length > p.length + 3 && !NOT_SEPARABLE.has(inf));
  if (sep) {
    prefix = sep;
    base = inf.slice(sep.length);
  }
  const stem = base.endsWith('en') ? base.slice(0, -2) : base.endsWith('n') ? base.slice(0, -1) : base;
  // arbeit-est, find-et, atm-et – but not komm-st / lern-st.
  const needsE = /([td]|[^aeioulrhmn][mn])$/.test(stem);
  const sibilant = /(s|ß|z|x)$/.test(stem);
  const present = [stem + 'e', sibilant ? stem + 't' : stem + (needsE ? 'est' : 'st'), stem + (needsE ? 'et' : 't'), base, stem];
  out.push(...present);
  if (prefix) out.push(...present.map((f) => prefix + f));
  // Partizip II
  const ge = INSEPARABLE_PREFIX.test(base) || base.endsWith('ieren') ? '' : 'ge';
  out.push(prefix + ge + stem + (needsE ? 'et' : 't'));
  return out;
}

function adjectiveForms(adj: string): string[] {
  const base = adj.endsWith('el') ? adj.slice(0, -2) + 'l' : adj.endsWith('er') && adj.length > 4 ? adj.slice(0, -2) + 'r' : adj;
  if (adj.endsWith('e')) return [adj, adj + 'n', adj + 'r', adj + 's', adj + 'm'];
  return [adj, ...['e', 'en', 'er', 'es', 'em'].map((e) => base + e)];
}

/** Every vocabulary entry becomes a lexeme with its generated forms. */
export function vocabLexeme(w: Vocabulary): Lexeme {
  const word = w.word;
  const forms = new Set<string>([word]);
  if (w.type === 'noun') {
    const plural = w.plural?.replace(/^die /, '');
    if (plural) {
      forms.add(plural);
      if (!/[ns]$/.test(plural)) forms.add(plural + 'n');
    }
    if (/[^e]$/.test(word) && !word.includes(' ')) forms.add(word + 's');
  }
  if (w.type === 'verb') verbForms(word).forEach((f) => forms.add(f));
  if (w.type === 'adjective') adjectiveForms(word).forEach((f) => forms.add(f));
  (EXTRA_FORMS[w.id] ?? []).forEach((f) => forms.add(f));
  return {
    id: w.id,
    lemma: fullWord(w),
    forms: [...forms].map((f) => norm(f).replace(/[?!.,]/g, '').trim()),
    meaning: w.meaning,
    type: w.type,
    vocabId: w.id,
  };
}

export function buildLexicon(vocabulary: Vocabulary[]): LexiconIndex {
  const all = [...vocabulary.map(vocabLexeme), ...grammarLexemes.map((l) => ({ ...l, forms: l.forms.map(norm) }))];
  const byId = new Map(all.map((l) => [l.id, l]));
  const forms = new Map<string, Lexeme[]>();
  const phrases = new Map<string, Lexeme[]>();
  let maxPhraseWords = 1;
  for (const l of all) {
    for (const f of l.forms) {
      const target = f.includes(' ') ? phrases : forms;
      if (f.includes(' ')) maxPhraseWords = Math.max(maxPhraseWords, f.split(' ').length);
      const list = target.get(f) ?? [];
      if (!list.includes(l)) target.set(f, [...list, l]);
    }
  }
  return { byId, forms, phrases, maxPhraseWords, names: new Set(NAMES) };
}

const UNITS = ['ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
const TENS = ['zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
const NUMBER_RE = new RegExp(`^(${UNITS.join('|')})und(${TENS.join('|')})$`);

/** Lexemes for a single word that has no direct entry: numbers, endings, compounds. */
function fallback(index: LexiconIndex, word: string): { lexemes: Lexeme[]; parts?: Lexeme[] } {
  const w = norm(word);
  const n = NUMBER_RE.exec(w);
  if (n) {
    const unit = index.byId.get(n[1] === 'ein' ? 'g-num-ein' : `g-num-${n[1]}`);
    const und = index.byId.get('und');
    const tens = index.byId.get(`g-num-${n[2]}`);
    return { lexemes: [], parts: [unit, und, tens].filter((x): x is Lexeme => !!x) };
  }
  // Inflected adjective / noun ending the generator missed (e.g. "kleinen", "Kindern").
  for (const end of ['en', 'em', 'er', 'es', 'e', 'n', 's']) {
    if (w.length > end.length + 2 && w.endsWith(end)) {
      const hit = index.forms.get(w.slice(0, -end.length));
      if (hit) return { lexemes: hit };
    }
  }
  // Hyphenated compound: "U-Bahn-Station", "3-Zimmer-Wohnung" → every part must be known.
  if (word.includes('-')) {
    const parts = word.split('-').map((p) => index.forms.get(norm(p))?.[0]);
    if (parts.every(Boolean)) return { lexemes: [], parts: parts as Lexeme[] };
  }
  // Compound noun: "Apfelsaft" = Apfel + Saft, "Deutschkurs" = Deutsch + Kurs.
  if (/^\p{Lu}/u.test(word) && w.length >= 7) {
    for (let i = w.length - 3; i >= 3; i--) {
      const right = index.forms.get(w.slice(i));
      if (!right?.some((l) => l.type === 'noun')) continue;
      const leftRaw = w.slice(0, i);
      const left = index.forms.get(leftRaw) ?? index.forms.get(leftRaw.replace(/(s|n|en|e)$/, '')) ?? index.forms.get(leftRaw.replace(/(s|n|en|e)$/, '') + 'en');
      if (left) return { lexemes: [], parts: [left[0], right.find((l) => l.type === 'noun')!] };
    }
  }
  return { lexemes: [] };
}

const WORD_RE = /\p{L}+(?:[’'-]\p{L}+)*/gu;

/** Splits German text into words (with their lexemes) and the text in between. */
export function analyze(index: LexiconIndex, text: string): Segment[] {
  const raw: { text: string; word: boolean }[] = [];
  let last = 0;
  for (const m of text.matchAll(WORD_RE)) {
    if (m.index! > last) raw.push({ text: text.slice(last, m.index), word: false });
    raw.push({ text: m[0], word: true });
    last = m.index! + m[0].length;
  }
  if (last < text.length) raw.push({ text: text.slice(last), word: false });

  const out: Segment[] = [];
  for (let i = 0; i < raw.length; i++) {
    const r = raw[i];
    if (!r.word) {
      out.push({ kind: 'text', text: r.text });
      continue;
    }
    // Longest fixed phrase first, only across plain spaces.
    let matched = false;
    for (let k = index.maxPhraseWords; k >= 2 && !matched; k--) {
      const words: string[] = [];
      let j = i;
      while (j < raw.length && words.length < k) {
        if (raw[j].word) words.push(raw[j].text);
        else if (raw[j].text !== ' ') break;
        j++;
      }
      if (words.length !== k) continue;
      const hit = index.phrases.get(norm(words.join(' ')));
      if (hit) {
        out.push({ kind: 'word', text: raw.slice(i, j).map((x) => x.text).join(''), lexemes: hit });
        i = j - 1;
        matched = true;
      }
    }
    if (matched) continue;
    const direct = index.forms.get(norm(r.text));
    if (direct) {
      out.push({ kind: 'word', text: r.text, lexemes: direct });
      continue;
    }
    // Names, and single capital letters (spelling "N – G – U", size "M", "Vitamin C").
    if (index.names.has(r.text) || /^\p{Lu}$/u.test(r.text)) {
      out.push({ kind: 'word', text: r.text, lexemes: [], name: true });
      continue;
    }
    out.push({ kind: 'word', text: r.text, ...fallback(index, r.text) });
  }
  return out;
}

export type WordStatus = 'known' | 'lesson' | 'gloss' | 'unknown' | 'unmapped' | 'name';

/** How a word stands for this learner: known, new in the current lesson, glossed inline, or not taught yet. */
export function wordStatus(seg: Extract<Segment, { kind: 'word' }>, known: Set<string>, lessonNew?: Set<string>, gloss?: Record<string, string>): WordStatus {
  if (seg.name) return 'name';
  if (gloss && (gloss[seg.text] || gloss[seg.text.toLowerCase()])) return 'gloss';
  const ids = seg.parts ? seg.parts.map((p) => p.id) : seg.lexemes.map((l) => l.id);
  if (!ids.length) return 'unmapped';
  const isKnown = seg.parts ? ids.every((id) => known.has(id)) : ids.some((id) => known.has(id));
  if (isKnown) return 'known';
  const inLesson = seg.parts ? ids.every((id) => known.has(id) || lessonNew?.has(id)) : ids.some((id) => lessonNew?.has(id));
  return inLesson ? 'lesson' : 'unknown';
}

/**
 * Lexemes a text needs (for deriving what a lesson teaches). Each group is a set of alternatives
 * (knowing one is enough); compound parts become separate groups. Unmapped words and names are skipped.
 */
export function lexemesIn(index: LexiconIndex, text: string): string[][] {
  return analyze(index, text)
    .filter((s): s is Extract<Segment, { kind: 'word' }> => s.kind === 'word' && !s.name)
    .flatMap((s) => (s.parts ? s.parts.map((p) => [p.id]) : [s.lexemes.map((l) => l.id)]))
    .filter((ids) => ids.length > 0);
}
