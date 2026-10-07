import { useMemo, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { AlphabetLetter, Lesson, LessonStep, Question, Skill } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { EmptyState } from '@/components/ui/States';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AudioButton } from '@/components/ui/AudioButton';
import { Ipa } from '@/components/ui/GermanWord';
import { LetterCard, LetterTile } from '@/components/alphabet/LetterCard';
import { SoundCard } from '@/components/pronunciation/SoundCard';
import { SentenceSet } from '@/components/exercises/SentenceSet';
import { QuizRunner } from '@/components/exercises/QuizRunner';
import { GermanText } from '@/components/text/GermanText';
import { FavoriteStar } from '@/components/lesson/FavoriteStar';
import { ExampleLine, TeachWord, TermCard } from '@/components/lesson/TeachWord';
import { isMastered, lessonStatus, MASTERY, meetsMastery, missingPrerequisites, SKILL_LABELS, weakSkills } from '@/services/curriculum';
import { buildPractice, buildWarmup, scoreBySkill, type PracticeContext } from '@/services/lessonPractice';
import { skillOf } from '@/context/ProgressContext';

export default function LessonPage() {
  const { lessonId = '' } = useParams();
  const { lessonById } = useContent();
  const lesson = lessonById.get(lessonId);
  if (!lesson) return <EmptyState icon="🔍" title="Không tìm thấy bài học" action={{ label: 'Về danh sách bài', to: '/learn' }} />;
  if (lesson.available === false)
    return (
      <EmptyState icon="🔒" title={`${lesson.title} – sắp ra mắt`} action={{ label: 'Về lộ trình học', to: '/learn' }}>
        {lesson.objective}
        <span className="row gap-sm center-y center">
          <FavoriteStar lesson={lesson} /> <span className="small muted">Lưu bài này để học khi ra mắt</span>
        </span>
      </EmptyState>
    );
  return <LessonFlow key={lesson.id} lesson={lesson} />;
}

type Phase = 'intro' | 'warmup' | 'learn' | 'practice' | 'result';
interface Result {
  scores: Partial<Record<Skill, number>>;
  best: Partial<Record<Skill, number>>;
  mastered: boolean;
}

