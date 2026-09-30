import { useCallback, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Vocabulary } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { Flashcard } from '@/components/vocab/Flashcard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AutoSpeakSwitch } from '@/components/ui/AutoSpeakSwitch';
import { EmptyState } from '@/components/ui/States';
import { dueQueue, type Grade } from '@/services/srs';
import { savedWordIds } from '@/services/selectors';
import { shuffle } from '@/services/quiz';

const SESSION_SIZE = 10;

export default function FlashcardsPage() {
  const [params, setParams] = useSearchParams();
  const mode = params.get('mode') ?? (params.get('topic') ? 'topic' : 'new');
  const topicId = params.get('topic');
  const { vocabulary, wordById, topics, topicById } = useContent();
  const { progress, gradeWord } = useProgress();
  const [sessionKey, setSessionKey] = useState(0);

  // Build the deck once per session (grading must not reshuffle it).
  const deck = useMemo<Vocabulary[]>(() => {
    const get = (ids: string[]) => ids.map((id) => wordById.get(id)).filter((w): w is Vocabulary => !!w);
    if (mode === 'due') return get(dueQueue(progress.vocabulary)).slice(0, 20);
    if (mode === 'saved') return get(savedWordIds(progress));
    if (mode === 'topic' && topicId) return shuffle(vocabulary.filter((w) => w.topicId === topicId));
    // New words first (easiest first), then fill up with other words.
    const fresh = vocabulary.filter((w) => (progress.vocabulary[w.id]?.state ?? 'new') === 'new').sort((a, b) => a.difficulty - b.difficulty);
    return fresh.length ? fresh.slice(0, SESSION_SIZE) : shuffle(vocabulary).slice(0, SESSION_SIZE);
  }, [mode, topicId, sessionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const [queue, setQueue] = useState<Vocabulary[]>(deck);
  const [stats, setStats] = useState({ again: 0, good: 0, easy: 0 });
  const [deckId, setDeckId] = useState(deck);
  if (deckId !== deck) {
    // Deck changed (new mode or restart): reset session state.
    setDeckId(deck);
    setQueue(deck);
    setStats({ again: 0, good: 0, easy: 0 });
  }

  const current = queue[0];
  const reviewed = stats.again + stats.good + stats.easy;

  const onGrade = useCallback(
    (g: Grade) => {
      if (!current) return;
      gradeWord(current.id, g);
      setStats((s) => ({ ...s, [g]: s[g] + 1 }));
      // "Không nhớ" → the card comes back later in this session.
      setQueue((q) => (g === 'again' ? [...q.slice(1), q[0]] : q.slice(1)));
    },
    [current, gradeWord],
  );

  const modeLabel = mode === 'due' ? 'Ôn tập hôm nay' : mode === 'saved' ? 'Từ đã lưu' : mode === 'topic' && topicId ? `Chủ đề: ${topicById.get(topicId)?.name ?? ''}` : 'Từ mới';

  return (
    <div className="stack-lg narrow">
      <PageHeader icon="🃏" title="Flashcards" subtitle="Lật thẻ, tự kiểm tra, rồi đánh giá mức độ nhớ. Hệ thống sẽ lên lịch ôn lại: 1 → 3 → 7 → 14 → 30 ngày." />

      <div className="chips" role="group" aria-label="Chọn bộ thẻ">
        {[
          ['new', '🌱 Từ mới'],
          ['due', `🔁 Đến hạn (${dueQueue(progress.vocabulary).length})`],
          ['saved', '⭐ Đã lưu'],
        ].map(([m, label]) => (
          <button key={m} className={`chip-btn${mode === m ? ' active' : ''}`} aria-pressed={mode === m} onClick={() => setParams({ mode: m })}>
            {label}
          </button>
        ))}
        <select className="input input-sm" aria-label="Chọn chủ đề" value={mode === 'topic' ? topicId ?? '' : ''} onChange={(e) => e.target.value && setParams({ topic: e.target.value })}>
          <option value="">📂 Theo chủ đề…</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.icon} {t.name}
            </option>
          ))}
        </select>
      </div>

      {deck.length === 0 ? (
        <EmptyState
          icon={mode === 'due' ? '🎉' : '🗂️'}
          title={mode === 'due' ? 'Không có từ nào cần ôn hôm nay' : 'Bộ thẻ trống'}
          action={{ label: 'Học từ mới', to: '/flashcards?mode=new' }}
        >
          {mode === 'saved' ? 'Bạn chưa lưu từ nào.' : 'Quay lại vào ngày mai hoặc học thêm từ mới.'}
        </EmptyState>
      ) : current ? (
        <>
          <div className="row gap-sm center-y">
            <span className="badge">{modeLabel}</span>
            <div className="grow">
              <ProgressBar value={(reviewed / (reviewed + queue.length)) * 100} label="Tiến độ phiên học" size="sm" />
            </div>
            <span className="small muted">Còn {queue.length} thẻ</span>
          </div>
          {/* Keyed by position too, so a card that comes back after "Không nhớ" is spoken again. */}
          <Flashcard key={`${current.id}-${reviewed}`} word={current} onGrade={onGrade} />
          <div className="row gap-sm center-y wrap space-between">
            <AutoSpeakSwitch />
            <p className="muted small">Phím tắt: Space = lật · 1 = Không nhớ · 2 = Nhớ · 3 = Rất dễ</p>
          </div>
        </>
      ) : (
        <div className="card quiz-done">
          <div className="big-emoji" aria-hidden="true">
            🎉
          </div>
          <h2 className="h3">Hoàn thành phiên học!</h2>
          <p>
            😣 Không nhớ: <strong>{stats.again}</strong> · 🙂 Nhớ: <strong>{stats.good}</strong> · 😎 Rất dễ: <strong>{stats.easy}</strong>
          </p>
          <p className="muted">Các từ đã được lên lịch ôn tập. Hẹn gặp lại!</p>
          <div className="row gap-sm wrap center">
            <button className="btn btn-primary" onClick={() => setSessionKey((k) => k + 1)}>
              Học thêm
            </button>
            <Link to="/quiz" className="btn btn-ghost">
              ✅ Làm quiz
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
