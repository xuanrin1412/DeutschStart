import type { LipShape, TonguePosition } from '@/types/models';

const LIP_TEXT: Record<LipShape, string> = {
  rounded: 'Môi tròn, chu ra',
  spread: 'Môi dẹt, như cười',
  neutral: 'Môi thả lỏng',
  open: 'Mở miệng rộng',
  lips: 'Răng trên chạm môi dưới',
};

const TONGUE_TEXT: Record<TonguePosition, string> = {
  'front-high': 'Lưỡi cao, phía trước',
  'front-mid': 'Lưỡi giữa, phía trước',
  'back-high': 'Cuống lưỡi nâng cao',
  low: 'Lưỡi hạ thấp',
  'tip-teeth': 'Đầu lưỡi sau răng trên',
  uvular: 'Cuống lưỡi gần lưỡi gà',
  lips: 'Lưỡi thả lỏng',
};

const LIPS: Record<LipShape, { rx: number; ry: number }> = {
  rounded: { rx: 13, ry: 12 },
  spread: { rx: 32, ry: 6 },
  neutral: { rx: 22, ry: 8 },
  open: { rx: 22, ry: 17 },
  lips: { rx: 24, ry: 7 },
};

const TONGUE: Record<TonguePosition, { tipY: number; hx: number; hy: number }> = {
  'front-high': { tipY: 52, hx: 38, hy: 14 },
  'front-mid': { tipY: 54, hx: 42, hy: 26 },
  'back-high': { tipY: 58, hx: 88, hy: 12 },
  low: { tipY: 60, hx: 60, hy: 52 },
  'tip-teeth': { tipY: 30, hx: 40, hy: 40 },
  uvular: { tipY: 58, hx: 102, hy: 16 },
  lips: { tipY: 58, hx: 55, hy: 44 },
};

/** Simplified illustration of lip shape (front) and tongue position (side view). */
export function MouthDiagram({ lips, tongue }: { lips: LipShape; tongue: TonguePosition }) {
  const l = LIPS[lips];
  const t = TONGUE[tongue];
  return (
    <figure className="mouth" aria-label={`Khẩu hình: ${LIP_TEXT[lips]}; ${TONGUE_TEXT[tongue]}`}>
      <div className="mouth-part">
        <svg viewBox="0 0 100 60" aria-hidden="true">
          <ellipse cx="50" cy="30" rx={l.rx + 9} ry={l.ry + 8} className="m-lip" />
          <ellipse cx="50" cy="30" rx={l.rx} ry={l.ry} className="m-cavity" />
          {lips === 'lips' && <rect x="36" y={30 - l.ry - 2} width="28" height="7" rx="2" className="m-teeth" />}
          {(lips === 'spread' || lips === 'open' || lips === 'neutral') && <rect x={50 - l.rx * 0.6} y={30 - l.ry} width={l.rx * 1.2} height="4" rx="1.5" className="m-teeth" />}
        </svg>
        <figcaption>👄 {LIP_TEXT[lips]}</figcaption>
      </div>
      <div className="mouth-part">
        <svg viewBox="0 0 120 72" aria-hidden="true">
          {/* palate */}
          <path d="M8 26 Q20 6 60 6 Q98 6 112 22" className="m-palate" />
          {/* upper teeth */}
          <rect x="6" y="24" width="6" height="8" rx="2" className="m-teeth" />
          {/* uvula */}
          <path d="M110 22 q3 8 -2 12" className="m-palate" />
          {/* tongue */}
          <path d={`M14 ${t.tipY} Q${t.hx} ${t.hy} 112 60 L112 70 L14 70 Z`} className="m-tongue" />
          <text x="8" y="68" className="m-label">
            trước
          </text>
          <text x="92" y="68" className="m-label">
            sau
          </text>
        </svg>
        <figcaption>👅 {TONGUE_TEXT[tongue]}</figcaption>
      </div>
    </figure>
  );
}
