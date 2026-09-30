import { audioService } from '@/services/audio/audioService';
import { useIsPlaying } from '@/hooks/useAudio';

interface Props {
  text: string;
  url?: string;
  slow?: boolean;
  label?: string; // visible label
  size?: 'sm' | 'md' | 'lg';
  variant?: 'round' | 'pill';
  onPlay?: () => void;
}

export function AudioButton({ text, url, slow = false, label, size = 'md', variant = 'round', onPlay }: Props) {
  const playing = useIsPlaying(text, slow);
  const icon = slow ? '🐢' : '🔊';
  return (
    <button
      type="button"
      className={`audio-btn audio-${variant} audio-${size}${playing ? ' is-playing' : ''}`}
      aria-label={`${slow ? 'Nghe chậm' : 'Nghe'}: ${text}`}
      aria-pressed={playing}
      onClick={(e) => {
        e.stopPropagation();
        if (playing) return audioService.stop();
        onPlay?.();
        void audioService.play({ text, url }, { slow }).catch(() => {});
      }}
    >
      <span aria-hidden="true">{playing ? '⏹' : icon}</span>
      {label && <span>{label}</span>}
    </button>
  );
}
