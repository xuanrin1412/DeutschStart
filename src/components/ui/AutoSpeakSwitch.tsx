import { useAutoSpeak } from '@/hooks/useAutoSpeak';

/** Switch for the shared "speak the word when it appears" setting. */
export function AutoSpeakSwitch() {
  const [on, setOn] = useAutoSpeak();
  return (
    <label className="switch" title="Tự động đọc từ khi từ xuất hiện">
      <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} /> 🔊 Tự động phát âm
    </label>
  );
}
