import type { CefrLevel, Lesson } from '@/types/models';

/**
 * Planned A2 and B1 units. They are shown on the course page so the full path A0 → B1 is visible,
 * but cannot be opened yet (`available: false`). Content follows the same dependency model when added.
 */
const plan: { level: CefrLevel; id: string; title: string; titleDe: string; icon: string; objective: string; area: Lesson['area'] }[] = [
  // A2
  { level: 'A2', id: 'a2-dative', title: 'Cách 3 – Dativ', titleDe: 'Der Dativ', icon: '3️⃣', area: 'grammar', objective: 'Dativ đầy đủ: tân ngữ gián tiếp, đại từ mir/dir/ihm, động từ đi với Dativ (helfen, gefallen).' },
  { level: 'A2', id: 'a2-two-way', title: 'Giới từ hai cách', titleDe: 'Wechselpräpositionen', icon: '↔️', area: 'grammar', objective: 'in, an, auf, unter, über… – Wo? (Dativ) và Wohin? (Akkusativ).' },
  { level: 'A2', id: 'a2-weil-dass', title: 'Câu phụ: weil, dass, wenn', titleDe: 'Nebensätze', icon: '🔗', area: 'grammar', objective: 'Câu phụ với động từ đứng cuối: weil (vì), dass (rằng), wenn (nếu/khi).' },
  { level: 'A2', id: 'a2-reflexive', title: 'Động từ phản thân', titleDe: 'Reflexive Verben', icon: '🪞', area: 'grammar', objective: 'sich freuen, sich waschen, sich treffen – mich, dich, sich.' },
  { level: 'A2', id: 'a2-comparative', title: 'So sánh hơn và nhất', titleDe: 'Komparativ und Superlativ', icon: '📊', area: 'grammar', objective: 'groß → größer → am größten; so … wie; als.' },
  { level: 'A2', id: 'a2-adjective-endings', title: 'Đuôi tính từ', titleDe: 'Adjektivdeklination', icon: '🎨', area: 'grammar', objective: 'ein großer Tisch, die neue Wohnung – đuôi tính từ trước danh từ.' },
  { level: 'A2', id: 'a2-praeteritum', title: 'Präteritum của động từ thông dụng', titleDe: 'Präteritum', icon: '🕰️', area: 'grammar', objective: 'konnte, musste, wollte, gab, ging – quá khứ trong văn viết.' },
  { level: 'A2', id: 'a2-future', title: 'Kế hoạch tương lai', titleDe: 'Pläne und Zukunft', icon: '🔮', area: 'communication', objective: 'werden + Infinitiv, nói về kế hoạch và dự định.' },
  { level: 'A2', id: 'a2-work', title: 'Công việc và đồng nghiệp', titleDe: 'Arbeit und Kollegen', icon: '💼', area: 'communication', objective: 'Nói về công việc, lịch làm, xin nghỉ, họp.' },
  { level: 'A2', id: 'a2-housing', title: 'Nhà ở và hàng xóm', titleDe: 'Wohnen', icon: '🏢', area: 'communication', objective: 'Thuê nhà, báo hỏng hóc, nội quy nhà, phân loại rác.' },
  { level: 'A2', id: 'a2-health', title: 'Sức khỏe và bác sĩ', titleDe: 'Beim Arzt', icon: '🩺', area: 'communication', objective: 'Mô tả triệu chứng chi tiết, hiệu thuốc, bảo hiểm.' },
  { level: 'A2', id: 'a2-appointments', title: 'Hẹn và đổi lịch hẹn', titleDe: 'Termine', icon: '📅', area: 'communication', objective: 'Đặt, đổi, hủy lịch hẹn qua điện thoại và email.' },
  { level: 'A2', id: 'a2-problems', title: 'Xử lý tình huống hằng ngày', titleDe: 'Probleme lösen', icon: '🛠️', area: 'communication', objective: 'Khiếu nại, đổi trả hàng, báo mất đồ.' },
  { level: 'A2', id: 'a2-relationships', title: 'Các mối quan hệ', titleDe: 'Beziehungen', icon: '🤝', area: 'communication', objective: 'Bạn bè, gia đình, lễ hội, mời và cảm ơn.' },
  { level: 'A2', id: 'a2-travel', title: 'Du lịch và kỳ nghỉ', titleDe: 'Reisen', icon: '✈️', area: 'communication', objective: 'Kể về chuyến đi bằng Perfekt, đặt phòng, hỏi thông tin.' },
  // B1
  { level: 'B1', id: 'b1-relative', title: 'Mệnh đề quan hệ', titleDe: 'Relativsätze', icon: '🧷', area: 'grammar', objective: 'der Mann, der …; die Stadt, in der … – mệnh đề quan hệ ở cả 3 cách.' },
  { level: 'B1', id: 'b1-passive', title: 'Câu bị động', titleDe: 'Das Passiv', icon: '🔄', area: 'grammar', objective: 'werden + Partizip II: Das Haus wird gebaut.' },
  { level: 'B1', id: 'b1-konjunktiv', title: 'Konjunktiv II', titleDe: 'Konjunktiv II', icon: '💭', area: 'grammar', objective: 'würde, hätte, wäre, könnte – ước muốn, lời khuyên, lịch sự.' },
  { level: 'B1', id: 'b1-connectors', title: 'Liên từ nâng cao', titleDe: 'Konnektoren', icon: '🔗', area: 'grammar', objective: 'obwohl, trotzdem, deshalb, nachdem, bevor, während.' },
  { level: 'B1', id: 'b1-infinitive', title: 'Cấu trúc với zu + Infinitiv', titleDe: 'Infinitiv mit zu', icon: '➡️', area: 'grammar', objective: 'um … zu, ohne … zu, Es ist wichtig, … zu …' },
  { level: 'B1', id: 'b1-opinions', title: 'Nêu ý kiến và lập luận', titleDe: 'Meinungen äußern', icon: '🗣️', area: 'communication', objective: 'Meiner Meinung nach…, Ich finde, dass…; đồng ý và phản đối.' },
  { level: 'B1', id: 'b1-career', title: 'Nghề nghiệp và hồ sơ xin việc', titleDe: 'Beruf und Bewerbung', icon: '📄', area: 'communication', objective: 'Viết CV, thư xin việc, phỏng vấn.' },
  { level: 'B1', id: 'b1-education', title: 'Giáo dục', titleDe: 'Bildung', icon: '🎓', area: 'communication', objective: 'Hệ thống giáo dục Đức, Ausbildung, đại học.' },
  { level: 'B1', id: 'b1-society', title: 'Xã hội và môi trường', titleDe: 'Gesellschaft und Umwelt', icon: '🌱', area: 'communication', objective: 'Thảo luận về môi trường, công nghệ, tin tức.' },
  { level: 'B1', id: 'b1-formal', title: 'Giao tiếp trang trọng', titleDe: 'Formelle Kommunikation', icon: '✉️', area: 'communication', objective: 'Thư trang trọng, khiếu nại, đề nghị – cấu trúc bài viết B1.' },
  { level: 'B1', id: 'b1-exam', title: 'Luyện thi B1', titleDe: 'Prüfungstraining B1', icon: '🏁', area: 'communication', objective: 'Bài thi mẫu Nghe, Đọc, Viết, Nói theo định dạng Goethe/telc B1.' },
];

export function roadmapLessons(startOrder: number): Lesson[] {
  const unitIn: Partial<Record<CefrLevel, number>> = {};
  return plan.map((p, i) => {
    unitIn[p.level] = (unitIn[p.level] ?? 0) + 1;
    return {
      id: p.id,
      level: p.level,
      order: startOrder + i + 1,
      unit: unitIn[p.level]!,
      title: p.title,
      titleDe: p.titleDe,
      description: p.objective,
      minutes: 15,
      icon: p.icon,
      objective: p.objective,
      prerequisites: i === 0 ? [] : [plan[i - 1].id],
      teaches: [],
      area: p.area,
      steps: [],
      available: false,
    };
  });
}
