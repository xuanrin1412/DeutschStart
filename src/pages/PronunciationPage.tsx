import { useState } from 'react';
import type { PronunciationSound } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { SoundCard } from '@/components/pronunciation/SoundCard';
import { speechRecognizer } from '@/services/speech/speechRecognition';

type Cat = 'all' | PronunciationSound['category'];
const CATS: [Cat, string][] = [
  ['all', 'Tất cả'],
  ['vowel', 'Nguyên âm'],
  ['consonant', 'Phụ âm'],
  ['special', 'Âm đặc biệt'],
];

export default function PronunciationPage() {
  const { sounds } = useContent();
  const { progress } = useProgress();
  const [cat, setCat] = useState<Cat>('all');
  const list = sounds.filter((s) => cat === 'all' || s.category === cat);
  const { practiced, matched } = progress.pronunciation;

  return (
    <div className="stack-lg">
      <PageHeader
        icon="🗣️"
        title="Phát âm"
        subtitle="Những âm khó nhất với người Việt: ch, r, ü, ö, ä, z, w, v, sch, sp, st…"
        why="Phát âm đúng giúp người Đức hiểu bạn ngay – và giúp bạn nghe tốt hơn, vì bạn nhận ra những âm mình đã luyện."
      />

      <div className="grid grid-3">
        <div className="card">
          <p className="muted small">Âm đã luyện</p>
          <p className="stat-big">
            {sounds.filter((s) => progress.pronunciation.sounds.includes(s.id)).length}/{sounds.length}
          </p>
        </div>
        <div className="card">
          <p className="muted small">Lượt luyện tập</p>
          <p className="stat-big">{practiced}</p>
        </div>
        <div className="card">
          <p className="muted small">Nói đúng (nhận dạng giọng nói)</p>
          <p className="stat-big">{matched}</p>
          {!speechRecognizer.isSupported() && <p className="muted small">Cần Chrome/Edge để luyện nói với micro.</p>}
        </div>
      </div>

      <div className="chips" role="group" aria-label="Lọc âm">
        {CATS.map(([c, label]) => (
          <button key={c} className={`chip-btn${cat === c ? ' active' : ''}`} aria-pressed={cat === c} onClick={() => setCat(c)}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-2 align-start">
        {list.map((s) => (
          <SoundCard key={s.id} sound={s} />
        ))}
      </div>
    </div>
  );
}
