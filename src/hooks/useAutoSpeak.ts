import { useEffect } from 'react';
import type { AudioRef } from '@/types/models';
import { audioService } from '@/services/audio/audioService';
import { boolSetting } from './useSetting';

/**
 * "Tự động phát âm" setting: when on, a word is spoken as soon as it is shown.
 * One shared value (saved in localStorage) so every switch and page stays in sync.
 */
export const useAutoSpeak = boolSetting('settings.autoSpeak', false);

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
