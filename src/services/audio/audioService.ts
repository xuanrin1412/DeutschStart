import type { AudioRef } from '@/types/models';

/**
 * Audio abstraction.
 * - `SpeechSynthesisProvider` uses the browser's German TTS voice (works offline, zero cost).
 * - `FileAudioProvider` plays recorded / pre-generated files (e.g. from a CDN or a TTS API).
 * Swap or add providers (Google TTS, ElevenLabs, Azure…) without touching UI components.
 */
export interface PlayOptions {
  slow?: boolean;
}

export interface AudioProvider {
  readonly name: string;
  isSupported(): boolean;
  play(ref: AudioRef, opts?: PlayOptions): Promise<void>;
  stop(): void;
}

export class SpeechSynthesisProvider implements AudioProvider {
  readonly name = 'speech-synthesis';
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (this.isSupported()) {
      this.pickVoice();
      window.speechSynthesis.addEventListener?.('voiceschanged', () => this.pickVoice());
    }
  }

  isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  private pickVoice() {
    const voices = window.speechSynthesis.getVoices();
    const german = voices.filter((v) => v.lang.toLowerCase().startsWith('de'));
    // Prefer higher-quality voices when available.
    this.voice =
      german.find((v) => /google|natural|premium|enhanced/i.test(v.name)) ?? german.find((v) => v.lang === 'de-DE') ?? german[0] ?? null;
  }

  hasGermanVoice() {
    return !!this.voice;
  }

  play(ref: AudioRef, opts: PlayOptions = {}) {
    return new Promise<void>((resolve, reject) => {
      if (!this.isSupported()) return reject(new Error('Speech synthesis not supported'));
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(ref.text);
      u.lang = ref.lang ?? 'de-DE';
      if (this.voice) u.voice = this.voice;
      u.rate = opts.slow ? 0.55 : 0.9;
      u.onend = () => resolve();
      u.onerror = (e) => (e.error === 'interrupted' || e.error === 'canceled' ? resolve() : reject(new Error(e.error)));
      synth.speak(u);
    });
  }

  stop() {
    if (this.isSupported()) window.speechSynthesis.cancel();
  }
}

export class FileAudioProvider implements AudioProvider {
  readonly name = 'file';
  private current: HTMLAudioElement | null = null;

  isSupported() {
    return typeof Audio !== 'undefined';
  }

  play(ref: AudioRef, opts: PlayOptions = {}) {
    return new Promise<void>((resolve, reject) => {
      if (!ref.url) return reject(new Error('No audio url'));
      this.stop();
      const el = new Audio(ref.url);
      el.playbackRate = opts.slow ? 0.7 : 1;
      el.onended = () => resolve();
      el.onerror = () => reject(new Error('Audio file failed to load'));
      this.current = el;
      el.play().catch(reject);
    });
  }

  stop() {
    this.current?.pause();
    this.current = null;
  }
}

class AudioService {
  private listeners = new Set<(playingKey: string | null) => void>();
  private playingKey: string | null = null;

  constructor(
    private tts: SpeechSynthesisProvider,
    private file: FileAudioProvider,
    private baseUrl?: string,
  ) {}

  get supported() {
    return this.tts.isSupported() || this.file.isSupported();
  }

  hasGermanVoice() {
    return this.tts.hasGermanVoice();
  }

  subscribe(fn: (playingKey: string | null) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private setPlaying(key: string | null) {
    this.playingKey = key;
    this.listeners.forEach((l) => l(key));
  }

  /** Play a word/sentence. Recorded file first (if any), TTS as fallback. */
  async play(input: AudioRef | string, opts: PlayOptions = {}) {
    const ref: AudioRef = typeof input === 'string' ? { text: input } : input;
    const url = ref.url ?? (this.baseUrl ? `${this.baseUrl}/${encodeURIComponent(ref.text)}.mp3` : undefined);
    const key = `${ref.text}|${opts.slow ? 'slow' : 'normal'}`;
    this.stop();
    this.setPlaying(key);
    try {
      if (url) {
        try {
          await this.file.play({ ...ref, url }, opts);
          return;
        } catch {
          /* fall back to TTS */
        }
      }
      await this.tts.play(ref, opts);
    } finally {
      if (this.playingKey === key) this.setPlaying(null);
    }
  }

  /** Play several lines one after another (used for conversations). */
  async playSequence(texts: string[], opts: PlayOptions = {}, onLine?: (i: number) => void) {
    this.cancelled = false;
    for (let i = 0; i < texts.length; i++) {
      onLine?.(i);
      await this.play(texts[i], opts);
      await new Promise((r) => setTimeout(r, 350));
      if (this.cancelled) break;
    }
    this.cancelled = false;
  }

  private cancelled = false;

  stop() {
    this.tts.stop();
    this.file.stop();
    if (this.playingKey) this.setPlaying(null);
  }

  stopSequence() {
    this.cancelled = true;
    this.stop();
  }
}

const baseUrl = (import.meta.env.VITE_AUDIO_BASE_URL as string | undefined) || undefined;
export const audioService = new AudioService(new SpeechSynthesisProvider(), new FileAudioProvider(), baseUrl);
export const audioKey = (text: string, slow = false) => `${text}|${slow ? 'slow' : 'normal'}`;
