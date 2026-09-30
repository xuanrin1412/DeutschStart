/**
 * Pronunciation check architecture.
 * `BrowserSpeechRecognizer` uses the Web Speech API (Chrome / Edge).
 * A server-side recognizer (Whisper, Azure Pronunciation Assessment…) can implement
 * the same interface later and return a real pronunciation score.
 */
export interface RecognitionResult {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognizer {
  isSupported(): boolean;
  listen(lang?: string, timeoutMs?: number): Promise<RecognitionResult>;
  abort(): void;
}

/* Minimal typings – the Web Speech API is not in lib.dom for all TS versions. */
interface SRAlternative { transcript: string; confidence: number }
interface SREvent { results: ArrayLike<ArrayLike<SRAlternative>> }
interface SRInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}
type SRConstructor = new () => SRInstance;

const getCtor = (): SRConstructor | undefined => {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { SpeechRecognition?: SRConstructor; webkitSpeechRecognition?: SRConstructor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

class BrowserSpeechRecognizer implements SpeechRecognizer {
  private current: SRInstance | null = null;

  isSupported() {
    return !!getCtor();
  }

  listen(lang = 'de-DE', timeoutMs = 7000) {
    return new Promise<RecognitionResult>((resolve, reject) => {
      const Ctor = getCtor();
      if (!Ctor) return reject(new Error('unsupported'));
      const rec = new Ctor();
      this.current = rec;
      rec.lang = lang;
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      let done = false;
      const timer = setTimeout(() => {
        if (!done) rec.abort();
      }, timeoutMs);
      rec.onresult = (e) => {
        done = true;
        clearTimeout(timer);
        const alt = e.results[0][0];
        resolve({ transcript: alt.transcript, confidence: alt.confidence });
      };
      rec.onerror = (e) => {
        done = true;
        clearTimeout(timer);
        reject(new Error(e.error));
      };
      rec.onend = () => {
        clearTimeout(timer);
        if (!done) reject(new Error('no-speech'));
      };
      rec.start();
    });
  }

  abort() {
    this.current?.abort();
  }
}

export const speechRecognizer: SpeechRecognizer = new BrowserSpeechRecognizer();

/** Very simple similarity (0–1) between target and transcript. */
export function similarity(a: string, b: string) {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß ]/g, '').trim();
  const x = norm(a);
  const y = norm(b);
  if (!x || !y) return 0;
  const dp = Array.from({ length: x.length + 1 }, (_, i) => [i, ...Array(y.length).fill(0)]);
  for (let j = 1; j <= y.length; j++) dp[0][j] = j;
  for (let i = 1; i <= x.length; i++)
    for (let j = 1; j <= y.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
  return 1 - dp[x.length][y.length] / Math.max(x.length, y.length);
}
