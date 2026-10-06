import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Question, ReadingText } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { AudioButton } from '@/components/ui/AudioButton';
import { PhraseList } from '@/components/common/PhraseList';
import { GermanText } from '@/components/text/GermanText';
import { QuizRunner } from '@/components/exercises/QuizRunner';
import { audioService } from '@/services/audio/audioService';

export default function ReadingTextPage() {
  const { readingId = '' } = useParams();
  const { readings } = useContent();
  const reading = readings.find((r) => r.id === readingId);
  if (!reading) return <EmptyState icon="🔍" title="Không tìm thấy bài đọc" action={{ label: 'Về danh sách bài đọc', to: '/reading' }} />;
  return <ReadingView key={reading.id} reading={reading} />;
}

/** Reading questions become ordinary quiz questions, so they count in stats and the mistake book. */
function toQuestion(r: ReadingText, q: ReadingText['questions'][number]): Question {
  const trueFalse = q.options.length === 2 && q.options.includes('Richtig');
  return {
    id: `rd-${q.id}`,
    type: 'multiple-choice',
    prompt: `Bài đọc "${r.title}": ${trueFalse ? 'Richtig (đúng) hay Falsch (sai)?' : 'chọn đáp án đúng'}`,
    display: q.statement,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
    category: 'quiz',
  };
}

function ReadingView({ reading }: { reading: ReadingText }) {
  const { readings } = useContent();
  const { progress, completeReading } = useProgress();
  const [showVi, setShowVi] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => reading.questions.map((q) => toQuestion(reading, q)), [reading]);
  const best = progress.readings?.[reading.id]?.bestScore;
  const next = readings[readings.findIndex((r) => r.id === reading.id) + 1];

  useEffect(() => () => audioService.stopSequence(), []);

  const playAll = async () => {
    if (playing !== null) {
      audioService.stopSequence();
      setPlaying(null);
      return;
    }
    await audioService.playSequence(reading.text, {}, setPlaying);
    setPlaying(null);
  };

  return (
    <div className="stack-lg narrow">
      <PageHeader icon={reading.icon} title={reading.title} subtitle={`${reading.titleDe} · ${reading.context}`} back={{ to: '/reading', label: 'Đọc hiểu' }} />

      <div className="toolbar card">
        <button className="btn btn-primary" onClick={playAll}>
          {playing !== null ? '⏹ Dừng' : '▶ Nghe cả bài'}
        </button>
        <label className="switch">
          <input type="checkbox" checked={showVi} onChange={(e) => setShowVi(e.target.checked)} /> Hiện bản dịch
        </label>
      </div>

      <section className="card reading-text" aria-labelledby="reading-title">
        <p className="eyebrow" id="reading-title" lang="de">
          {reading.kind}
        </p>
        {reading.text.map((para, i) => (
          <div key={i} className={`reading-para${playing === i ? ' is-playing' : ''}`}>
            <div className="grow">
              <GermanText as="p" text={para} />
              {showVi && <p className="reading-vi">{reading.textVi[i]}</p>}
            </div>
            <AudioButton text={para} size="sm" />
          </div>
        ))}
      </section>

      {reading.glossary && (
        <section className="card">
          <h2 className="h3">📌 Từ cần biết</h2>
          <PhraseList items={reading.glossary} />
        </section>
      )}

      <section className="card" aria-labelledby="reading-quiz">
        <div className="card-head">
          <h2 id="reading-quiz" className="h3">
            ✅ Câu hỏi
          </h2>
          {best !== undefined && <span className="badge badge-good">Điểm cao nhất: {best}%</span>}
        </div>
        <QuizRunner
          key={seed}
          questions={questions}
          onRestart={() => setSeed((s) => s + 1)}
          onFinish={(c, t) => completeReading(reading.id, Math.round((c / t) * 100))}
          finishExtra={
            next ? (
              <Link to={`/reading/${next.id}`} className="btn btn-ghost">
                Bài tiếp: {next.title} →
              </Link>
            ) : (
              <Link to="/reading" className="btn btn-ghost">
                Danh sách bài đọc
              </Link>
            )
          }
        />
      </section>
    </div>
  );
}
