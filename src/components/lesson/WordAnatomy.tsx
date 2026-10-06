import { useState } from 'react';
import type { Vocabulary } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { ARTICLE_LABELS } from '@/constants';

/** Why does this noun take der/die/das? The learner-friendly explanation shown on word cards. */
export function whyArticle(w: Vocabulary) {
  if (!w.article) return '';
  const base = `"${w.word}" là danh từ ${ARTICLE_LABELS[w.article]}, nên mạo từ xác định ở dạng cơ bản là "${w.article}".`;
  return w.articleHint ? `${base} ${w.articleHint}` : `${base} Không có quy tắc chắc chắn – hãy học thuộc cả cụm "${w.article} ${w.word}".`;
}

/**
 * "die Katze" broken into its parts. Each part is a button that explains itself:
 * die → the article for feminine nouns, Katze → the noun (cat), together → the cat.
 */
export function WordAnatomy({ word }: { word: Vocabulary }) {
  const { lexicon, curriculum, lessonById } = useContent();
  const [open, setOpen] = useState<'article' | 'noun' | null>(null);
  if (!word.article) return null;
  const art = lexicon.byId.get(`g-${word.article}`);
  const artLesson = lessonById.get(curriculum.taughtIn.get(`g-${word.article}`) ?? '');

  return (
    <div className="anatomy">
      <div className="anatomy-parts" role="group" aria-label={`Phân tích ${word.article} ${word.word}`}>
        <button type="button" className={`anatomy-part article-${word.article}`} aria-expanded={open === 'article'} onClick={() => setOpen(open === 'article' ? null : 'article')} lang="de">
          {word.article}
          <small>mạo từ</small>
        </button>
        <span className="anatomy-plus" aria-hidden="true">
          +
        </span>
        <button type="button" className="anatomy-part" aria-expanded={open === 'noun'} onClick={() => setOpen(open === 'noun' ? null : 'noun')} lang="de">
          {word.word}
          <small>danh từ</small>
        </button>
        <span className="anatomy-plus" aria-hidden="true">
          =
        </span>
        <span className="anatomy-sum">
          <span lang="de">
            {word.article} {word.word}
          </span>
          <small>{word.meaning}</small>
        </span>
      </div>
      {open === 'article' && (
        <p className="anatomy-note" role="status">
          <strong lang="de">{word.article}</strong> = {art?.explanation ?? `mạo từ xác định dùng với danh từ ${ARTICLE_LABELS[word.article]}.`}
          {artLesson && <> (Học ở bài: {artLesson.title})</>}
        </p>
      )}
      {open === 'noun' && (
        <p className="anatomy-note" role="status">
          <strong lang="de">{word.word}</strong> = danh từ, nghĩa là "{word.meaning}". Danh từ tiếng Đức luôn viết hoa chữ cái đầu. Giống: {ARTICLE_LABELS[word.article]}.
        </p>
      )}
    </div>
  );
}
