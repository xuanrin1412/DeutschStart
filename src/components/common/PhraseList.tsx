import type { Phrase } from '@/types/models';
import { AudioButton } from '@/components/ui/AudioButton';
import { Ipa } from '@/components/ui/GermanWord';

export function PhraseList({ items }: { items: Phrase[] }) {
  return (
    <ul className="phrase-list">
      {items.map((p) => (
        <li key={p.de} className="phrase">
          {p.emoji && (
            <span className="phrase-emoji" aria-hidden="true">
              {p.emoji}
            </span>
          )}
          <div className="grow">
            <p className="phrase-de" lang="de">
              {p.de}
            </p>
            {p.ipa && <Ipa>{p.ipa}</Ipa>}
            <p className="phrase-vi">{p.vi}</p>
            {p.note && <p className="muted small">💬 {p.note}</p>}
          </div>
          <div className="row gap-xs">
            <AudioButton text={p.de.replace(' – ', ', ')} size="sm" />
            <AudioButton text={p.de.replace(' – ', ', ')} size="sm" slow />
          </div>
        </li>
      ))}
    </ul>
  );
}
