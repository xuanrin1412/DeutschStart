/**
 * Content check: run with `npm run check:content`.
 *
 * 1. Dependency rule – every German word in an A0 lesson (and any lesson that lists `teaches`)
 *    must be taught before or in that lesson, be a name, or carry an inline gloss.
 * 2. Practice rounds – every generated question has a skill, its answer among the options,
 *    no duplicate options or ids.
 * 3. Dictionary coverage – share of German words on the site the lexicon can explain.
 *
 * Exits with code 1 when rule 1 or 2 is broken.
 */
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const src = (p: string) => import(pathToFileURL(resolve('src', p)).href);
const { vocabulary } = await src('data/vocabulary.ts');
const { lessons } = await src('data/lessons.ts');
const { sentences } = await src('data/sentences.ts');
const { alphabet } = await src('data/alphabet.ts');
const { sounds } = await src('data/pronunciation.ts');
const { conversations } = await src('data/conversations.ts');
const { readings } = await src('data/reading.ts');
const { buildLexicon, analyze } = await src('services/lexicon.ts');
const { buildCurriculum, validateCurriculum } = await src('services/curriculum.ts');
const { buildPractice } = await src('services/lessonPractice.ts');
const { createEmptyProgress } = await src('services/progressRepository.ts');

const lexicon = buildLexicon(vocabulary);
const sentenceById = new Map(sentences.map((s: { id: string }) => [s.id, s]));
const cur = buildCurriculum(lessons, lexicon, sentenceById);
let failed = false;

// 1. Dependency rule
const deps = validateCurriculum(lessons, lexicon, cur, sentenceById);
console.log(`1) Dependency rule: ${deps.length ? `${deps.length} problem(s)` : 'OK'}`);
for (const p of deps.slice(0, 40)) console.log(`   ${p.lessonId} · ${p.where} · "${p.word}" (${p.status}) in: ${p.text}`);
if (deps.length) failed = true;

// 2. Practice rounds
const problems: string[] = [];
const available = [...lessons].sort((a, b) => a.order - b.order).filter((l) => l.available !== false);
let total = 0;
for (const l of available) {
  const qs = buildPractice(l, {
    lexicon,
    wordById: new Map(vocabulary.map((w: { id: string }) => [w.id, w])),
    letterByChar: new Map(alphabet.map((a: { letter: string }) => [a.letter, a])),
    soundById: new Map(sounds.map((s: { id: string }) => [s.id, s])),
    sentenceById,
    vocabulary,
    teaches: cur.teaches.get(l.id) ?? [],
    knownBefore: cur.knownBefore.get(l.id) ?? new Set(),
    earlierSentences: available.filter((x) => x.order < l.order).flatMap((x) => x.sentences ?? []),
    progress: createEmptyProgress('check'),
  });
  total += qs.length;
  if (!qs.length) problems.push(`${l.id}: no practice questions`);
  const ids = new Set<string>();
  for (const q of qs) {
    if (ids.has(q.id)) problems.push(`${l.id}: duplicate question id ${q.id}`);
    ids.add(q.id);
    if (!q.skill) problems.push(`${l.id} ${q.id}: no skill`);
    if (q.options && !q.options.includes(q.answer)) problems.push(`${l.id} ${q.id}: answer not in options`);
    if (q.options && new Set(q.options).size !== q.options.length) problems.push(`${l.id} ${q.id}: duplicate options`);
  }
}
console.log(`2) Practice rounds: ${available.length} lessons, ${total} questions – ${problems.length ? `${problems.length} problem(s)` : 'OK'}`);
problems.slice(0, 40).forEach((p) => console.log(`   ${p}`));
if (problems.length) failed = true;

// 3. Dictionary coverage (informational)
const texts: string[] = [
  ...vocabulary.map((w: { example: string }) => w.example),
  ...conversations.flatMap((c: { lines: { de: string }[] }) => c.lines.map((l) => l.de)),
  ...readings.flatMap((r: { text: string[] }) => r.text),
];
let words = 0;
const missing = new Map<string, number>();
for (const t of texts)
  for (const s of analyze(lexicon, t)) {
    if (s.kind !== 'word' || s.name) continue;
    words++;
    if (!s.lexemes.length && !s.parts?.length) missing.set(s.text, (missing.get(s.text) ?? 0) + 1);
  }
const unmapped = [...missing.values()].reduce((a, b) => a + b, 0);
console.log(`3) Dictionary coverage: ${Math.round((1 - unmapped / words) * 1000) / 10}% of ${words} words` + (missing.size ? ` – not explained yet: ${[...missing.keys()].slice(0, 20).join(', ')}` : ''));

process.exit(failed ? 1 : 0);
