import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Vocabulary } from '@/types/models';
import { useProgress } from '@/context/ProgressContext';
import { useContent } from '@/context/ContentContext';
import { useToast } from '@/context/ToastContext';
import { fullWord } from '@/services/quiz';
import { SRS_LABELS, WORD_TYPE_LABELS } from '@/constants';
import { AudioButton } from '@/components/ui/AudioButton';
import { AutoSpeakSwitch } from '@/components/ui/AutoSpeakSwitch';
import { useSpeakOnShow } from '@/hooks/useAutoSpeak';
import { WordImage } from '@/components/ui/WordImage';
import { GermanWord, Ipa } from '@/components/ui/GermanWord';

/** Full vocabulary card with progressive disclosure and learning actions. */
export function VocabCard({ word }: { word: Vocabulary }) {
  const { getWord, toggleSaved, learnWord, markKnown } = useProgress();
  const { topicById } = useContent();
  const toast = useToast();
  const [details, setDetails] = useState(false);
  const uv = getWord(word.id);
  const topic = topicById.get(word.topicId);
  const text = fullWord(word);
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

      <div className="example">
        <div className="row gap-sm center-y">
          <p lang="de" className="example-de">
            {word.example}
          </p>
          <AudioButton text={word.example} size="sm" />
        </div>
        <p className="example-vi">{word.exampleVi}</p>
      </div>

      <button className="disclosure" aria-expanded={details} onClick={() => setDetails((d) => !d)}>
        {details ? '▾' : '▸'} Thông tin ngữ pháp
      </button>
      {details && (
        <dl className="facts">
          <div>
            <dt>Loại từ</dt>
            <dd>{WORD_TYPE_LABELS[word.type]}</dd>
          </div>
          {word.article && (
            <div>
              <dt>Mạo từ</dt>
              <dd className={`article-${word.article}`}>{word.article}</dd>
            </div>
          )}
          <div>
            <dt>Số nhiều</dt>
            <dd lang="de">{word.plural ?? (word.type === 'noun' ? 'thường không dùng' : '—')}</dd>
          </div>
          <div>
            <dt>Trình độ</dt>
            <dd>{word.level}</dd>
          </div>
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
          {word.articleHint && (
            <div className="facts-wide">
              <dt>Mẹo nhớ mạo từ</dt>
              <dd>{word.articleHint}</dd>
            </div>
          )}
        </dl>
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
