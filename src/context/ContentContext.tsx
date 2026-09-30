import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { contentRepository, type ContentBundle } from '@/services/content/contentRepository';
import { FullPageError, FullPageLoader } from '@/components/ui/States';

interface ContentApi extends ContentBundle {
  wordById: Map<string, ContentBundle['vocabulary'][number]>;
  lessonById: Map<string, ContentBundle['lessons'][number]>;
  soundById: Map<string, ContentBundle['sounds'][number]>;
  sentenceById: Map<string, ContentBundle['sentences'][number]>;
  letterByChar: Map<string, ContentBundle['alphabet'][number]>;
  topicById: Map<string, ContentBundle['topics'][number]>;
}

const ContentContext = createContext<ContentApi | null>(null);

const index = <T,>(items: T[], key: (x: T) => string) => new Map(items.map((x) => [key(x), x]));

export function ContentProvider({ children }: { children: ReactNode }) {
  const [bundle, setBundle] = useState<ContentBundle | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(() => {
    setError(null);
    contentRepository
      .load()
      .then(setBundle)
      .catch((e: unknown) => setError(e instanceof Error ? e : new Error(String(e))));
  }, []);

  useEffect(load, [load]);

  const value = useMemo<ContentApi | null>(
    () =>
      bundle && {
        ...bundle,
        wordById: index(bundle.vocabulary, (w) => w.id),
        lessonById: index(bundle.lessons, (l) => l.id),
        soundById: index(bundle.sounds, (s) => s.id),
        sentenceById: index(bundle.sentences, (s) => s.id),
        letterByChar: index(bundle.alphabet, (l) => l.letter),
        topicById: index(bundle.topics, (t) => t.id),
      },
    [bundle],
  );

  if (error) return <FullPageError message="Không tải được nội dung bài học." onRetry={load} />;
  if (!value) return <FullPageLoader label="Đang tải bài học…" />;
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx;
}
