import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CefrLevel, Skill, SrsState } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { achievements } from '@/data/achievements';
import { a1Progress, accuracy, currentLevel, formatMinutes, learnedWordIds, masteredCount } from '@/services/selectors';
import { ARTICLES, SRS_LABELS } from '@/constants';
import { isMastered, levelMastery, MASTERY, SKILL_LABELS } from '@/services/curriculum';

/** Where to practise each skill. */
const SKILL_PRACTICE: Record<Skill, string> = {
  vocab: '/vocabulary/practice',
  article: '/articles',
  listening: '/listening',
  sentence: '/quiz?type=ordering',
  grammar: '/grammar',
  pronunciation: '/pronunciation',
};

export default function ProgressPage() {
  const content = useContent();
  const { progress } = useProgress();
  const { user } = useAuth();

  const level = currentLevel(progress, content);
  const pct = a1Progress(progress, content);
  const learned = learnedWordIds(progress).length;
  const grammarAvail = content.grammar.filter((g) => g.available);
  const grammarDone = grammarAvail.filter((g) => progress.grammarLessons[g.id]?.completed).length;
  const courseLessons = content.lessons.filter((l) => l.available !== false);
  const lessonsDone = courseLessons.filter((l) => isMastered(progress.lessons[l.id])).length;

  const listening = accuracy(progress.listening);
  const quiz = accuracy(progress.quiz);
  const grammarAcc = accuracy(progress.grammar);
  const srsCounts = Object.values(progress.vocabulary).reduce<Record<SrsState, number>>((a, v) => ({ ...a, [v.state]: a[v.state] + 1 }), { new: 0, learning: 0, review: 0, mastered: 0 });
  srsCounts.new = content.vocabulary.length - learned;

  const tiles = [
    { label: 'Từ vựng đã học', value: `${learned}`, sub: `/ ${content.vocabulary.length} từ`, to: '/vocabulary' },
    { label: 'Từ thành thạo', value: `${masteredCount(progress)}`, sub: 'ôn sau 30 ngày', to: '/review' },
    { label: 'Bài ngữ pháp', value: `${grammarDone}`, sub: `/ ${grammarAvail.length} bài`, to: '/grammar' },
    { label: 'Bài đã thành thạo', value: `${lessonsDone}`, sub: `/ ${courseLessons.length} bài A0–A1`, to: '/learn' },
    { label: 'Luyện nghe', value: listening === null ? '—' : `${listening}%`, sub: `${progress.listening.total} câu`, to: '/listening' },
    { label: 'Quiz', value: quiz === null ? '—' : `${quiz}%`, sub: `${progress.quiz.total} câu`, to: '/quiz' },
    { label: 'Ngữ pháp (bài tập)', value: grammarAcc === null ? '—' : `${grammarAcc}%`, sub: `${progress.grammar.total} câu`, to: '/grammar' },
    { label: 'Phát âm', value: `${progress.pronunciation.practiced}`, sub: 'lượt luyện', to: '/pronunciation' },
    { label: 'Chuỗi học', value: `🔥 ${progress.streak.current}`, sub: `kỷ lục ${progress.streak.longest} ngày`, to: '/review' },
    { label: 'Thời gian học', value: formatMinutes(progress.studySeconds), sub: 'tổng cộng', to: '/' },
  ];

  return (
    <div className="stack-lg">
      <PageHeader icon="📈" title="Tiến độ học tập" subtitle={user ? `Tài khoản: ${user.email}` : 'Bạn đang học với chế độ Khách – đăng ký để lưu tiến độ trên nhiều thiết bị.'} />

      <section className="card level-hero">
        <div className="level-badge" aria-label={`Trình độ hiện tại ${level}`}>
          {level}
        </div>
        <div className="grow">
          <p className="eyebrow">Tiến độ đến A1</p>
          <ProgressBar value={pct} label="Tiến độ A1" size="lg" showValue />
          <p className="muted small">Tính từ mức thành thạo của các bài A0 và A1. Một bài chỉ tính đủ 100% khi bạn qua phần kiểm tra cuối bài.</p>
        </div>
      </section>

      <MasteryPanel initial={level === 'A0' ? 'A0' : 'A1'} />

      <div className="grid grid-stats">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to} className="card card-hover stat-tile">
            <span className="muted small">{t.label}</span>
            <span className="stat-value">{t.value}</span>
            <span className="muted small">{t.sub}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-2">
        <section className="card" aria-labelledby="art">
          <h2 id="art" className="h3">
            Độ chính xác mạo từ
          </h2>
          <div className="bars">
            {ARTICLES.map((a) => {
              const acc = accuracy(progress.articleStats[a]);
              return (
                <div key={a} className="bar-row">
                  <span className={`bar-label article-${a}`}>{a.toUpperCase()}</span>
                  <div className="grow">
                    <ProgressBar value={acc ?? 0} label={`Độ chính xác ${a}`} tone={a} />
                  </div>
                  <span className="bar-value">{acc === null ? '—' : `${acc}%`}</span>
                </div>
              );
            })}
          </div>
          <Link to="/articles" className="link">
            Luyện mạo từ →
          </Link>
        </section>

        <section className="card" aria-labelledby="srs">
          <h2 id="srs" className="h3">
            Trạng thái từ vựng
          </h2>
          <div className="bars">
            {(['new', 'learning', 'review', 'mastered'] as SrsState[]).map((s) => (
              <div key={s} className="bar-row">
                <span className="bar-label">{SRS_LABELS[s]}</span>
                <div className="grow">
                  <ProgressBar value={(srsCounts[s] / Math.max(1, content.vocabulary.length)) * 100} label={`Số từ ở trạng thái ${SRS_LABELS[s]}`} tone={s === 'mastered' ? 'good' : 'brand'} />
                </div>
                <span className="bar-value">{srsCounts[s]}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section aria-labelledby="ach">
        <h2 id="ach" className="h3">
          Thành tích
        </h2>
        <div className="grid grid-ach">
          {achievements.map((a) => {
            const at = progress.achievements[a.id];
            return (
              <div key={a.id} className={`card achievement${at ? '' : ' is-locked'}`}>
                <span className="ach-icon" aria-hidden="true">
                  {at ? a.icon : '🔒'}
                </span>
                <strong>{a.title}</strong>
                <span className="muted small">{a.description}</span>
                {at && <span className="small text-good">✓ {new Date(at).toLocaleDateString('vi-VN')}</span>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2 className="h4">💾 Sao lưu, khôi phục và xóa tiến độ</h2>
        <p className="muted small">Xuất tiến độ ra file để dùng trên máy khác, nhập lại từ file backup, hoặc xóa toàn bộ tiến độ.</p>
        <Link to="/settings" className="btn btn-ghost">
          ⚙️ Mở Dữ liệu học tập
        </Link>
      </section>
    </div>
  );
}

/** Mastery of a level: by area (alphabet, pronunciation…) and by skill – so the learner sees exactly what is weak. */
function MasteryPanel({ initial }: { initial: CefrLevel }) {
  const { lessons } = useContent();
  const { progress } = useProgress();
  const [level, setLevel] = useState<CefrLevel>(initial);
  const m = levelMastery(level, lessons, progress);
  const stats = progress.skillStats ?? {};
  const weak = (Object.entries(stats) as [Skill, { correct: number; total: number }][])
    .filter(([, st]) => st.total >= 5)
    .map(([skill, st]) => ({ skill, pct: Math.round((st.correct / st.total) * 100) }))
    .filter((x) => x.pct < MASTERY[x.skill])
    .sort((a, b) => a.pct - b.pct);

  return (
    <section className="card stack-md" aria-labelledby="mastery">
      <div className="card-head">
        <h2 id="mastery" className="h3">
          Mức thành thạo {level}: {m.overall}%
        </h2>
        <div className="chips" role="group" aria-label="Chọn trình độ">
          {(['A0', 'A1'] as CefrLevel[]).map((l) => (
            <button key={l} className={`chip-btn${level === l ? ' active' : ''}`} aria-pressed={level === l} onClick={() => setLevel(l)}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <p className="muted small">
        {m.mastered}/{m.total} bài đã thành thạo.
      </p>
      <div className="grid grid-2">
        <div className="stack-sm">
          <p className="eyebrow">Theo chủ đề</p>
          {m.areas.map((a) => (
            <div key={a.area} className="bar-row">
              <span className="bar-label">{a.label}</span>
              <div className="grow">
                <ProgressBar value={a.pct} label={`${a.label}: ${a.pct}%`} tone={a.pct >= 80 ? 'good' : 'brand'} />
              </div>
              <span className="bar-value">{a.pct}%</span>
            </div>
          ))}
        </div>
        <div className="stack-sm">
          <p className="eyebrow">Theo kỹ năng (điểm tốt nhất trong các bài)</p>
          {m.skills.length === 0 && <p className="muted small">Làm phần kiểm tra cuối bài để thấy điểm từng kỹ năng.</p>}
          {m.skills.map((s) => (
            <div key={s.skill} className="bar-row">
              <span className="bar-label">{s.label}</span>
              <div className="grow">
                <ProgressBar value={s.pct} label={`${s.label}: ${s.pct}%`} tone={s.pct >= MASTERY[s.skill] ? 'good' : 'brand'} />
              </div>
              <span className="bar-value">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      {weak.length > 0 && (
        <div className="tip" role="status">
          <strong>Bạn đang yếu nhất ở:</strong>{' '}
          {weak.map((w, i) => (
            <span key={w.skill}>
              {i > 0 && ', '}
              <Link to={SKILL_PRACTICE[w.skill]}>
                {SKILL_LABELS[w.skill].toLowerCase()} ({w.pct}%)
              </Link>
            </span>
          ))}
          . Bấm vào để luyện riêng phần đó.
        </div>
      )}
    </section>
  );
}
