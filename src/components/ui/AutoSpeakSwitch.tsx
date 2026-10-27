import { useAutoSpeak } from '@/hooks/useAutoSpeak';
import { useDrillInQuiz, useSpeakOnType } from '@/hooks/useSetting';

/** Switch for the shared "speak the word when it appears" setting. */
export function AutoSpeakSwitch() {
  const [on, setOn] = useAutoSpeak();
  return (
    <label className="switch" title="Tự động đọc từ khi từ xuất hiện">
      <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} /> 🔊 Tự động phát âm
    </label>
  );
}

/** Switch for "speak after each correct copy" in the typing drill. */
export function SpeakOnTypeSwitch({ className = '' }: { className?: string }) {
  const [on, setOn] = useSpeakOnType();
  return (
    <label className={`switch ${className}`} title="Đọc to từ / câu mỗi lần bạn gõ đúng">
      <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} /> 🔊 Tự phát âm khi gõ
    </label>
  );
}

/** Switch for showing the typing drill after every quiz answer. */
export function DrillInQuizSwitch() {
  const [on, setOn] = useDrillInQuiz();
  return (
    <label className="switch">
      <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} /> ⌨️ Gõ lại đáp án sau mỗi câu hỏi
    </label>
  );
}
