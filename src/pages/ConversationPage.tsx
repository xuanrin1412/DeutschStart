import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Conversation } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { AudioButton } from '@/components/ui/AudioButton';
import { SpeechPractice } from '@/components/pronunciation/SpeechPractice';
import { PhraseList } from '@/components/common/PhraseList';
import { GermanText } from '@/components/text/GermanText';
import { audioService } from '@/services/audio/audioService';

export default function ConversationPage() {
  const { convoId = '' } = useParams();
  const { conversations } = useContent();
  const convo = conversations.find((c) => c.id === convoId);
  if (!convo) return <EmptyState icon="🔍" title="Không tìm thấy hội thoại" action={{ label: 'Về danh sách hội thoại', to: '/conversations' }} />;
  return <ConversationView key={convo.id} convo={convo} />;
}

function ConversationView({ convo }: { convo: Conversation }) {
  const [showVi, setShowVi] = useState(true);
  const [slow, setSlow] = useState(false);
  const [playingLine, setPlayingLine] = useState<number | null>(null);
  const [practice, setPractice] = useState(false);

  useEffect(() => () => audioService.stopSequence(), []);

  const playAll = async () => {
    if (playingLine !== null) {
      audioService.stopSequence();
      setPlayingLine(null);
      return;
    }
    await audioService.playSequence(
      convo.lines.map((l) => l.de),
      { slow },
      setPlayingLine,
    );
    setPlayingLine(null);
  };

  return (
    <div className="stack-lg narrow">
      <PageHeader icon={convo.icon} title={convo.title} subtitle={`${convo.titleDe} · ${convo.context}`} back={{ to: '/conversations', label: 'Hội thoại' }} />

      <div className="toolbar card">
        <button className="btn btn-primary" onClick={playAll} disabled={practice}>
          {playingLine !== null ? '⏹ Dừng' : '▶ Nghe cả đoạn'}
        </button>
        <label className="switch">
          <input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} /> 🐢 Đọc chậm
        </label>
        <label className="switch">
          <input type="checkbox" checked={showVi} onChange={(e) => setShowVi(e.target.checked)} /> Hiện bản dịch
        </label>
        <button className={`btn ${practice ? 'btn-primary' : 'btn-ghost'}`} aria-pressed={practice} onClick={() => setPractice((p) => !p)}>
          🎭 {practice ? 'Thoát luyện tập' : 'Luyện theo vai'}
        </button>
      </div>

      {practice ? (
        <PracticeMode convo={convo} slow={slow} />
      ) : (
        <ol className="dialogue">
          {convo.lines.map((l, i) => (
            <li key={i} className={`bubble bubble-${l.speaker}${playingLine === i ? ' is-playing' : ''}`}>
              <span className="bubble-who">{convo.roles[l.speaker]}</span>
              <GermanText as="p" className="bubble-de" text={l.de} />
              {showVi && <p className="bubble-vi">{l.vi}</p>}
              <div className="row gap-xs">
                <AudioButton text={l.de} size="sm" />
                <AudioButton text={l.de} size="sm" slow />
              </div>
            </li>
          ))}
        </ol>
      )}

      {convo.keyPhrases && (
        <section className="card">
          <h2 className="h3">🔑 Mẫu câu quan trọng</h2>
          <PhraseList items={convo.keyPhrases} />
        </section>
      )}
    </div>
  );
}

/** Role play: partner lines are played, the learner says their own lines. */
function PracticeMode({ convo, slow }: { convo: Conversation; slow: boolean }) {
  const { recordPronunciation } = useProgress();
  const [role, setRole] = useState<'A' | 'B'>('A');
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const line = convo.lines[i];
  const mine = line?.speaker === role;

  useEffect(() => {
    if (line && !mine) void audioService.play(line.de, { slow }).catch(() => {});
  }, [i, role]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => {
    setRevealed(false);
    setI((x) => x + 1);
  };

  return (
    <section className="card stack-md" aria-label="Luyện theo vai">
      <div className="row gap-sm wrap center-y">
        <span className="small">Bạn đóng vai:</span>
        {(['A', 'B'] as const).map((r) => (
          <button
            key={r}
            className={`chip-btn${role === r ? ' active' : ''}`}
            aria-pressed={role === r}
            onClick={() => {
              setRole(r);
              setI(0);
              setRevealed(false);
            }}
          >
            {convo.roles[r]}
          </button>
        ))}
      </div>

      <ol className="dialogue">
        {convo.lines.slice(0, i).map((l, k) => (
          <li key={k} className={`bubble bubble-${l.speaker} is-past`}>
            <span className="bubble-who">{convo.roles[l.speaker]}</span>
            <p lang="de" className="bubble-de">
              {l.de}
            </p>
          </li>
        ))}
      </ol>

      {line ? (
        mine ? (
          <div className="practice-turn">
            <p className="eyebrow">Đến lượt bạn!</p>
            <p>
              Hãy nói bằng tiếng Đức: <strong>„{line.vi}“</strong>
            </p>
            {revealed ? (
              <div className="row gap-sm center-y wrap">
                <strong lang="de" className="de-sentence">
                  {line.de}
                </strong>
                <AudioButton text={line.de} size="sm" />
              </div>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={() => setRevealed(true)}>
                👀 Hiện câu tiếng Đức
              </button>
            )}
            <SpeechPractice target={line.de} onResult={(ok) => recordPronunciation(`convo-${convo.id}`, ok)} />
            <button className="btn btn-primary" onClick={next}>
              Tiếp →
            </button>
          </div>
        ) : (
          <div className={`bubble bubble-${line.speaker}`}>
            <span className="bubble-who">{convo.roles[line.speaker]}</span>
            <p lang="de" className="bubble-de">
              {line.de}
            </p>
            <p className="bubble-vi">{line.vi}</p>
            <div className="row gap-xs">
              <AudioButton text={line.de} size="sm" />
              <button className="btn btn-primary btn-sm" onClick={next}>
                Tiếp →
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="center-text stack-sm">
          <p className="h3">🎉 Hoàn thành hội thoại!</p>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setI(0);
              setRole(role === 'A' ? 'B' : 'A');
            }}
          >
            Đổi vai và luyện lại
          </button>
        </div>
      )}
    </section>
  );
}
