import { useEffect, useState } from 'react';
import type { Vocabulary } from '@/types/models';
import type { Grade } from '@/services/srs';
import { fullWord } from '@/services/quiz';
import { audioService } from '@/services/audio/audioService';
import { useSpeakOnShow } from '@/hooks/useAutoSpeak';
import { AudioButton } from '@/components/ui/AudioButton';
import { WordImage } from '@/components/ui/WordImage';
import { GermanWord, Ipa } from '@/components/ui/GermanWord';

interface Props {
  word: Vocabulary;
  onGrade: (g: Grade) => void;
}

export function Flashcard({ word, onGrade }: Props) {
  const [flipped, setFlipped] = useState(false);
  useSpeakOnShow({ text: fullWord(word), url: word.audio?.url }, word.id);

  useEffect(() => {
    setFlipped(false);
  }, [word.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key === ' ' || e.key === 'Enter') {
        if ((e.target as HTMLElement).tagName === 'BUTTON') return;
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (flipped && ['1', '2', '3'].includes(e.key)) onGrade((['again', 'good', 'easy'] as Grade[])[Number(e.key) - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, onGrade]);

  const flip = () => {
    if (!flipped) void audioService.play(fullWord(word)).catch(() => {});
    setFlipped((f) => !f);
  };

  return (
    <div className="flash-wrap">
      {/* Mouse users click the card; keyboard users use Space or the "Lật thẻ" button. */}
      <div className={`flashcard${flipped ? ' is-flipped' : ''}`} onClick={flip} aria-live="polite">
        <div className="flash-face flash-front" aria-hidden={flipped}>
          <GermanWord word={word} className="flash-word" />
          <div onClick={(e) => e.stopPropagation()}>
            <AudioButton text={fullWord(word)} size="lg" />
          </div>
          <p className="muted small">Bấm hoặc nhấn Space để lật thẻ</p>
        </div>
        <div className="flash-face flash-back" aria-hidden={!flipped}>
          <WordImage image={word.image} size="lg" />
          <p className="flash-meaning">{word.meaning}</p>
          <p lang="de" className="flash-sub">
            <GermanWord word={word} /> <Ipa>{word.ipa}</Ipa>
          </p>
          {word.plural && (
            <p className="muted small" lang="de">
              Số nhiều: {word.plural}
            </p>
          )}
          <p className="flash-example" lang="de">
            „{word.example}“
          </p>
          <p className="muted small">{word.exampleVi}</p>
          <div className="row gap-sm" onClick={(e) => e.stopPropagation()}>
            <AudioButton text={fullWord(word)} size="sm" />
            <AudioButton text={word.example} size="sm" label="Câu ví dụ" variant="pill" />
          </div>
        </div>
      </div>

      <div className={`grade-row${flipped ? '' : ' is-hidden'}`} aria-hidden={!flipped}>
        <button className="btn grade grade-again" onClick={() => onGrade('again')} tabIndex={flipped ? 0 : -1}>
          <span>😣 Không nhớ</span>
          <small>ôn lại hôm nay</small>
        </button>
        <button className="btn grade grade-good" onClick={() => onGrade('good')} tabIndex={flipped ? 0 : -1}>
          <span>🙂 Nhớ</span>
          <small>ôn lại sau vài ngày</small>
        </button>
        <button className="btn grade grade-easy" onClick={() => onGrade('easy')} tabIndex={flipped ? 0 : -1}>
          <span>😎 Rất dễ</span>
          <small>giãn cách dài hơn</small>
        </button>
      </div>
      {!flipped && (
        <button className="btn btn-primary btn-block" onClick={flip}>
          Lật thẻ
        </button>
      )}
    </div>
  );
}
