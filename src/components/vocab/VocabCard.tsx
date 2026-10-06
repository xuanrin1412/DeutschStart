import { Link } from 'react-router-dom';
import type { Vocabulary } from '@/types/models';
import { useProgress } from '@/context/ProgressContext';
import { useContent } from '@/context/ContentContext';
import { useToast } from '@/context/ToastContext';
import { fullWord } from '@/services/quiz';
import { ARTICLE_LABELS, SRS_LABELS, WORD_TYPE_LABELS } from '@/constants';
import { AudioButton } from '@/components/ui/AudioButton';
import { AutoSpeakSwitch } from '@/components/ui/AutoSpeakSwitch';
import { useSpeakOnShow } from '@/hooks/useAutoSpeak';
import { WordImage } from '@/components/ui/WordImage';
import { GermanWord, Ipa } from '@/components/ui/GermanWord';
import { GermanText } from '@/components/text/GermanText';
import { WordAnatomy, whyArticle } from '@/components/lesson/WordAnatomy';

/**
 * Full vocabulary card: the article belongs to the word (die Katze, never just Katze),
 * each part can be explained, and the example sentence marks words not learned yet.
 */
export function VocabCard({ word }: { word: Vocabulary }) {
  const { getWord, toggleSaved, learnWord, markKnown } = useProgress();
  const { topicById, vocabulary, curriculum, lessonById } = useContent();
  const toast = useToast();
  const uv = getWord(word.id);
  const topic = topicById.get(word.topicId);
  const text = fullWord(word);
  const lesson = lessonById.get(curriculum.taughtIn.get(word.id) ?? '');
  const related = vocabulary.filter((w) => w.topicId === word.topicId && w.id !== word.id && w.type === word.type).slice(0, 6);
  useSpeakOnShow({ text, url: word.audio?.url }, word.id);

  return (
    <article className="vocab-card card">
      <div className="vocab-head">
        <WordImage image={word.image} size="xl" />
        <div className="vocab-main">
          <h2 className="vocab-word">
            <GermanWord word={word} />
          </h2>
          <div className="row gap-sm center-y wrap">
            <Ipa>{word.ipa}</Ipa>
            <AudioButton text={text} url={word.audio?.url} />
            <AudioButton text={text} url={word.audio?.url} slow />
            <AutoSpeakSwitch />
          </div>
          <p className="vocab-meaning">{word.meaning}</p>
          <span className={`state-chip state-${uv.state}`}>{SRS_LABELS[uv.state]}</span>
        </div>
      </div>

      {word.article && <WordAnatomy word={word} />}

      <dl className="facts">
        <div>
          <dt>Loại từ</dt>
          <dd>{WORD_TYPE_LABELS[word.type]}</dd>
        </div>
        {word.article && (
          <>
            <div>
              <dt>Mạo từ</dt>
              <dd className={`article-${word.article}`} lang="de">
                {word.article}
              </dd>
            </div>
            <div>
              <dt>Giống</dt>
              <dd className={`article-${word.article}`}>{ARTICLE_LABELS[word.article]}</dd>
            </div>
          </>
        )}
        {word.type === 'noun' && (
          <div>
            <dt>Số nhiều</dt>
            <dd lang="de">{word.plural ?? 'thường không dùng'}</dd>
          </div>
        )}
        <div>
          <dt>Độ khó</dt>
          <dd aria-label={`${word.difficulty} trên 3`}>{'●'.repeat(word.difficulty) + '○'.repeat(3 - word.difficulty)}</dd>
        </div>
        {topic && (
          <div>
            <dt>Chủ đề</dt>
            <dd>
              <Link to={`/vocabulary/topic/${topic.id}`}>
                {topic.icon} {topic.name}
              </Link>
            </dd>
          </div>
        )}
        {lesson && (
          <div className="facts-wide">
            <dt>Được dạy trong bài</dt>
            <dd>
              <Link to={`/learn/${lesson.id}`}>
                {lesson.level} · Unit {lesson.unit}: {lesson.icon} {lesson.title}
              </Link>
            </dd>
          </div>
        )}
      </dl>

      {word.article && (
        <p className="teach-explain">
          ❓ <strong>Vì sao là "{word.article}"?</strong> {whyArticle(word)}
        </p>
      )}

      <div className="example">
        <div className="row gap-sm center-y wrap">
          <GermanText as="p" className="example-de" text={word.example} lessonNew={new Set([word.id])} />
          <AudioButton text={word.example} size="sm" />
          <AudioButton text={word.example} size="sm" slow />
        </div>
        <p className="example-vi">{word.exampleVi}</p>
        <p className="muted small">
          Bấm vào từng từ để xem nghĩa. Từ <span className="gt-word gt-unknown">tô cam</span> là từ bạn chưa học.
        </p>
      </div>

      {related.length > 0 && (
        <div>
          <p className="eyebrow">Từ liên quan</p>
          <p className="related-words">
            {related.map((w) => (
              <Link key={w.id} to={`/vocabulary/word/${w.id}`} className="chip-btn">
                <GermanWord word={w} />
              </Link>
            ))}
          </p>
        </div>
      )}

      <div className="vocab-actions">
        <AudioButton text={text} label="Nghe" variant="pill" />
        <button className={`btn btn-ghost${uv.saved ? ' is-active' : ''}`} aria-pressed={uv.saved} onClick={() => toggleSaved(word.id)}>
          {uv.saved ? '⭐ Đã lưu' : '☆ Lưu từ'}
        </button>
        <button
          className="btn btn-ghost"
          disabled={uv.state !== 'new'}
          onClick={() => {
            learnWord(word.id);
            toast('🧠', `Đã thêm "${text}" vào ôn tập hôm nay`);
          }}
        >
          🧠 {uv.state === 'new' ? 'Học từ này' : 'Đang học'}
        </button>
        <button
          className="btn btn-ghost"
          disabled={uv.state === 'mastered'}
          onClick={() => {
            markKnown(word.id);
            toast('✓', `"${text}" – đánh dấu đã biết, ôn lại sau 30 ngày`);
          }}
        >
          ✓ Tôi đã biết
        </button>
      </div>
    </article>
  );
}

/** Small tile for grids and lists. */
export function WordTile({ word }: { word: Vocabulary }) {
  const { getWord } = useProgress();
  const uv = getWord(word.id);
  return (
    <div className="word-tile card card-hover">
      <Link to={`/vocabulary/word/${word.id}`} className="stretched" aria-label={`${fullWord(word)} – ${word.meaning}`} />
      <WordImage image={word.image} size="md" />
      <div className="word-tile-text">
        <GermanWord word={word} className="word-tile-de" />
        <span className="muted small">{word.meaning}</span>
      </div>
      <div className="word-tile-side">
        <AudioButton text={fullWord(word)} size="sm" />
        <span className={`dot state-${uv.state}`} title={SRS_LABELS[uv.state]} aria-label={SRS_LABELS[uv.state]} />
      </div>
    </div>
  );
}
