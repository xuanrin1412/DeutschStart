import { useEffect, useState } from 'react';
import { audioKey, audioService } from '@/services/audio/audioService';

/** Returns true while the given text is being played. */
export function useIsPlaying(text: string, slow = false) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => audioService.subscribe((key) => setPlaying(key === audioKey(text, slow))), [text, slow]);
  return playing;
}

export function useAudioPlaying() {
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => audioService.subscribe(setKey), []);
  return key;
}
