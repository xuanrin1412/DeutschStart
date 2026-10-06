import type { AlphabetLetter } from '@/types/models';
import { AudioButton } from '@/components/ui/AudioButton';
import { WordImage } from '@/components/ui/WordImage';
import { Ipa } from '@/components/ui/GermanWord';

/**
 * One letter: name, IPA, a picture word and an example sentence.
 * `inLesson`: the picture word is only there to hear the sound, and the example sentence is hidden
 * because it uses words a beginner has not been taught yet.
 */
export function LetterCard({ letter, inLesson = false }: { letter: AlphabetLetter; inLesson?: boolean }) {
  return (
    <div className="letter-card">
      <div className="letter-card-top">
        <span className="letter-big" lang="de">
          {letter.letter}
          {letter.letter !== 'ß' && <small>{letter.letter.toLowerCase()}</small>}
        </span>
        <div>
          <p className="muted small">Tên chữ cái</p>
          <p className="row gap-sm center-y">
            <strong lang="de">„{letter.name}“</strong> <Ipa>{letter.nameIpa}</Ipa>
          </p>
          <AudioButton text={letter.speak} label="Nghe tên chữ" variant="pill" size="sm" />
        </div>
      </div>

      <div className="letter-word">
        <WordImage image={letter.image} size="xl" />
        <div>
          <p className="h2" lang="de">
            {letter.word}
          </p>
          <p>
            <Ipa>{letter.wordIpa}</Ipa>
          </p>
          <p className="vocab-meaning">{letter.meaning}</p>
          <div className="row gap-sm">
            <AudioButton text={letter.word} />
            <AudioButton text={letter.word} slow />
          </div>
        </div>
      </div>

      {inLesson ? (
        <p className="muted small">Từ ví dụ chỉ để nghe âm của chữ – bạn chưa cần nhớ từ này.</p>
      ) : (
        <div className="example">
          <div className="row gap-sm center-y">
            <p lang="de" className="example-de">
              {letter.example}
            </p>
            <AudioButton text={letter.example} size="sm" />
          </div>
          <p className="example-vi">{letter.exampleVi}</p>
        </div>
      )}

      {letter.tip && (
        <div className="tip">
          <strong>💡 Lưu ý phát âm:</strong> {letter.tip}
        </div>
      )}
    </div>
  );
}

export function LetterTile({ letter, seen, onOpen }: { letter: AlphabetLetter; seen: boolean; onOpen: () => void }) {
  return (
    <button className={`letter-tile${letter.special ? ' is-special' : ''}${seen ? ' is-seen' : ''}`} onClick={onOpen} aria-label={`Chữ ${letter.letter}, ví dụ ${letter.word}${seen ? ', đã xem' : ''}`}>
      <span className="letter-tile-char" lang="de">
        {letter.letter}
      </span>
      <span className="letter-tile-emoji" aria-hidden="true">
        {letter.image.emoji}
      </span>
      {letter.tip && <span className="letter-tile-flag" title="Có lưu ý phát âm" aria-hidden="true" />}
    </button>
  );
}
