import type { Vocabulary } from '@/types/models';
import { AudioButton } from '@/components/ui/AudioButton';
import { Ipa } from '@/components/ui/GermanWord';
import { fullWord } from '@/services/quiz';

/** After answering: the word with its pronunciation, and its example sentence with audio. */
export function WordFeedback({ word }: { word: Vocabulary }) {
  const full = fullWord(word);
  return (
    <div className="fb-word">
      <div className="fb-line">
        <strong className="fb-de" lang="de">
          {word.article && <span className={`article-${word.article}`}>{word.article} </span>}
          {word.word}
        </strong>
        {word.ipa && <Ipa>{word.ipa}</Ipa>}
        <AudioButton text={full} size="sm" />
        <AudioButton text={full} size="sm" slow />
      </div>
      <p className="small">
        = {word.meaning}
        {word.plural && (
          <span className="muted">
            {' '}
            · số nhiều: <span lang="de">{word.plural}</span>
          </span>
        )}
      </p>
      {word.example && (
        <div className="fb-example">
          <span className="fb-label">Ví dụ</span>
          <div className="fb-line">
            <span lang="de">{word.example}</span>
            <AudioButton text={word.example} size="sm" />
            <AudioButton text={word.example} size="sm" slow />
          </div>
          {word.exampleVi && <p className="muted small">{word.exampleVi}</p>}
        </div>
      )}
    </div>
  );
}
