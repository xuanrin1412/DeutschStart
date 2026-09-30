import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { SrsState } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { achievements } from '@/data/achievements';
import { a1Progress, accuracy, completedLessons, currentLevel, formatMinutes, learnedWordIds, masteredCount } from '@/services/selectors';
import { ARTICLES, SRS_LABELS } from '@/constants';

export default function ProgressPage() {
  const content = useContent();
  const { progress, resetProgress } = useProgress();
  const { user } = useAuth();
  const [confirmReset, setConfirmReset] = useState(false);

  const level = currentLevel(progress, content);
  const pct = a1Progress(progress, content);
  const learned = learnedWordIds(progress).length;
  const grammarAvail = content.grammar.filter((g) => g.available);
  const grammarDone = grammarAvail.filter((g) => progress.grammarLessons[g.id]?.completed).length;
  const lessonsDone = completedLessons(progress).length;
  const listening = accuracy(progress.listening);
  const quiz = accuracy(progress.quiz);
  const grammarAcc = accuracy(progress.grammar);
  const srsCounts = Object.values(progress.vocabulary).reduce<Record<SrsState, number>>((a, v) => ({ ...a, [v.state]: a[v.state] + 1 }), { new: 0, learning: 0, review: 0, mastered: 0 });
  srsCounts.new = content.vocabulary.length - learned;

  const tiles = [
    { label: 'Từ vựng đã học', value: `${learned}`, sub: `/ ${content.vocabulary.length} từ`, to: '/vocabulary' },
    { label: 'Từ thành thạo', value: `${masteredCount(progress)}`, sub: 'ôn sau 30 ngày', to: '/review' },
    { label: 'Bài ngữ pháp', value: `${grammarDone}`, sub: `/ ${grammarAvail.length} bài`, to: '/grammar' },
    { label: 'Bài Level 0', value: `${lessonsDone}`, sub: `/ ${content.lessons.length} bài`, to: '/learn' },
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
          <p className="muted small">Tính từ: từ vựng (40%), bài học Level 0 + Level 1 (30%) và ngữ pháp A1 (30%).</p>
        </div>
      </section>

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

      <section className="card danger-zone">
        <h2 className="h4">Đặt lại tiến độ</h2>
        <p className="muted small">Xóa toàn bộ tiến độ học của tài khoản hiện tại. Không thể hoàn tác.</p>
        {confirmReset ? (
          <div className="row gap-sm wrap">
            <button
              className="btn btn-danger"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
            >
              Có, xóa tiến độ
            </button>
            <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>
              Hủy
            </button>
          </div>
        ) : (
          <button className="btn btn-ghost" onClick={() => setConfirmReset(true)}>
            Đặt lại tiến độ…
          </button>
        )}
      </section>
    </div>
  );
}
