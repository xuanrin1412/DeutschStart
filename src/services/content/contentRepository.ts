import type {
  AlphabetLetter,
  Conversation,
  FillBlankItem,
  GrammarLesson,
  Lesson,
  ListeningSentence,
  PronunciationSound,
  ReadingText,
  SentenceExercise,
  TranslationItem,
  Vocabulary,
  VocabularyTopic,
} from '@/types/models';

export interface ContentBundle {
  vocabulary: Vocabulary[];
  topics: VocabularyTopic[];
  alphabet: AlphabetLetter[];
  sounds: PronunciationSound[];
  lessons: Lesson[];
  grammar: GrammarLesson[];
  conversations: Conversation[];
  sentences: SentenceExercise[];
  listeningSentences: ListeningSentence[];
  fillBlanks: FillBlankItem[];
  translations: TranslationItem[];
  readings: ReadingText[];
}

/**
 * All learning content goes through this interface.
 * `LocalContentRepository` lazy-loads the bundled data files; a `SupabaseContentRepository`
 * could fetch the same shapes from the lessons / vocabulary / … tables.
 */
export interface ContentRepository {
  load(): Promise<ContentBundle>;
}

class LocalContentRepository implements ContentRepository {
  async load(): Promise<ContentBundle> {
    // Dynamic imports keep content out of the initial JS chunk.
    const [v, t, a, p, l, g, c, s, e, r] = await Promise.all([
      import('@/data/vocabulary'),
      import('@/data/topics'),
      import('@/data/alphabet'),
      import('@/data/pronunciation'),
      import('@/data/lessons'),
      import('@/data/grammar'),
      import('@/data/conversations'),
      import('@/data/sentences'),
      import('@/data/exercises'),
      import('@/data/reading'),
    ]);
    return {
      vocabulary: v.vocabulary,
      topics: t.topics,
      alphabet: a.alphabet,
      sounds: p.sounds,
      lessons: [...l.lessons].sort((x, y) => x.order - y.order),
      grammar: [...g.grammarLessons].sort((x, y) => x.order - y.order),
      conversations: c.conversations,
      sentences: s.sentences,
      listeningSentences: e.listeningSentences,
      fillBlanks: e.fillBlanks,
      translations: e.translations,
      readings: r.readings,
    };
  }
}

export const contentRepository: ContentRepository = new LocalContentRepository();
