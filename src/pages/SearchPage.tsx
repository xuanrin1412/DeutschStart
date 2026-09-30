import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useContent } from '@/context/ContentContext';
import { useProgress } from '@/context/ProgressContext';
import { useToast } from '@/context/ToastContext';
import { PageHeader } from '@/components/common/PageHeader';
import { AudioButton } from '@/components/ui/AudioButton';
import { WordImage } from '@/components/ui/WordImage';
import { GermanWord, Ipa } from '@/components/ui/GermanWord';
import { EmptyState } from '@/components/ui/States';
import { search } from '@/services/search';
import { fullWord } from '@/services/quiz';
import { WORD_TYPE_LABELS } from '@/constants';

export default function SearchPage() {
  const content = useContent();
  const { getWord, learnWord } = useProgress();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const results = useMemo(() => search(content, q), [content, q]);
  const total = results.words.length + results.phrases.length + results.grammar.length + results.conversations.length + results.lessons.length;

  return (
    <div className="stack-lg narrow">
      <PageHeader icon="🔍" title="Tìm kiếm" subtitle="Tìm bằng tiếng Đức hoặc tiếng Việt – có dấu hay không dấu đều được." />
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="search-page-input" className="sr-only">
          Từ khóa
        </label>
        <input
          id="search-page-input"
          className="input input-lg"
          type="search"
          placeholder="Ví dụ: Apfel, quả táo, bahnhof, xin chào…"
          value={q}
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
          autoFocus
        />
      </form>

      {!q && (
        <div className="chips">
          {['Apfel', 'quả táo', 'Zug', 'cảm ơn', 'Wohnung', 'sein'].map((s) => (
            <button key={s} className="chip-btn" onClick={() => setParams({ q: s })}>
              {s}
            </button>
          ))}
        </div>
      )}

      {q && total === 0 && (
        <EmptyState icon="🤔" title={`Không tìm thấy „${q}“`}>
          Hãy thử từ khác, hoặc tìm bằng tiếng Việt không dấu.
        </EmptyState>
      )}

      {results.words.map((w, i) => {
        const uv = getWord(w.id);
        const related = content.vocabulary.filter((x) => x.topicId === w.topicId && x.id !== w.id).slice(0, 4);
        return (
          <article key={w.id} className={`card search-word${i === 0 ? ' is-top' : ''}`}>
            <div className="row gap-md center-y wrap">
              <WordImage image={w.image} size="lg" />
              <div className="grow">
                <h2 className="h3">
                  <Link to={`/vocabulary/word/${w.id}`}>
                    <GermanWord word={w} />
                  </Link>
                </h2>
                <p>
                  <Ipa>{w.ipa}</Ipa> · <strong>{w.meaning}</strong>
                </p>
                <p className="muted small">
                  {WORD_TYPE_LABELS[w.type]}
                  {w.article && ` · Mạo từ: ${w.article}`}
                  {w.plural && ` · Số nhiều: ${w.plural}`}
                </p>
              </div>
              <AudioButton text={fullWord(w)} />
            </div>
            <div className="example">
              <div className="row gap-sm center-y">
                <p lang="de" className="example-de">
                  {w.example}
                </p>
                <AudioButton text={w.example} size="sm" />
              </div>
              <p className="example-vi">{w.exampleVi}</p>
            </div>
            {i === 0 && related.length > 0 && (
              <p className="small">
                <span className="muted">Từ liên quan: </span>
                {related.map((r, k) => (
                  <span key={r.id}>
                    {k > 0 && ' · '}
                    <Link to={`/vocabulary/word/${r.id}`}>{fullWord(r)}</Link>
                  </span>
                ))}
              </p>
            )}
            <div className="row gap-sm">
              <button
                className="btn btn-ghost btn-sm"
                disabled={uv.state !== 'new'}
                onClick={() => {
                  learnWord(w.id);
                  toast('🔁', `Đã thêm "${fullWord(w)}" vào ôn tập`);
                }}
              >
                {uv.state === 'new' ? '➕ Thêm vào ôn tập' : '✓ Đã có trong ôn tập'}
              </button>
              <Link to={`/vocabulary/word/${w.id}`} className="btn btn-ghost btn-sm">
                Chi tiết
              </Link>
            </div>
          </article>
        );
      })}

      {results.phrases.length > 0 && (
        <section className="card">
          <h2 className="h4">Mẫu câu trong bài học</h2>
          <ul className="plain-list">
            {results.phrases.map((p) => (
              <li key={p.lessonId + p.de} className="row gap-sm center-y">
                <AudioButton text={p.de} size="sm" />
                <span className="grow">
                  <strong lang="de">{p.de}</strong> – {p.vi}
                </span>
                <Link to={`/learn/${p.lessonId}`} className="small">
                  {p.lessonTitle}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(results.grammar.length > 0 || results.conversations.length > 0 || results.lessons.length > 0) && (
        <section className="card">
          <h2 className="h4">Bài học liên quan</h2>
          <ul className="plain-list">
            {results.lessons.map((l) => (
              <li key={l.id}>
                <Link to={`/learn/${l.id}`}>
                  {l.icon} {l.title}
                </Link>
              </li>
            ))}
            {results.grammar.map((g) => (
              <li key={g.id}>
                <Link to={g.available ? `/grammar/${g.id}` : '/grammar'}>
                  {g.icon} Ngữ pháp: {g.title}
                </Link>
              </li>
            ))}
            {results.conversations.map((c) => (
              <li key={c.id}>
                <Link to={`/conversations/${c.id}`}>
                  {c.icon} Hội thoại: {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
