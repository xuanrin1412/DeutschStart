import type { Vocabulary } from '@/types/models';

/** "der Apfel" with the article colour-coded (der = blue, die = red, das = green). */
export function GermanWord({ word, className = '' }: { word: Pick<Vocabulary, 'word' | 'article'>; className?: string }) {
  return (
    <span className={`de-word ${className}`} lang="de">
      {word.article && <span className={`article article-${word.article}`}>{word.article} </span>}
      {word.word}
    </span>
  );
}

/** German flag drawn in CSS – Windows has no flag emoji (🇩🇪 renders as "DE"). */
export function FlagDE() {
  return (
    <span className="flag-de" role="img" aria-label="cờ Đức">
      <i />
      <i />
      <i />
    </span>
  );
}

export function Ipa({ children }: { children: string }) {
  return (
    <span className="ipa" aria-label={`Phiên âm IPA ${children}`}>
      {children}
    </span>
  );
}
