import { Link } from 'react-router-dom';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { a1Progress, currentLevel, dueCount, learnedWordIds, lessonPercent, nextLesson } from '@/services/selectors';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DailyChallenge } from '@/components/common/DailyChallenge';
import { AudioButton } from '@/components/ui/AudioButton';
import { WordImage } from '@/components/ui/WordImage';
import { FlagDE, GermanWord, Ipa } from '@/components/ui/GermanWord';
import { fullWord } from '@/services/quiz';

export default function HomePage() {
  useDocumentTitle('');
  const content = useContent();
  const { progress } = useProgress();
  const { user } = useAuth();
  const lesson = nextLesson(progress, content.lessons);
  const pct = a1Progress(progress, content);
  const due = dueCount(progress);
  const level = currentLevel(progress, content);
  const started = Object.keys(progress.lessons).length > 0 || learnedWordIds(progress).length > 0;

  // Word of the day – stable for the whole day.
  const dayIndex = Math.floor(Date.now() / 86_400_000) % content.vocabulary.length;
  const wotd = content.vocabulary[dayIndex];

  return (
    <div className="stack-lg">
      <section className="hero">
        <div className="hero-text">
          {user && <p className="eyebrow">Chào {user.name} 👋</p>}
          <h1 className="hero-title">
            <FlagDE /> Học tiếng Đức từ số 0
          </h1>
          <p className="lead">Học từ bảng chữ cái, phát âm và những từ đầu tiên đến giao tiếp tiếng Đức cơ bản.</p>
          <div className="row gap-sm wrap">
            <Link className="btn btn-primary btn-lg" to={lesson ? `/learn/${lesson.id}` : '/review'}>
              {started ? 'Tiếp tục học' : 'Bắt đầu học'} →
            </Link>
            <Link className="btn btn-ghost btn-lg" to="/learn/alphabet">
              Bắt đầu từ đầu
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-bubble b1">Hallo!</div>
          <div className="hero-bubble b2">Guten Tag</div>
          <div className="hero-bubble b3">Danke 🙏</div>
          <div className="hero-emoji">🥨</div>
        </div>
      </section>

      <div className="grid grid-3">
        <section className="card" aria-labelledby="lvl">
          <div className="card-head">
            <h2 id="lvl" className="h3">
              Tiến độ A1
            </h2>
            <span className="badge">Trình độ: {level}</span>
          </div>
          <p className="stat-big">{pct}%</p>
          <ProgressBar value={pct} label="Tiến độ A1" size="lg" />
          <p className="muted small">Từ vựng, bài Level 0 và ngữ pháp cơ bản.</p>
          <Link to="/progress" className="link">
            Xem chi tiết →
          </Link>
        </section>

        <section className="card streak-card" aria-labelledby="streak">
          <h2 id="streak" className="h3">
            Chuỗi học
          </h2>
          <p className="stat-big">
            🔥 {progress.streak.current} <span className="stat-unit">ngày liên tiếp</span>
          </p>
          <p className="muted small">Kỷ lục: {progress.streak.longest} ngày. Hoàn thành thử thách hôm nay để giữ chuỗi.</p>
        </section>

        <section className="card" aria-labelledby="review">
          <h2 id="review" className="h3">
            Ôn tập hôm nay
          </h2>
          <p className="stat-big">
            {due} <span className="stat-unit">từ đến hạn</span>
          </p>
          <p className="muted small">{due ? 'Ôn đúng lúc giúp bạn nhớ lâu gấp nhiều lần.' : 'Chưa có từ nào đến hạn. Hãy học thêm từ mới!'}</p>
          <Link to={due ? '/flashcards?mode=due' : '/vocabulary'} className="btn btn-ghost btn-sm">
            {due ? 'Ôn ngay' : 'Học từ mới'}
          </Link>
        </section>
      </div>

      <div className="grid grid-2">
        {lesson ? (
          <section className="card continue" aria-labelledby="cont">
            <p className="eyebrow">Tiếp tục học</p>
            <div className="row gap-md center-y">
              <span className="lesson-icon" aria-hidden="true">
                {lesson.icon}
              </span>
              <div className="grow">
                <h2 id="cont" className="h3">
                  Bài {lesson.order}: {lesson.title}
                </h2>
                <p className="muted small">
                  {lesson.titleDe} · ⏱ {lesson.minutes} phút
                </p>
              </div>
            </div>
            <p>{lesson.description}</p>
            <ProgressBar value={lessonPercent(progress, lesson)} label={`Tiến độ bài ${lesson.title}`} showValue />
            <Link to={`/learn/${lesson.id}`} className="btn btn-primary">
              {lessonPercent(progress, lesson) > 0 ? 'Học tiếp' : 'Bắt đầu bài'}
            </Link>
          </section>
        ) : (
          <section className="card continue">
            <p className="eyebrow">Level 0</p>
            <h2 className="h3">🎉 Bạn đã hoàn thành Level 0!</h2>
            <p>Tiếp tục với ngữ pháp A1 và mở rộng từ vựng.</p>
            <Link to="/grammar" className="btn btn-primary">
              Học ngữ pháp
            </Link>
          </section>
        )}
        <DailyChallenge />
      </div>

      {wotd && (
        <section className="card wotd" aria-labelledby="wotd">
          <p className="eyebrow" id="wotd">
            Từ của ngày
          </p>
          <div className="row gap-md center-y wrap">
            <WordImage image={wotd.image} size="lg" />
            <div className="grow">
              <p className="h2">
                <GermanWord word={wotd} />
              </p>
              <p>
                <Ipa>{wotd.ipa}</Ipa> · {wotd.meaning}
              </p>
              <p className="muted small" lang="de">
                {wotd.example}
              </p>
            </div>
            <AudioButton text={fullWord(wotd)} size="lg" />
            <Link to={`/vocabulary/word/${wotd.id}`} className="btn btn-ghost">
              Xem từ
            </Link>
          </div>
        </section>
      )}

      <section aria-labelledby="quick">
        <h2 id="quick" className="h3">
          Luyện tập nhanh
        </h2>
        <div className="grid grid-4">
          {[
            { to: '/alphabet', icon: '🔤', title: 'Bảng chữ cái', text: 'A–Z và Ä Ö Ü ß' },
            { to: '/flashcards', icon: '🃏', title: 'Flashcards', text: 'Lật thẻ ghi nhớ' },
            { to: '/articles', icon: '🎯', title: 'der · die · das', text: 'Luyện mạo từ' },
            { to: '/conversations', icon: '💬', title: 'Hội thoại', text: 'Tình huống thực tế' },
            { to: '/reading', icon: '📰', title: 'Đọc hiểu', text: 'Email, biển báo, quảng cáo' },
            { to: '/listening', icon: '🎧', title: 'Luyện nghe', text: 'Nghe từ, câu, điền từ' },
            { to: '/quiz', icon: '✅', title: 'Quiz', text: 'Kiểm tra tổng hợp' },
            { to: '/mistakes', icon: '📕', title: 'Sổ lỗi sai', text: 'Ôn lại câu hay sai' },
          ].map((q) => (
            <Link key={q.to} to={q.to} className="card card-hover quick">
              <span className="quick-icon" aria-hidden="true">
                {q.icon}
              </span>
              <strong>{q.title}</strong>
              <span className="muted small">{q.text}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
