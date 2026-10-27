import { useSyncExternalStore } from 'react';
import { storage } from '@/services/storage';

/**
 * An on/off preference saved in localStorage. Returns a hook; every component using it
 * shares one value, so a switch on one page updates all the others at once.
 */
export function boolSetting(key: string, initial: boolean) {
  const listeners = new Set<() => void>();
  let value = storage.get<boolean>(key, initial);

  const set = (on: boolean) => {
    value = on;
    storage.set(key, on);
    listeners.forEach((l) => l());
  };
  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  };

  return () => [useSyncExternalStore(subscribe, () => value), set] as const;
}

/** "Tự phát âm khi gõ": the typing drill speaks the word or sentence after each correct copy. */
export const useSpeakOnType = boolSetting('settings.speakOnType', true);

/** "Gõ lại sau khi trả lời": quizzes show the typing drill under the feedback of every answer. */
export const useDrillInQuiz = boolSetting('settings.drillInQuiz', true);
