import { useMemo, useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { QuizRunner } from '@/components/exercises/QuizRunner';
import { fillBlankQuestion, listeningSentenceQuestion, listeningWordQuestion, sample, shuffle } from '@/services/quiz';
import { accuracy } from '@/services/selectors';
import { audioService } from '@/services/audio/audioService';

const LEVELS = [
  { id: 1, title: 'Cấp 1 · Từ đơn', text: 'Nghe một từ, chọn nghĩa đúng.', icon: '🔈' },
  { id: 2, title: 'Cấp 2 · Câu ngắn', text: 'Nghe một câu, chọn câu bạn nghe được.', icon: '🔉' },
  { id: 3, title: 'Cấp 3 · Điền từ', text: 'Nghe và điền từ còn thiếu.', icon: '🔊' },
] as const;

export default function ListeningPage() {
  const { vocabulary, listeningSentences, fillBlanks } = useContent();
  const { progress } = useProgress();
  const [level, setLevel] = useState<1 | 2 | 3 | null>(null);
  const [seed, setSeed] = useState(0);
  const acc = accuracy(progress.listening);

  const questions = useMemo(() => {
    if (level === 1) return sample(vocabulary, 8).map((w) => listeningWordQuestion(w, vocabulary));
    if (level === 2) return shuffle(listeningSentences).slice(0, 6).map(listeningSentenceQuestion);
    if (level === 3) return shuffle(fillBlanks).slice(0, 8).map(fillBlankQuestion);
    return [];
  }, [level, seed, vocabulary, listeningSentences, fillBlanks]);

  return (
    <div className="stack-lg narrow">
      <PageHeader
        icon="🎧"
        title="Luyện nghe"
        subtitle="Nghe nhiều lần, nghe chậm – không cần vội. Bạn có thể phát lại bao nhiêu lần tùy thích."
        why="Người Đức nói nhanh và nối âm. Luyện nghe từ sớm giúp bạn không bị 'sốc' khi giao tiếp thật."
      />

      <div className="card row gap-md center-y wrap">
        <div className="grow">
          <p className="muted small">Độ chính xác luyện nghe</p>
          <p className="stat-big">{acc === null ? '—' : `${acc}%`}</p>
        </div>
        <p className="muted small">
          {progress.listening.correct}/{progress.listening.total} câu đúng
        </p>
        {!audioService.hasGermanVoice() && <p className="small text-warn">⚠️ Không tìm thấy giọng đọc tiếng Đức trên thiết bị – âm thanh có thể dùng giọng mặc định.</p>}
      </div>

      <div className="grid grid-3" role="group" aria-label="Chọn cấp độ">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            className={`card card-hover level-btn${level === l.id ? ' active' : ''}`}
            aria-pressed={level === l.id}
            onClick={() => {
              setLevel(l.id);
              setSeed((s) => s + 1);
            }}
          >
            <span className="quick-icon" aria-hidden="true">
              {l.icon}
            </span>
            <strong>{l.title}</strong>
            <span className="muted small">{l.text}</span>
          </button>
        ))}
      </div>

      {level && (
        <section className="card" aria-label="Bài luyện nghe">
          <QuizRunner key={`${level}-${seed}`} questions={questions} onRestart={() => setSeed((s) => s + 1)} />
        </section>
      )}
    </div>
  );
}
