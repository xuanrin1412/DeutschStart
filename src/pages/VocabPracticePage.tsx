import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Question, Vocabulary } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { PageHeader } from '@/components/common/PageHeader';
import { QuizRunner } from '@/components/exercises/QuizRunner';
import { AutoSpeakSwitch } from '@/components/ui/AutoSpeakSwitch';
import { WordImage } from '@/components/ui/WordImage';
import { GermanWord } from '@/components/ui/GermanWord';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { storage } from '@/services/storage';
import { dueQueue } from '@/services/srs';
import { buildRound, DEFAULT_SETTINGS, pickWords, type AnswerKind, type Direction, type PracticeSettings, type WordSource } from '@/services/vocabPractice';

const SETTINGS_KEY = 'settings.vocabPractice';

const DIRECTIONS: { id: Direction; title: string; text: string }[] = [
  { id: 'de-vi', title: 'Hỏi tiếng Đức, trả lời tiếng Việt', text: 'Nhìn "der Apfel" → trả lời "quả táo". Dễ nhất – để nhận ra từ.' },
  { id: 'vi-de', title: 'Hỏi tiếng Việt, trả lời tiếng Đức', text: 'Nhìn "quả táo" → trả lời "der Apfel". Khó hơn – giúp bạn nói và viết được.' },
  { id: 'listen', title: 'Nghe rồi trả lời', text: 'Chỉ nghe, không nhìn chữ. Luyện tai cho phần thi Nghe.' },
  { id: 'cloze', title: 'Điền từ vào câu ví dụ', text: '"Ich esse einen ___." Học từ trong ngữ cảnh – nhớ lâu nhất.' },
];

const KINDS: { id: AnswerKind; title: string; text: string }[] = [
  { id: 'choice', title: 'Trắc nghiệm 4 đáp án', text: 'Chọn 1 trong 4. Nhanh, hợp khi mới học.' },
  { id: 'typing', title: 'Tự gõ đáp án', text: 'Tự nhớ và gõ ra – khó hơn nhưng nhớ lâu hơn nhiều. Có nút 💡 gợi ý.' },
];

const SOURCES: { id: WordSource; label: string }[] = [
  { id: 'smart', label: '✨ Thông minh' },
  { id: 'due', label: '🔁 Đến hạn ôn' },
  { id: 'weak', label: '😣 Hay sai' },
  { id: 'new', label: '🌱 Từ mới' },
  { id: 'learned', label: '📚 Đã học' },
  { id: 'saved', label: '⭐ Đã lưu' },
  { id: 'topic', label: '📂 Theo chủ đề' },
];

const loadSettings = (): PracticeSettings => ({ ...DEFAULT_SETTINGS, ...storage.get<Partial<PracticeSettings>>(SETTINGS_KEY, {}) });

type Phase = { name: 'setup' } | { name: 'play'; words: Vocabulary[]; round: number } | { name: 'summary'; words: Vocabulary[]; wrongIds: string[] };

