import { useState } from 'react';
import { similarity, speechRecognizer } from '@/services/speech/speechRecognition';
import { Spinner } from '@/components/ui/States';

type Status = 'idle' | 'listening' | 'done' | 'error';

/** "Nói thử" – records the learner and compares with the target (Web Speech API). */
export function SpeechPractice({ target, onResult }: { target: string; onResult?: (matched: boolean) => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [heard, setHeard] = useState('');
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');

  if (!speechRecognizer.isSupported()) {
    return <p className="muted small">🎙️ Luyện nói bằng micro cần trình duyệt Chrome hoặc Edge. Bạn vẫn có thể nghe và nhắc lại theo.</p>;
  }

  const start = async () => {
    setStatus('listening');
    setError('');
    try {
      const r = await speechRecognizer.listen('de-DE');
      const s = similarity(target, r.transcript);
      setHeard(r.transcript);
      setScore(s);
      setStatus('done');
      onResult?.(s >= 0.75);
    } catch (e) {
      const code = e instanceof Error ? e.message : '';
      setError(code === 'not-allowed' ? 'Bạn cần cho phép truy cập micro.' : code === 'no-speech' || code === 'aborted' ? 'Không nghe thấy gì – hãy thử nói to hơn.' : 'Không nhận dạng được. Hãy thử lại.');
      setStatus('error');
    }
  };

  return (
    <div className="speech">
      <button className="btn btn-ghost btn-sm" onClick={start} disabled={status === 'listening'} aria-live="polite">
        {status === 'listening' ? (
          <>
            <Spinner label="Đang nghe" /> Đang nghe…
          </>
        ) : (
          <>🎙️ Nói thử „{target}“</>
        )}
      </button>
      {status === 'done' && (
        <p className={`small ${score >= 0.75 ? 'text-good' : 'text-warn'}`} role="status">
          {score >= 0.9 ? '🌟 Tuyệt vời!' : score >= 0.75 ? '👍 Tốt lắm!' : score >= 0.5 ? '🙂 Gần đúng rồi, thử lại nhé.' : '🔁 Chưa đúng, hãy nghe mẫu và thử lại.'} Máy nghe được: „{heard}“
        </p>
      )}
      {status === 'error' && <p className="small text-warn" role="alert">{error}</p>}
    </div>
  );
}
