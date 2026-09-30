import { useEffect, useSyncExternalStore } from 'react';
import type { AudioRef } from '@/types/models';
import { storage } from '@/services/storage';
import { audioService } from '@/services/audio/audioService';

/**
 * "Tự động phát âm" setting: when on, a word is spoken as soon as it is shown.
 * One shared value (saved in localStorage) so every switch and page stays in sync.
 */
const KEY = 'settings.autoSpeak';
const listeners = new Set<() => void>();
let enabled = storage.get<boolean>(KEY, false);

function setAutoSpeak(on: boolean) {
  enabled = on;
  storage.set(KEY, on);
  listeners.forEach((l) => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export function useAutoSpeak() {
  const on = useSyncExternalStore(subscribe, () => enabled);
  return [on, setAutoSpeak] as const;
}

/**
 * Speaks `audio` whenever `showKey` changes (a new word is shown) while auto-speak is on.
 * Turning the switch on also speaks the current word, so the learner hears that it works.
 */
export function useSpeakOnShow(audio: AudioRef | string, showKey: string) {
  const [on] = useAutoSpeak();
  useEffect(() => {
    if (!on) return;
    // Short delay: lets the card render first and avoids overlapping a previous word.
    const id = setTimeout(() => void audioService.play(audio).catch(() => {}), 250);
    return () => clearTimeout(id);
  }, [showKey, on]); // eslint-disable-line react-hooks/exhaustive-deps
}
