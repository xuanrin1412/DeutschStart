import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Question, QuestionType } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { QuizRunner } from '@/components/exercises/QuizRunner';
import {
  articleQuestion,
  imageQuestion,
  listeningSentenceQuestion,
  meaningQuestion,
  orderingQuestion,
  sample,
  shuffle,
  translationQuestion,
} from '@/services/quiz';
import { accuracy } from '@/services/selectors';

type Mode = 'mixed' | Extract<QuestionType, 'multiple-choice' | 'article' | 'listening' | 'image' | 'translation' | 'ordering'>;

const MODES: [Mode, string, string][] = [
  ['mixed', '🎲', 'Tổng hợp'],
  ['multiple-choice', '🔤', 'Trắc nghiệm'],
  ['article', '🎯', 'Mạo từ'],
  ['listening', '🎧', 'Nghe'],
  ['image', '🖼️', 'Hình ảnh'],
  ['translation', '✍️', 'Dịch câu'],
  ['ordering', '🧱', 'Sắp xếp câu'],
];

export default function QuizPage() {
  const content = useContent();
  const { progress } = useProgress();
  const [params, setParams] = useSearchParams();
  const mode = (params.get('type') as Mode) || 'mixed';
  const [seed, setSeed] = useState(0);

  const questions = useMemo<Question[]>(() => {
    const v = content.vocabulary;
    const nouns = v.filter((w) => w.article);
    const withImage = v.filter((w) => w.image.emoji || w.image.url);
    const gen: Record<Exclude<Mode, 'mixed'>, (n: number) => Question[]> = {
      'multiple-choice': (n) => sample(v, n).map((w) => meaningQuestion(w, v)),
      article: (n) => sample(nouns, n).map(articleQuestion),
      listening: (n) => sample(content.listeningSentences, n).map(listeningSentenceQuestion),
      image: (n) => sample(withImage, n).map((w) => imageQuestion(w, v)),
      translation: (n) => sample(content.translations, n).map(translationQuestion),
      ordering: (n) => sample(content.sentences, n).map(orderingQuestion),
    };
    if (mode === 'mixed') return shuffle([...gen['multiple-choice'](2), ...gen.article(2), ...gen.listening(2), ...gen.image(2), ...gen.translation(1), ...gen.ordering(1)]);
    return gen[mode](mode === 'translation' || mode === 'ordering' ? 5 : 8);
  }, [mode, seed, content]);

  const acc = accuracy(progress.quiz);

  return (
    <div className="stack-lg narrow">
      <PageHeader icon="✅" title="Quiz" subtitle={`Kiểm tra kiến thức với 6 dạng câu hỏi. Độ chính xác quiz: ${acc === null ? 'chưa có' : `${acc}%`}.`} />
      <div className="chips" role="group" aria-label="Dạng câu hỏi">
        {MODES.map(([m, icon, label]) => (
          <button
            key={m}
            className={`chip-btn${mode === m ? ' active' : ''}`}
            aria-pressed={mode === m}
            onClick={() => {
              setParams(m === 'mixed' ? {} : { type: m });
              setSeed((s) => s + 1);
            }}
          >
            <span aria-hidden="true">{icon}</span> {label}
          </button>
        ))}
      </div>
      <section className="card">
        <QuizRunner key={`${mode}-${seed}`} questions={questions} onRestart={() => setSeed((s) => s + 1)} />
      </section>
    </div>
  );
}
