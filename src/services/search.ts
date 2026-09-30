import type { ContentBundle } from './content/contentRepository';
import type { Conversation, GrammarLesson, Lesson, Phrase, Vocabulary } from '@/types/models';

/** Lower-case, strip Vietnamese & German diacritics so "qua tao" finds "quả táo" and "Apfel" finds "Äpfel". */
export const fold = (s: string) =>
  s
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();

export interface SearchResults {
  words: Vocabulary[];
  phrases: (Phrase & { lessonId: string; lessonTitle: string })[];
  grammar: GrammarLesson[];
  conversations: Conversation[];
  lessons: Lesson[];
}

export function search(content: ContentBundle, rawQuery: string): SearchResults {
  const q = fold(rawQuery);
  const empty: SearchResults = { words: [], phrases: [], grammar: [], conversations: [], lessons: [] };
  if (q.length < 1) return empty;
  const has = (...fields: (string | undefined)[]) => fields.some((f) => f && fold(f).includes(q));

  const scored = content.vocabulary
    .map((w) => {
      const word = fold(w.word);
      const meaning = fold(w.meaning);
      let score = 0;
      if (word === q || fold(`${w.article ?? ''} ${w.word}`) === q || meaning === q) score = 100;
      else if (word.startsWith(q)) score = 60;
      else if (meaning.split(/[\s/;,]+/).some((m) => m.startsWith(q)) || meaning.includes(q)) score = 50;
      else if (has(w.plural, w.example, w.exampleVi)) score = 10;
      return { w, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const phrases = content.lessons.flatMap((l) =>
    l.steps.flatMap((s) => (s.type === 'phrases' ? s.items.filter((p) => has(p.de, p.vi)).map((p) => ({ ...p, lessonId: l.id, lessonTitle: l.title })) : [])),
  );

  return {
    words: scored.map((x) => x.w),
    phrases: phrases.slice(0, 8),
    grammar: content.grammar.filter((g) => has(g.title, g.titleDe, g.summary)),
    conversations: content.conversations.filter((c) => has(c.title, c.titleDe) || c.lines.some((l) => has(l.de, l.vi))),
    lessons: content.lessons.filter((l) => has(l.title, l.titleDe, l.description)),
  };
}
