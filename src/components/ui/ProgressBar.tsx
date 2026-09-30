interface Props {
  value: number; // 0–100
  label: string; // accessible name
  size?: 'sm' | 'md' | 'lg';
  tone?: 'brand' | 'good' | 'der' | 'die' | 'das' | 'gold';
  showValue?: boolean;
}

export function ProgressBar({ value, label, size = 'md', tone = 'brand', showValue = false }: Props) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="progress-row">
      <div className={`progress progress-${size}`} role="progressbar" aria-label={label} aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
        <div className={`progress-fill tone-${tone}`} style={{ width: `${v}%` }} />
      </div>
      {showValue && <span className="progress-value">{v}%</span>}
    </div>
  );
}
