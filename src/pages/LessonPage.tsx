import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { AlphabetLetter, Lesson, LessonStep, Phrase } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { phraseQuestions, sentenceText } from '@/services/quiz';
import { EmptyState } from '@/components/ui/States';
import { Modal } from '@/components/ui/Modal';
import { PhraseList } from '@/components/common/PhraseList';
import { LetterCard, LetterTile } from '@/components/alphabet/LetterCard';
import { SoundCard } from '@/components/pronunciation/SoundCard';
import { SentenceSet } from '@/components/exercises/SentenceSet';
import { QuizRunner } from '@/components/exercises/QuizRunner';

export default function LessonPage() {
  const { lessonId = '' } = useParams();
  const { lessonById } = useContent();
  const lesson = lessonById.get(lessonId);
  if (!lesson) return <EmptyState icon="🔍" title="Không tìm thấy bài học" action={{ label: 'Về danh sách bài', to: '/learn' }} />;
  return <LessonPlayer key={lesson.id} lesson={lesson} />;
}

function LessonPlayer({ lesson }: { lesson: Lesson }) {
  useDocumentTitle(lesson.title);
  const content = useContent();
  const { progress, updateLesson } = useProgress();
  const saved = progress.lessons[lesson.id];
  const total = lesson.steps.length;
  const [step, setStep] = useState(() => (saved && !saved.completed ? Math.min(saved.step, total - 1) : 0));
  const [finished, setFinished] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [builderDone, setBuilderDone] = useState(false);

  // Items the lesson teaches → used for the auto-generated quiz.
  const items = useMemo<Phrase[]>(
    () =>
      lesson.steps.flatMap((s): Phrase[] => {
        if (s.type === 'phrases') return s.items;
        if (s.type === 'letters') return s.letters.map((l) => content.letterByChar.get(l)).filter(Boolean).map((l) => ({ de: l!.word, vi: l!.meaning }));
        if (s.type === 'sounds') return s.soundIds.flatMap((id) => content.soundById.get(id)?.examples ?? []).map((e) => ({ de: e.de, vi: e.vi }));
        if (s.type === 'builder')
          return s.sentenceIds.map((id) => content.sentenceById.get(id)).filter(Boolean).map((x) => ({ de: sentenceText(x!), vi: x!.vi }));
        return [];
      }),
    [lesson, content],
  );

  const current = lesson.steps[step];
  const isLast = step === total - 1;
  const blocked = (current.type === 'quiz' && !quizDone) || (current.type === 'builder' && !builderDone);

  const go = (to: number) => {
    setStep(to);
    setQuizDone(false);
    setBuilderDone(false);
    updateLesson(lesson.id, to, total);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finish = () => {
    updateLesson(lesson.id, total, total, true);
    setFinished(true);
  };

  if (finished) {
    const next = content.lessons.find((l) => l.order === lesson.order + 1);
    return (
      <div className="card lesson-complete">
        <div className="big-emoji" aria-hidden="true">
          🎉
        </div>
        <h1 className="h2">Hoàn thành: {lesson.title}!</h1>
        <p className="muted">Giỏi lắm! Những gì bạn vừa học sẽ xuất hiện trong phần ôn tập.</p>
        <div className="row gap-sm wrap center">
          {next ? (
            <Link to={`/learn/${next.id}`} className="btn btn-primary">
              Bài tiếp theo: {next.title} →
            </Link>
          ) : (
            <Link to="/grammar" className="btn btn-primary">
              Tiếp tục với Ngữ pháp →
            </Link>
          )}
          <Link to="/learn" className="btn btn-ghost">
            Danh sách bài học
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson stack-md narrow">
      <div className="lesson-top">
        <Link to="/learn" className="back-link">
          ← Học từ đầu
        </Link>
        <p className="eyebrow">
          Bài {lesson.order} · {lesson.titleDe} · ⏱ {lesson.minutes} phút
        </p>
        <h1 className="h2">
          {lesson.icon} {lesson.title}
        </h1>
        <p className="small muted">
          Bước {step + 1}/{total}
        </p>
        <ol className="stepper" aria-label={`Tiến độ bài học: bước ${step + 1} trên ${total}`}>
          {lesson.steps.map((s, i) => (
            <li key={i} className={i < step ? 'done' : i === step ? 'current' : ''} aria-current={i === step ? 'step' : undefined}>
              <span className="sr-only">
                Bước {i + 1}: {s.title}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <section className="card lesson-step" aria-labelledby="step-title">
        <h2 id="step-title" className="h3">
          {current.title}
        </h2>
        <StepBody key={step} step={current} items={items} onQuizDone={() => setQuizDone(true)} onBuilderDone={() => setBuilderDone(true)} />
      </section>

      <div className="lesson-nav">
        <button className="btn btn-ghost" onClick={() => go(step - 1)} disabled={step === 0}>
          ← Quay lại
        </button>
        {isLast ? (
          <button className="btn btn-primary" onClick={finish} disabled={blocked}>
            Hoàn thành bài học ✓
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => go(step + 1)} disabled={blocked}>
            Tiếp theo →
          </button>
        )}
      </div>
      {blocked && <p className="muted small center-text">Hoàn thành bài tập để tiếp tục.</p>}
    </div>
  );
}

function StepBody({ step, items, onQuizDone, onBuilderDone }: { step: LessonStep; items: Phrase[]; onQuizDone: () => void; onBuilderDone: () => void }) {
  const content = useContent();
  const { progress, markLetterSeen } = useProgress();
  const [openLetter, setOpenLetter] = useState<AlphabetLetter | null>(null);
  const [quizSeed, setQuizSeed] = useState(0);
  const questions = useMemo(() => (step.type === 'quiz' ? phraseQuestions(items, step.count ?? 5) : []), [step, items, quizSeed]);

  // A quiz step with nothing to ask must never block the lesson.
  useEffect(() => {
    if (step.type === 'quiz' && questions.length === 0) onQuizDone();
  }, [step, questions, onQuizDone]);

  switch (step.type) {
    case 'intro':
      return (
        <div className="stack-sm">
          <p className="lesson-text">{step.body}</p>
          {step.why && (
            <p className="why">
              💡 <strong>Tại sao quan trọng?</strong> {step.why}
            </p>
          )}
        </div>
      );
    case 'tip':
      return <div className="tip">💡 {step.body}</div>;
    case 'phrases':
      return <PhraseList items={step.items} />;
    case 'letters':
      return (
        <>
          <p className="muted small">Bấm vào từng chữ để nghe và xem ví dụ.</p>
          <div className="letter-grid">
            {step.letters.map((ch) => {
              const l = content.letterByChar.get(ch);
              return (
                l && (
                  <LetterTile
                    key={ch}
                    letter={l}
                    seen={progress.alphabetSeen.includes(ch)}
                    onOpen={() => {
                      setOpenLetter(l);
                      markLetterSeen(ch);
                    }}
                  />
                )
              );
            })}
          </div>
          <Modal open={!!openLetter} onClose={() => setOpenLetter(null)} title={`Chữ ${openLetter?.letter}`}>
            {openLetter && <LetterCard letter={openLetter} />}
          </Modal>
        </>
      );
    case 'sounds':
      return (
        <div className="stack-md">
          {step.soundIds.map((id) => {
            const s = content.soundById.get(id);
            return s && <SoundCard key={id} sound={s} />;
          })}
        </div>
      );
    case 'builder': {
      const list = step.sentenceIds.map((id) => content.sentenceById.get(id)).filter((s): s is NonNullable<typeof s> => !!s);
      return <SentenceSet sentences={list} onDone={onBuilderDone} />;
    }
    case 'quiz':
      return <QuizRunner key={quizSeed} questions={questions} onFinish={onQuizDone} onRestart={() => setQuizSeed((s) => s + 1)} compact />;
  }
}
