import type { LessonExample, Term } from '@/types/models';
import { useContent } from '@/context/ContentContext';
import { ARTICLE_LABELS, WORD_TYPE_LABELS } from '@/constants';
import { fullWord } from '@/services/quiz';
import { AudioButton } from '@/components/ui/AudioButton';
import { WordImage } from '@/components/ui/WordImage';
import { GermanWord, Ipa } from '@/components/ui/GermanWord';
import { GermanText } from '@/components/text/GermanText';
import { WordAnatomy, whyArticle } from './WordAnatomy';

/** A lesson example sentence: German (every word clickable), audio, translation and note. */
export function ExampleLine({ example, lessonNew }: { example: LessonExample; lessonNew?: Set<string> }) {
  return (
    <div className="example">
      <div className="row gap-sm center-y wrap">
        <GermanText as="p" className="example-de" text={example.de} lessonNew={lessonNew} gloss={example.gloss} />
        <AudioButton text={example.de} size="sm" />
        <AudioButton text={example.de} size="sm" slow />
      </div>
      <p className="example-vi">{example.vi}</p>
      {example.note && <p className="muted small">💬 {example.note}</p>}
    </div>
  );
}

/**
 * Teaching card for one new word: what it is, what each part means, why this article,
 * how to say it, its plural, and a sentence that only uses words already taught.
 */
export function TeachWord({ id, example, lessonNew }: { id: string; example?: LessonExample; lessonNew?: Set<string> }) {
  const { lexicon, wordById } = useContent();
  const lex = lexicon.byId.get(id);
  const w = lex?.vocabId ? wordById.get(lex.vocabId) : undefined;
  if (!lex) return null;

  if (!w) {
    // Grammar word (ich, die, ein…) or a number.
    return (
      <article className="teach-card">
        <div className="teach-head">
          <p className="teach-word" lang="de">
            {lex.lemma}
          </p>
          <AudioButton text={lex.lemma.replace(/\s*\(.*\)$/, '').split(' / ')[0]} />
        </div>
        <p className="teach-meaning">{lex.meaning}</p>
        {lex.explanation && <p className="teach-explain">💡 {lex.explanation}</p>}
        {example && <ExampleLine example={example} lessonNew={lessonNew} />}
      </article>
    );
  }

  const text = fullWord(w);
  return (
    <article className="teach-card">
      <div className="teach-head">
        <WordImage image={w.image} size="xl" />
        <div className="stack-sm grow">
          <p className="teach-word">
            <GermanWord word={w} />
          </p>
          <div className="row gap-sm center-y wrap">
            <Ipa>{w.ipa}</Ipa>
            <AudioButton text={text} url={w.audio?.url} />
            <AudioButton text={text} url={w.audio?.url} slow />
          </div>
          <p className="teach-meaning">{w.meaning}</p>
        </div>
      </div>

      {w.article && <WordAnatomy word={w} />}

      <dl className="facts">
        <div>
          <dt>Loại từ</dt>
          <dd>{WORD_TYPE_LABELS[w.type]}</dd>
        </div>
        {w.article && (
          <div>
            <dt>Giống</dt>
            <dd className={`article-${w.article}`}>{ARTICLE_LABELS[w.article]}</dd>
          </div>
        )}
        {w.type === 'noun' && (
          <div>
            <dt>Số nhiều</dt>
            <dd lang="de">{w.plural ?? 'thường không dùng'}</dd>
          </div>
        )}
      </dl>

      {w.article && <p className="teach-explain">❓ <strong>Vì sao là "{w.article}"?</strong> {whyArticle(w)}</p>}
      {example && <ExampleLine example={example} lessonNew={lessonNew} />}
    </article>
  );
}

/** "Danh từ là gì?" – a grammar term explained from zero before it is used. */
export function TermCard({ term }: { term: Term }) {
  return (
    <aside className="term-card">
      <p className="term-q">
        📘 {term.question} <span className="muted small" lang="de">({term.de})</span>
      </p>
      <p>{term.explanation}</p>
      {term.examples && (
        <ul className="term-examples">
          {term.examples.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}