export default function VocabPracticePage() {
  const { vocabulary, topics, wordById } = useContent();
  const { progress, learnWord } = useProgress();
  const [settings, setSettings] = useState<PracticeSettings>(loadSettings);
  const [phase, setPhase] = useState<Phase>({ name: 'setup' });

  const update = (patch: Partial<PracticeSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    storage.set(SETTINGS_KEY, next);
  };

  const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? (list.length > 1 ? list.filter((x) => x !== item) : list) : [...list, item]);

  const available = useMemo(() => pickWords(vocabulary, progress, { ...settings, count: 0 }).length, [vocabulary, progress, settings]);
  const dueCount = dueQueue(progress.vocabulary).length;

  const start = (words = pickWords(vocabulary, progress, settings)) => {
    if (words.length) setPhase({ name: 'play', words, round: Date.now() });
  };

  if (phase.name === 'play')
    return (
      <PracticeRound
        key={phase.round}
        words={phase.words}
        settings={settings}
        pool={vocabulary}
        onAnswered={(id, ok) => {
          // A new word answered in practice enters the review schedule.
          if (ok && (progress.vocabulary[id]?.state ?? 'new') === 'new') learnWord(id);
        }}
        onDone={(wrongIds) => setPhase({ name: 'summary', words: phase.words, wrongIds })}
        onQuit={() => setPhase({ name: 'setup' })}
      />
    );

  if (phase.name === 'summary') {
    const wrong = phase.wrongIds.map((id) => wordById.get(id)).filter((w): w is Vocabulary => !!w);
    const right = phase.words.length - wrong.length;
    const pct = Math.round((right / Math.max(1, phase.words.length)) * 100);
    return (
      <div className="stack-lg narrow">
        <PageHeader icon="🏁" title="Kết quả luyện từ vựng" subtitle="Tính theo lần trả lời đầu tiên của mỗi từ." back={{ to: '/vocabulary', label: 'Từ vựng' }} />
        <section className="card stack-md">
          <p className="h3">
            {pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'} Nhớ đúng ngay lần đầu: {right}/{phase.words.length} từ
          </p>
          <ProgressBar value={pct} label="Tỉ lệ nhớ đúng" tone={pct >= 80 ? 'good' : 'brand'} showValue />
          <p className="muted">
            {wrong.length
              ? 'Các từ sai đã được đưa vào lịch ôn hôm nay và Sổ lỗi sai. Luyện lại ngay bây giờ sẽ giúp nhớ nhanh hơn.'
              : 'Tuyệt vời! Không sai từ nào. Hãy thử chế độ khó hơn: tự gõ, hoặc hỏi tiếng Việt – trả lời tiếng Đức.'}
          </p>
          <div className="row gap-sm wrap">
            {wrong.length > 0 && (
              <button className="btn btn-primary" onClick={() => start(wrong)}>
                🔁 Luyện lại {wrong.length} từ sai
              </button>
            )}
            <button className={`btn ${wrong.length ? 'btn-ghost' : 'btn-primary'}`} onClick={() => start()}>
              ▶ Vòng mới
            </button>
            <button className="btn btn-ghost" onClick={() => setPhase({ name: 'setup' })}>
              ⚙️ Đổi chế độ
            </button>
          </div>
        </section>
        {wrong.length > 0 && (
          <section className="card">
            <h2 className="h3">Từ cần ôn thêm</h2>
            <ul className="practice-wrong-list">
              {wrong.map((w) => (
                <li key={w.id}>
                  <WordImage image={w.image} size="sm" />
                  <Link to={`/vocabulary/word/${w.id}`} className="grow">
                    <GermanWord word={w} /> <span className="muted">– {w.meaning}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="stack-lg narrow">
      <PageHeader
        icon="🧠"
        title="Luyện từ vựng"
        subtitle="Chọn cách hỏi – cách trả lời – nhóm từ, rồi bắt đầu. Cài đặt được lưu lại cho lần sau."
        why="Tự nhớ ra từ (thay vì chỉ đọc lại) là cách nhớ lâu nhất. Mỗi câu trả lời sẽ cập nhật lịch ôn tập của từ đó."
        back={{ to: '/vocabulary', label: 'Từ vựng' }}
      />

      <fieldset className="card stack-sm option-group">
        <legend className="h4">Chế độ hỏi – trả lời</legend>
        <p className="muted small">Chọn một hoặc nhiều – mỗi câu sẽ lấy ngẫu nhiên một chế độ.</p>
        {DIRECTIONS.map((d) => (
          <label key={d.id} className="option-card">
            <input type="checkbox" checked={settings.directions.includes(d.id)} onChange={() => update({ directions: toggle(settings.directions, d.id) })} />
            <span>
              <strong>{d.title}</strong>
              <small>{d.text}</small>
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className="card stack-sm option-group">
        <legend className="h4">Loại câu hỏi</legend>
        {KINDS.map((k) => (
          <label key={k.id} className="option-card">
            <input type="checkbox" checked={settings.kinds.includes(k.id)} onChange={() => update({ kinds: toggle(settings.kinds, k.id) })} />
            <span>
              <strong>{k.title}</strong>
              <small>{k.text}</small>
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className="card stack-sm option-group">
        <legend className="h4">Nhóm từ</legend>
        <div className="chips" role="group" aria-label="Nhóm từ">
          {SOURCES.map((s) => (
            <button key={s.id} type="button" className={`chip-btn${settings.source === s.id ? ' active' : ''}`} aria-pressed={settings.source === s.id} onClick={() => update({ source: s.id })}>
              {s.id === 'due' ? `${s.label} (${dueCount})` : s.label}
            </button>
          ))}
        </div>
        {settings.source === 'topic' && (
          <select className="input" aria-label="Chọn chủ đề" value={settings.topicId} onChange={(e) => update({ topicId: e.target.value })}>
            <option value="">Chọn chủ đề…</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.icon} {t.name}
              </option>
            ))}
          </select>
        )}
        {settings.source === 'smart' && <p className="muted small">Ưu tiên từ đến hạn ôn, rồi từ hay sai, rồi thêm từ mới – cách học hiệu quả nhất mỗi ngày.</p>}
        <div className="row gap-sm center-y wrap">
          <span className="small">Số câu:</span>
          {[10, 20, 30, 0].map((n) => (
            <button key={n} type="button" className={`chip-btn${settings.count === n ? ' active' : ''}`} aria-pressed={settings.count === n} onClick={() => update({ count: n })}>
              {n === 0 ? `Tất cả (${available})` : n}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="card stack-sm option-group">
        <legend className="h4">Tùy chọn</legend>
        <label className="switch">
          <input type="checkbox" checked={settings.requireArticle} onChange={(e) => update({ requireArticle: e.target.checked })} /> Khi gõ danh từ phải có mạo từ (der Apfel, không chỉ Apfel)
        </label>
        <label className="switch">
          <input type="checkbox" checked={settings.repeatWrong} onChange={(e) => update({ repeatWrong: e.target.checked })} /> Từ trả lời sai sẽ được hỏi lại trong cùng vòng
        </label>
        <AutoSpeakSwitch />
      </fieldset>

      <div className="card row gap-sm center-y wrap space-between">
        <span className="small muted" role="status">
          {available === 0
            ? settings.source === 'topic' && !settings.topicId
              ? 'Hãy chọn một chủ đề.'
              : 'Nhóm từ này hiện chưa có từ nào – hãy chọn nhóm khác.'
            : `Sẵn sàng: ${settings.count === 0 ? available : Math.min(available, settings.count)} từ`}
        </span>
        <button className="btn btn-primary" onClick={() => start()} disabled={available === 0}>
          ▶ Bắt đầu
        </button>
      </div>
    </div>
  );
}

interface RoundProps {
  words: Vocabulary[];
  pool: Vocabulary[];
  settings: PracticeSettings;
  onAnswered: (wordId: string, ok: boolean) => void;
  onDone: (wrongIds: string[]) => void;
  onQuit: () => void;
}

const MAX_REPEATS = 2;

/** One round. Wrong words (optionally) come back 3 questions later, at most twice. */
function PracticeRound({ words, pool, settings, onAnswered, onDone, onQuit }: RoundProps) {
  const [questions, setQuestions] = useState<Question[]>(() => buildRound(words, pool, settings));
  const [wrongFirst, setWrongFirst] = useState<string[]>([]);
  const [answered, setAnswered] = useState<string[]>([]);

  const handleAnswered = (q: Question, ok: boolean) => {
    const id = q.wordId!;
    const first = !answered.includes(id);
    const position = answered.length; // index of the question just answered
    setAnswered((a) => [...a, id]);
    if (!ok && first) setWrongFirst((w) => [...w, id]);
    onAnswered(id, ok);
    const repeats = answered.filter((x) => x === id).length;
    if (!ok && settings.repeatWrong && repeats < MAX_REPEATS) {
      // Same question id: answering it correctly later also resolves the mistake-book entry.
      setQuestions((qs) => {
        const at = Math.min(position + 3, qs.length);
        return [...qs.slice(0, at), q, ...qs.slice(at)];
      });
    }
  };

  return (
    <div className="stack-lg narrow">
      <PageHeader icon="🧠" title="Luyện từ vựng" subtitle={`${words.length} từ${settings.repeatWrong ? " · câu sai sẽ được hỏi lại" : ""}`} />
      <div className="row gap-sm center-y wrap space-between">
        <AutoSpeakSwitch />
        <button className="btn btn-ghost btn-sm" onClick={onQuit}>
          ✕ Dừng
        </button>
      </div>
      <section className="card">
        <QuizRunner questions={questions} onAnswered={handleAnswered} onFinish={() => onDone(wrongFirst)} />
      </section>
    </div>
  );
}
