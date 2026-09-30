import { useState } from 'react';
import type { SentenceExercise } from '@/types/models';
import { SentenceBuilder } from './SentenceBuilder';
import { orderingQuestion } from '@/services/quiz';
import { useProgress } from '@/context/ProgressContext';

/** Several sentence-builder exercises in a row. */
export function SentenceSet({ sentences, onDone }: { sentences: SentenceExercise[]; onDone?: () => void }) {
  const [i, setI] = useState(0);
  const { recordAnswer } = useProgress();
  const s = sentences[i];
  if (!s) return null;
  const last = i === sentences.length - 1;
  return (
    <div>
      <p className="eyebrow">
        Câu {i + 1} / {sentences.length}
      </p>
      <SentenceBuilder
        key={s.id}
        tokens={s.tokens}
        punctuation={s.punctuation}
        vi={s.vi}
        structure={s.structure}
        alternatives={s.alternatives}
        onResult={(ok, answer) => recordAnswer(orderingQuestion(s), ok, answer)}
        onContinue={last ? onDone : () => setI(i + 1)}
        continueLabel={last ? 'Hoàn thành' : 'Câu tiếp theo'}
      />
    </div>
  );
}