function LessonFlow({ lesson }: { lesson: Lesson }) {
  useDocumentTitle(lesson.title);
  const content = useContent();
  const { progress, updateLesson, completeLesson } = useProgress();
  const saved = progress.lessons[lesson.id];
  const steps = useMemo(() => lesson.steps.filter((s) => s.type !== 'quiz'), [lesson]);
  const teaches = content.curriculum.teaches.get(lesson.id) ?? [];
  const lessonNew = useMemo(() => new Set(teaches), [teaches]);
  const [phase, setPhase] = useState<Phase>(saved && !saved.completed && saved.step > 0 ? 'learn' : 'intro');
  const [step, setStep] = useState(() => (saved && !saved.completed ? Math.min(saved.step, steps.length - 1) : 0));
  const [practice, setPractice] = useState<{ questions: Question[]; targeted?: Skill[]; key: number } | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const ctx = useMemo<PracticeContext>(() => {
    const earlier = content.lessons.filter((l) => l.order < lesson.order && l.available !== false);
    return {
      lexicon: content.lexicon,
      wordById: content.wordById,
      letterByChar: content.letterByChar,
      soundById: content.soundById,
      sentenceById: content.sentenceById,
      vocabulary: content.vocabulary,
      teaches,
      knownBefore: content.curriculum.knownBefore.get(lesson.id) ?? new Set(),
      earlierSentences: earlier.flatMap((l) => l.sentences ?? []),
      progress,
    };
    // Built once per lesson visit; progress changes during practice must not regenerate questions.
  }, [lesson, content]); // eslint-disable-line react-hooks/exhaustive-deps

  const previousTeaches = useMemo(() => {
    const prev = content.lessons.filter((l) => lesson.prerequisites.includes(l.id) || (l.order < lesson.order && l.order >= lesson.order - 3));
    return [...new Set(prev.flatMap((l) => content.curriculum.teaches.get(l.id) ?? []))];
  }, [lesson, content]);

  const warmup = useMemo(() => buildWarmup(ctx, previousTeaches), [ctx, previousTeaches]);

  const startPractice = (targeted?: Skill[]) => {
    const questions = buildPractice(lesson, ctx, targeted ? { onlySkills: targeted, perRound: 8 } : {});
    setPractice({ questions, targeted, key: Date.now() });
    setResult(null);
    setPhase('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finishPractice = (answers: { skill: Skill; ok: boolean }[]) => {
    const scores = scoreBySkill(answers);
    const best = { ...saved?.skills };
    for (const [k, v] of Object.entries(scores) as [Skill, number][]) best[k] = Math.max(v, best[k] ?? 0);
    const mastered = Object.keys(best).length === 0 || meetsMastery(best);
    completeLesson(lesson.id, scores, mastered, steps.length);
    setResult({ scores, best, mastered });
    setPhase('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const go = (to: number) => {
    setStep(to);
    updateLesson(lesson.id, to, steps.length);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const header = (
    <div className="lesson-top">
      <Link to="/learn" className="back-link">
        ← Lộ trình học
      </Link>
      <p className="eyebrow">
        {lesson.level} · Unit {lesson.unit} · <span lang="de">{lesson.titleDe}</span> · ⏱ {lesson.minutes} phút
      </p>
      <div className="row gap-sm center-y space-between">
        <h1 className="h2">
          {lesson.icon} {lesson.title}
        </h1>
        <FavoriteStar lesson={lesson} />
      </div>
    </div>
  );

  if (phase === 'intro') return <LessonIntro lesson={lesson} teaches={teaches} header={header} hasWarmup={previousTeaches.length > 0} onStart={(warm) => setPhase(warm ? 'warmup' : 'learn')} onPractice={() => startPractice()} />;

  if (phase === 'warmup')
    return (
      <div className="lesson stack-md narrow">
        {header}
        <section className="card stack-sm">
          <h2 className="h3">🔁 Ôn bài cũ</h2>
          <p className="muted">Vài câu hỏi nhanh về những gì bạn đã học – để không quên trước khi học điều mới. Phần này không tính điểm.</p>
          <QuizRunner questions={warmup} onFinish={() => setPhase('learn')} compact />
          <button className="btn btn-ghost btn-sm" onClick={() => setPhase('learn')}>
            Bỏ qua phần ôn →
          </button>
        </section>
      </div>
    );

  if (phase === 'practice' && practice)
    return (
      <div className="lesson stack-md narrow">
        {header}
        <section className="card stack-sm" aria-labelledby="practice-title">
          <h2 id="practice-title" className="h3">
            {practice.targeted ? `🎯 Ôn lại: ${practice.targeted.map((s) => SKILL_LABELS[s]).join(', ')}` : '✅ Luyện tập và kiểm tra'}
          </h2>
          <p className="muted small">Câu trả lời sai sẽ được hỏi lại sau vài câu. Điểm tính theo lần trả lời đầu tiên.</p>
          <PracticeRunner key={practice.key} questions={practice.questions} onDone={finishPractice} />
        </section>
      </div>
    );

  if (phase === 'result' && result)
    return (
      <LessonResult
        lesson={lesson}
        header={header}
        result={result}
        newWords={teaches.length}
        onReviewWeak={() => startPractice(weakSkills(result.best))}
        onRelearn={() => {
          setStep(0);
          setPhase('learn');
        }}
        onRetry={() => startPractice()}
      />
    );

  // Learn phase
  const current: LessonStep = steps[step];
  return <LearnSteps lesson={lesson} steps={steps} step={step} current={current} header={header} lessonNew={lessonNew} go={go} onDone={() => startPractice()} />;
}

/* ---------------- Intro: goal, prerequisites, new words ---------------- */

function LessonIntro({ lesson, teaches, header, hasWarmup, onStart, onPractice }: { lesson: Lesson; teaches: string[]; header: ReactNode; hasWarmup: boolean; onStart: (warmup: boolean) => void; onPractice: () => void }) {
  const { lessonById, lexicon, termById } = useContent();
  const { progress } = useProgress();
  const missing = missingPrerequisites(lesson, progress);
  const status = lessonStatus(lesson, progress);
  const saved = progress.lessons[lesson.id];
  const words = teaches.map((id) => lexicon.byId.get(id)).filter((l): l is NonNullable<typeof l> => !!l);
  const conceptTerms = lesson.steps.flatMap((s) => (s.type === 'concept' ? s.terms ?? [] : [])).map((id) => termById.get(id)).filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <div className="lesson stack-md narrow">
      {header}
      <section className="card stack-sm">
        <h2 className="h3">🎯 Mục tiêu bài học</h2>
        <p className="lesson-text">{lesson.objective}</p>
      </section>

      <section className="card stack-sm">
        <h2 className="h3">📋 Bạn cần biết trước</h2>
        {lesson.prerequisites.length === 0 ? (
          <p>Không cần kiến thức nào – bài này bắt đầu từ số 0.</p>
        ) : (
          <ul className="prereq-list">
            {lesson.prerequisites.map((id) => {
              const p = lessonById.get(id);
              const ok = isMastered(progress.lessons[id]);
              return (
                <li key={id} className={ok ? 'is-ok' : 'is-missing'}>
                  <span aria-hidden="true">{ok ? '✓' : '○'}</span> {p ? <Link to={`/learn/${id}`}>{p.icon} {p.title}</Link> : id}
                  <span className="sr-only">{ok ? ' – đã thành thạo' : ' – chưa thành thạo'}</span>
                </li>
              );
            })}
          </ul>
        )}
        {missing.length > 0 && (
          <div className="tip" role="status">
            ⚠️ Bạn chưa thành thạo bài trước. Nên hoàn thành <Link to={`/learn/${missing[0]}`}>{lessonById.get(missing[0])?.title}</Link> trước để hiểu hết bài này. Bạn vẫn có thể xem trước.
          </div>
        )}
      </section>

      {(words.length > 0 || conceptTerms.length > 0) && (
        <section className="card stack-sm">
          {words.length > 0 && (
            <>
              <h2 className="h3">🆕 Từ mới trong bài ({words.length})</h2>
              <ul className="new-words">
                {words.map((l) => (
                  <li key={l.id}>
                    <strong lang="de">{l.lemma}</strong> <span className="muted">– {l.meaning}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {conceptTerms.length > 0 && (
            <p className="small">
              📘 Khái niệm ngữ pháp: {conceptTerms.map((t) => t.vi).join(', ')} – được giải thích từ đầu trong bài.
            </p>
          )}
        </section>
      )}

      {saved?.skills && Object.keys(saved.skills).length > 0 && (
        <section className="card stack-sm">
          <h2 className="h3">📊 Kết quả gần nhất</h2>
          <SkillBars scores={saved.skills} />
        </section>
      )}

      <div className="row gap-sm wrap">
        {hasWarmup && status !== 'mastered' ? (
          <>
            <button className="btn btn-primary" onClick={() => onStart(true)}>
              🔁 Ôn bài cũ rồi học (1 phút)
            </button>
            <button className="btn btn-ghost" onClick={() => onStart(false)}>
              Vào học luôn →
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={() => onStart(false)}>
            {saved?.completed ? '📖 Học lại bài' : 'Bắt đầu học →'}
          </button>
        )}
        {saved?.completed && (
          <button className="btn btn-ghost" onClick={onPractice}>
            ✅ Chỉ luyện tập
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Learn: steps one at a time ---------------- */

function LearnSteps({ lesson, steps, step, current, header, lessonNew, go, onDone }: { lesson: Lesson; steps: LessonStep[]; step: number; current: LessonStep; header: ReactNode; lessonNew: Set<string>; go: (n: number) => void; onDone: () => void }) {
  const [stepDone, setStepDone] = useState<Record<number, boolean>>({});
  const total = steps.length;
  const needsFinish = current.type === 'words' || current.type === 'builder';
  const blocked = needsFinish && !stepDone[step];
  const isLast = step === total - 1;

  return (
    <div className="lesson stack-md narrow">
      {header}
      <p className="small muted">
        Phần học: bước {step + 1}/{total} · sau đó là luyện tập và kiểm tra
      </p>
      <ol className="stepper" aria-label={`Tiến độ bài học: bước ${step + 1} trên ${total}`}>
        {steps.map((s, i) => (
          <li key={i} className={i < step ? 'done' : i === step ? 'current' : ''} aria-current={i === step ? 'step' : undefined}>
            <span className="sr-only">
              Bước {i + 1}: {s.title}
            </span>
          </li>
        ))}
      </ol>

      <section className="card lesson-step" aria-labelledby="step-title">
        <h2 id="step-title" className="h3">
          {current.title}
        </h2>
        <StepBody key={`${lesson.id}-${step}`} step={current} lessonNew={lessonNew} onFinished={() => setStepDone((d) => ({ ...d, [step]: true }))} />
      </section>

      <div className="lesson-nav">
        <button className="btn btn-ghost" onClick={() => go(step - 1)} disabled={step === 0}>
          ← Quay lại
        </button>
        {isLast ? (
          <button className="btn btn-primary" onClick={onDone} disabled={blocked}>
            Luyện tập và kiểm tra →
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => go(step + 1)} disabled={blocked}>
            Tiếp theo →
          </button>
        )}
      </div>
      {blocked && <p className="muted small center-text">{current.type === 'words' ? 'Xem hết các từ mới để tiếp tục.' : 'Hoàn thành bài ghép câu để tiếp tục.'}</p>}
      <p className="muted small center-text">
        Bấm vào bất kỳ từ tiếng Đức nào để xem nghĩa. <span className="gt-word gt-lesson">Gạch xanh</span> = từ mới của bài, <span className="gt-word gt-unknown">tô cam</span> = từ chưa học.
      </p>
    </div>
  );
}

function StepBody({ step, lessonNew, onFinished }: { step: LessonStep; lessonNew: Set<string>; onFinished: () => void }) {
  const content = useContent();
  const { progress, markLetterSeen } = useProgress();
  const [openLetter, setOpenLetter] = useState<AlphabetLetter | null>(null);
  const [wordIndex, setWordIndex] = useState(0);

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
    case 'concept':
      return (
        <div className="stack-md">
          {(step.terms ?? []).map((id) => {
            const t = content.termById.get(id);
            return t && <TermCard key={id} term={t} />;
          })}
          {step.body.map((p, i) => (
            <p key={i} className="lesson-text">
              {p}
            </p>
          ))}
          {step.table && (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    {step.table.headers.map((h) => (
                      <th key={h} scope="col">
                        {h}
                      </th>
                    ))}
                    {step.table.audioCols && (
                      <th scope="col">
                        <span className="sr-only">Nghe</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {step.table.rows.map((r, i) => (
                    <tr key={i}>
                      {r.map((c, j) => (
                        <td key={j} lang={step.table!.audioCols?.includes(j) ? 'de' : undefined}>
                          {c}
                        </td>
                      ))}
                      {step.table!.audioCols && (
                        <td className="td-audio">
                          <AudioButton text={step.table!.audioCols.map((j) => r[j]).join(' ').replace(/ \/ /g, ', ')} size="sm" />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    case 'words': {
      const id = step.words[wordIndex];
      const last = wordIndex === step.words.length - 1;
      return (
        <div className="stack-md">
          <p className="eyebrow">
            Từ {wordIndex + 1} / {step.words.length}
          </p>
          <TeachWord key={id} id={id} example={step.examples?.[id]} lessonNew={lessonNew} />
          <div className="row gap-sm space-between">
            <button className="btn btn-ghost btn-sm" onClick={() => setWordIndex((i) => i - 1)} disabled={wordIndex === 0}>
              ← Từ trước
            </button>
            {!last ? (
              <button className="btn btn-primary btn-sm" onClick={() => setWordIndex((i) => i + 1)}>
                Từ tiếp theo →
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={onFinished}>
                ✓ Đã xem hết từ mới
              </button>
            )}
          </div>
        </div>
      );
    }
    case 'examples':
      return (
        <div className="stack-sm">
          {step.items.map((e) => (
            <ExampleLine key={e.de} example={e} lessonNew={lessonNew} />
          ))}
        </div>
      );
    case 'phrases':
      return (
        <ul className="phrase-list">
          {step.items.map((p) => (
            <li key={p.de} className="phrase">
              {p.emoji && (
                <span className="phrase-emoji" aria-hidden="true">
                  {p.emoji}
                </span>
              )}
              <div className="grow">
                <GermanText as="p" className="phrase-de" text={p.de} lessonNew={lessonNew} />
                {p.ipa && <Ipa>{p.ipa}</Ipa>}
                <p className="phrase-vi">{p.vi}</p>
                {p.note && <p className="muted small">💬 {p.note}</p>}
              </div>
              <div className="row gap-xs">
                <AudioButton text={p.de.replace(' – ', ', ')} size="sm" />
                <AudioButton text={p.de.replace(' – ', ', ')} size="sm" slow />
              </div>
            </li>
          ))}
        </ul>
      );
    case 'letters':
      return (
        <>
          <p className="muted small">Bấm vào từng chữ để nghe tên chữ và âm của nó.</p>
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
            {openLetter && <LetterCard letter={openLetter} inLesson />}
          </Modal>
        </>
      );
    case 'sounds':
      return (
        <div className="stack-md">
          {step.soundIds.map((sid) => {
            const s = content.soundById.get(sid);
            return s && <SoundCard key={sid} sound={s} />;
          })}
        </div>
      );
    case 'builder': {
      const list = step.sentenceIds.map((sid) => content.sentenceById.get(sid)).filter((s): s is NonNullable<typeof s> => !!s);
      return <SentenceSet sentences={list} onDone={onFinished} />;
    }
    case 'quiz':
      return null;
  }
}

/* ---------------- Practice with retries ---------------- */

/** Runs the practice; a wrong answer comes back 3 questions later. Scores use the first try of each question. */
function PracticeRunner({ questions: initial, onDone }: { questions: Question[]; onDone: (answers: { skill: Skill; ok: boolean }[]) => void }) {
  const [questions, setQuestions] = useState(initial);
  const [first, setFirst] = useState<Record<string, { skill: Skill; ok: boolean }>>({});
  const [answered, setAnswered] = useState(0);

  if (!initial.length) {
    return (
      <div className="stack-sm">
        <p>Bài này chỉ có phần đọc hiểu, không có câu hỏi.</p>
        <button className="btn btn-primary" onClick={() => onDone([])}>
          Hoàn thành ✓
        </button>
      </div>
    );
  }

  return (
    <QuizRunner
      questions={questions}
      onAnswered={(q, ok) => {
        const position = answered;
        setAnswered((n) => n + 1);
        const isFirst = !first[q.id];
        if (isFirst) setFirst((f) => ({ ...f, [q.id]: { skill: skillOf(q), ok } }));
        if (!ok && isFirst)
          setQuestions((qs) => {
            const at = Math.min(position + 4, qs.length);
            return [...qs.slice(0, at), { ...q, round: `🔁 Hỏi lại · ${q.round ?? ''}` }, ...qs.slice(at)];
          });
      }}
      onFinish={() => onDone(Object.values(first))}
    />
  );
}

/* ---------------- Result: mastery gate ---------------- */

export function SkillBars({ scores, best }: { scores: Partial<Record<Skill, number>>; best?: Partial<Record<Skill, number>> }) {
  return (
    <ul className="skill-bars">
      {(Object.entries(best ?? scores) as [Skill, number][]).map(([skill, v]) => {
        const ok = v >= MASTERY[skill];
        return (
          <li key={skill}>
            <span className="row space-between small">
              <span>
                {ok ? '✓' : '○'} {SKILL_LABELS[skill]}
              </span>
              <span>
                <strong>{v}%</strong> <span className="muted">/ cần {MASTERY[skill]}%</span>
              </span>
            </span>
            <ProgressBar value={v} label={`${SKILL_LABELS[skill]}: ${v}%`} size="sm" tone={ok ? 'good' : 'brand'} />
          </li>
        );
      })}
    </ul>
  );
}

function LessonResult({ lesson, header, result, newWords, onReviewWeak, onRelearn, onRetry }: { lesson: Lesson; header: ReactNode; result: Result; newWords: number; onReviewWeak: () => void; onRelearn: () => void; onRetry: () => void }) {
  const { lessons } = useContent();
  const next = [...lessons].sort((a, b) => a.order - b.order).find((l) => l.order > lesson.order && l.available !== false);
  const weak = weakSkills(result.best);
  const concepts = lesson.concepts?.length ?? 0;
  const patterns = lesson.patterns?.length ?? 0;
  const values = Object.values(result.best);
  const average = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 100;
  const heading = result.mastered ? 'Bài học hoàn thành!' : average >= 60 ? 'Gần được rồi!' : 'Hãy luyện thêm một chút';

  return (
    <div className="lesson stack-md narrow">
      {header}
      <section className="card lesson-complete stack-md" aria-live="polite">
        <div className="big-emoji" aria-hidden="true">
          {result.mastered ? '🎉' : average >= 60 ? '💪' : '📚'}
        </div>
        <h2 className="h2">{heading}</h2>
        <p>
          Bạn đã học: <strong>{newWords}</strong> từ mới
          {concepts > 0 && (
            <>
              {' '}
              · <strong>{concepts}</strong> khái niệm ngữ pháp
            </>
          )}
          {patterns > 0 && (
            <>
              {' '}
              · <strong>{patterns}</strong> mẫu câu
            </>
          )}
        </p>
      </section>

      <section className="card stack-sm">
        <h2 className="h3">📊 Điểm của bạn (lần trả lời đầu tiên)</h2>
        {Object.keys(result.best).length ? <SkillBars scores={result.scores} best={result.best} /> : <p className="muted">Bài này không có phần kiểm tra theo kỹ năng.</p>}
      </section>

      {result.mastered ? (
        <section className="card stack-sm">
          <p>✅ Bạn đã đạt yêu cầu ở mọi kỹ năng. Những từ vừa học sẽ xuất hiện trong phần ôn tập.</p>
          <div className="row gap-sm wrap">
            {next && (
              <Link to={`/learn/${next.id}`} className="btn btn-primary">
                Bài tiếp theo: {next.icon} {next.title} →
              </Link>
            )}
            <Link to="/learn" className="btn btn-ghost">
              Lộ trình học
            </Link>
          </div>
        </section>
      ) : (
        <section className="card stack-sm" role="status">
          <p className="h4">Bạn chưa cần học bài tiếp theo.</p>
          <p>
            Bạn đang yếu phần <strong>{weak.map((s) => SKILL_LABELS[s].toLowerCase()).join(', ')}</strong>. Ôn lại riêng phần này – chỉ mất vài phút – rồi bài tiếp theo sẽ mở.
          </p>
          <div className="row gap-sm wrap">
            <button className="btn btn-primary" onClick={onReviewWeak}>
              🎯 Ôn lại phần này
            </button>
            <button className="btn btn-ghost" onClick={onRelearn}>
              📖 Đọc lại bài học
            </button>
            <button className="btn btn-ghost" onClick={onRetry}>
              🔁 Làm lại toàn bộ
            </button>
          </div>
          {next && (
            <p className="muted small">
              🔒 Bài tiếp theo ({next.title}) sẽ mở khi bạn đạt yêu cầu.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
