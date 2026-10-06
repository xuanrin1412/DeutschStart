import type { Term } from '@/types/models';

/** Grammar terminology, explained from zero before it is used in any lesson. */
export const terms: Term[] = [
  {
    id: 'word-type', vi: 'loại từ', de: 'die Wortart', question: 'Loại từ là gì?',
    explanation: 'Mỗi từ thuộc một "loại": từ chỉ người/vật (danh từ), từ chỉ hành động (động từ), từ chỉ tính chất (tính từ)… Biết loại từ giúp bạn biết cách dùng từ đó trong câu.',
  },
  {
    id: 'pronoun', vi: 'đại từ nhân xưng', de: 'das Personalpronomen', question: 'Đại từ là gì?',
    explanation: 'Đại từ là từ dùng để chỉ người nói, người nghe hoặc người/vật được nói đến, thay cho tên: tôi, bạn, anh ấy, chúng tôi…',
    examples: ['ich = tôi', 'du = bạn'],
  },
  {
    id: 'verb', vi: 'động từ', de: 'das Verb', question: 'Động từ là gì?',
    explanation: 'Động từ là từ diễn tả hành động (học, uống, đi) hoặc trạng thái (là, có). Mỗi câu tiếng Đức đều cần một động từ.',
    examples: ['lernen = học', 'sein = là'],
  },
  {
    id: 'infinitive', vi: 'động từ nguyên mẫu', de: 'der Infinitiv', question: 'Động từ nguyên mẫu là gì?',
    explanation: 'Là dạng "gốc" của động từ, dạng bạn tra trong từ điển. Trong tiếng Đức, nguyên mẫu thường kết thúc bằng -en: lernen, wohnen, trinken.',
    examples: ['lernen (nguyên mẫu) → ich lerne (đã chia)'],
  },
  {
    id: 'conjugation', vi: 'chia động từ', de: 'die Konjugation', question: 'Chia động từ là gì?',
    explanation: 'Tiếng Việt nói "tôi là", "bạn là", "anh ấy là" – chữ "là" không đổi. Tiếng Đức thì khác: động từ đổi đuôi theo người làm hành động. Việc đổi đuôi này gọi là "chia động từ".',
    examples: ['ich bin, du bist, er ist – cùng nghĩa "là"'],
  },
  {
    id: 'subject', vi: 'chủ ngữ', de: 'das Subjekt', question: 'Chủ ngữ là gì?',
    explanation: 'Chủ ngữ là người hoặc vật làm hành động trong câu – thường đứng trước động từ. Trong "Tôi học", "Tôi" là chủ ngữ.',
    examples: ['Ich lerne. → "Ich" là chủ ngữ'],
  },
  {
    id: 'sentence', vi: 'câu', de: 'der Satz', question: 'Một câu tiếng Đức cần những gì?',
    explanation: 'Câu đơn giản nhất cần: chủ ngữ (ai?) + động từ (làm gì / là gì?). Thêm phần còn lại để nói rõ hơn: ở đâu, khi nào, cái gì.',
  },
  {
    id: 'noun', vi: 'danh từ', de: 'das Nomen', question: 'Danh từ là gì?',
    explanation: 'Danh từ là từ chỉ người, con vật, đồ vật, nơi chốn hoặc khái niệm: người đàn ông, con mèo, cái bàn, thành phố. Trong tiếng Đức, danh từ LUÔN viết hoa chữ cái đầu: Mann, Katze, Tisch.',
    examples: ['der Mann = người đàn ông', 'die Katze = con mèo'],
  },
  {
    id: 'gender', vi: 'giống ngữ pháp', de: 'das Genus', question: 'Giống ngữ pháp là gì?',
    explanation: 'Mỗi danh từ tiếng Đức thuộc một trong ba "nhóm" gọi là giống: giống đực, giống cái, giống trung. Đây là đặc điểm NGỮ PHÁP của từ, không phải giới tính thật: cái bàn là giống đực, cô bé (das Mädchen) lại là giống trung! Tiếng Việt không có điều này, nên bạn cần học giống cùng với từ.',
  },
  {
    id: 'article', vi: 'mạo từ', de: 'der Artikel', question: 'Mạo từ là gì?',
    explanation: 'Mạo từ là từ nhỏ đứng trước danh từ. Tiếng Việt không có mạo từ; tiếng Anh có "the" và "a". Tiếng Đức có mạo từ xác định (der, die, das ≈ "the") và mạo từ không xác định (ein, eine ≈ "a / một").',
  },
  {
    id: 'definite', vi: 'mạo từ xác định', de: 'der bestimmte Artikel', question: 'Mạo từ xác định là gì?',
    explanation: 'Dùng khi người nghe biết bạn đang nói về người/vật NÀO – giống "the" trong tiếng Anh. Tiếng Đức có ba dạng cơ bản: der, die, das – chọn theo giống của danh từ.',
    examples: ['der Mann = (cái) người đàn ông đó'],
  },
  {
    id: 'indefinite', vi: 'mạo từ không xác định', de: 'der unbestimmte Artikel', question: 'Mạo từ không xác định là gì?',
    explanation: 'Dùng khi nhắc đến người/vật lần đầu, chưa xác định – nghĩa là "một", giống "a / an" trong tiếng Anh: ein, eine.',
    examples: ['ein Mann = một người đàn ông'],
  },
  {
    id: 'plural', vi: 'số nhiều', de: 'der Plural', question: 'Số nhiều là gì?',
    explanation: 'Số nhiều là khi nói về hai người/vật trở lên. Tiếng Việt thêm "những, các"; tiếng Đức đổi đuôi danh từ (Katze → Katzen) và mạo từ số nhiều luôn là "die".',
  },
  {
    id: 'adjective', vi: 'tính từ', de: 'das Adjektiv', question: 'Tính từ là gì?',
    explanation: 'Tính từ là từ mô tả tính chất: to, nhỏ, đẹp, mới. Sau động từ "sein", tính từ không đổi đuôi: Die Katze ist klein.',
    examples: ['klein = nhỏ', 'groß = to'],
  },
  {
    id: 'question', vi: 'câu hỏi', de: 'die Frage', question: 'Câu hỏi tiếng Đức được tạo thế nào?',
    explanation: 'Có hai kiểu: câu hỏi có/không – đưa động từ lên đầu câu (Bist du müde?); và câu hỏi với từ để hỏi (wer, was, wo…) – từ để hỏi đứng đầu, động từ đứng thứ hai (Wo wohnst du?).',
  },
  {
    id: 'object', vi: 'tân ngữ', de: 'das Objekt', question: 'Tân ngữ là gì?',
    explanation: 'Tân ngữ là người/vật chịu tác động của hành động. Trong "Tôi uống cà phê", "cà phê" là tân ngữ.',
  },
  {
    id: 'case', vi: 'cách (ngữ pháp)', de: 'der Kasus', question: 'Cách là gì?',
    explanation: 'Tiếng Đức thay đổi mạo từ tùy vai trò của danh từ trong câu (chủ ngữ, tân ngữ…). Mỗi vai trò gọi là một "cách". Cách 1 (Nominativ) là dạng cơ bản bạn học đầu tiên: der, die, das.',
  },
];
