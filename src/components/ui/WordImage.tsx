import type { MediaImage } from '@/types/models';

export function WordImage({ image, size = 'md' }: { image: MediaImage; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  if (image.url) return <img className={`word-img word-img-${size}`} src={image.url} alt={image.alt} loading="lazy" />;
  return (
    <span className={`word-img word-img-${size}`} role="img" aria-label={image.alt}>
      {image.emoji ?? '🖼️'}
    </span>
  );
}
