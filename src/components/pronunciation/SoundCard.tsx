import { useState } from 'react';
import type { PronunciationSound } from '@/types/models';
import { useProgress } from '@/context/ProgressContext';
import { AudioButton } from '@/components/ui/AudioButton';
import { Ipa } from '@/components/ui/GermanWord';
import { MouthDiagram } from './MouthDiagram';
import { SpeechPractice } from './SpeechPractice';

export function SoundCard({ sound, defaultOpen = false }: { sound: PronunciationSound; defaultOpen?: boolean }) {
  const { progress, recordPronunciation } = useProgress();
  const [open, setOpen] = useState(defaultOpen);
  const [counted, setCounted] = useState(false);
  const practiced = progress.pronunciation.sounds.includes(sound.id);
  // Listening to the examples counts as one practice per visit.
  const countPractice = () => {
    if (counted) return;
    setCounted(true);
    recordPronunciation(sound.id);
  };

  return (
    <article className="sound-card card">
      <div className="sound-head">
        <span className="sound-grapheme" lang="de">
          {sound.grapheme}
        </span>
        <div className="grow">
          <h3>{sound.title}</h3>
          <Ipa>{sound.ipa}</Ipa>
        </div>
        {practiced && <span className="badge badge-good">✓ Đã luyện</span>}
      </div>

      <p>{sound.explanation}</p>
      {sound.vietnameseHint && (
        <p className="hint">
          💬 <strong>Gần giống tiếng Việt:</strong> {sound.vietnameseHint}
        </p>
      )}

      <ul className="example-words">
        {sound.examples.map((ex) => (
          <li key={ex.de}>
            <AudioButton text={ex.de} size="sm" onPlay={countPractice} />
            <strong lang="de">{ex.de}</strong>
            <Ipa>{ex.ipa}</Ipa>
            <span className="muted">{ex.vi}</span>
          </li>
        ))}
      </ul>

      <button className="disclosure" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? '▾' : '▸'} Khẩu hình & luyện nói
      </button>
      {open && (
        <div className="stack-sm">
          <MouthDiagram lips={sound.mouth.lips} tongue={sound.mouth.tongue} />
          <p className="small">
            👄 <strong>Cách đặt miệng:</strong> {sound.mouthTip}
          </p>
          <SpeechPractice target={sound.examples[0].de} onResult={(ok) => recordPronunciation(sound.id, ok)} />
        </div>
      )}
    </article>
  );
}
