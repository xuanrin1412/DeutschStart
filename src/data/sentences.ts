import type { SentenceExercise, SentenceToken, TokenRole } from '@/types/models';

const t = (text: string, role: TokenRole): SentenceToken => ({ text, role });

export const sentences: SentenceExercise[] = [
  { id: 's-lerne-heute', tokens: [t('Ich', 'subject'), t('lerne', 'verb'), t('heute', 'time'), t('Deutsch', 'object')], vi: 'Hôm nay tôi học tiếng Đức.', structure: 'Chủ ngữ + Động từ + Thời gian + Tân ngữ', punctuation: '.', alternatives: ['Heute lerne ich Deutsch'] },
  { id: 's-heute-lerne', tokens: [t('Heute', 'time'), t('lerne', 'verb'), t('ich', 'subject'), t('Deutsch', 'object')], vi: 'Hôm nay tôi học tiếng Đức.', structure: 'Thời gian + Động từ + Chủ ngữ + Tân ngữ (động từ luôn ở vị trí 2!)', punctuation: '.', alternatives: ['Ich lerne heute Deutsch'] },
  { id: 's-komme-aus', tokens: [t('Ich', 'subject'), t('komme', 'verb'), t('aus Vietnam', 'place')], vi: 'Tôi đến từ Việt Nam.', structure: 'Chủ ngữ + Động từ + Nơi chốn', punctuation: '.' },
  { id: 's-heisse', tokens: [t('Ich', 'subject'), t('heiße', 'verb'), t('Minh', 'object')], vi: 'Tôi tên là Minh.', structure: 'Chủ ngữ + Động từ + Tên', punctuation: '.' },
  { id: 's-wie-heisst', tokens: [t('Wie', 'question'), t('heißt', 'verb'), t('du', 'subject')], vi: 'Bạn tên là gì?', structure: 'Từ để hỏi + Động từ + Chủ ngữ', punctuation: '?' },
  { id: 's-woher', tokens: [t('Woher', 'question'), t('kommst', 'verb'), t('du', 'subject')], vi: 'Bạn đến từ đâu?', structure: 'Từ để hỏi + Động từ + Chủ ngữ', punctuation: '?' },
  { id: 's-kommst-du', tokens: [t('Kommst', 'verb'), t('du', 'subject'), t('aus Vietnam', 'place')], vi: 'Bạn đến từ Việt Nam phải không?', structure: 'Động từ + Chủ ngữ + … (câu hỏi Có/Không)', punctuation: '?' },
  { id: 's-kein-kaffee', tokens: [t('Ich', 'subject'), t('trinke', 'verb'), t('keinen', 'negation'), t('Kaffee', 'object')], vi: 'Tôi không uống cà phê.', structure: 'Chủ ngữ + Động từ + kein + Danh từ', punctuation: '.' },
  { id: 's-nicht-berlin', tokens: [t('Ich', 'subject'), t('wohne', 'verb'), t('nicht', 'negation'), t('in Berlin', 'place')], vi: 'Tôi không sống ở Berlin.', structure: 'Chủ ngữ + Động từ + nicht + Nơi chốn', punctuation: '.' },
  { id: 's-er-ist', tokens: [t('Er', 'subject'), t('ist', 'verb'), t('Lehrer', 'object')], vi: 'Anh ấy là giáo viên.', structure: 'Chủ ngữ + sein + Nghề nghiệp', punctuation: '.' },
  { id: 's-wir-haben', tokens: [t('Wir', 'subject'), t('haben', 'verb'), t('eine Wohnung', 'object')], vi: 'Chúng tôi có một căn hộ.', structure: 'Chủ ngữ + haben + Tân ngữ', punctuation: '.' },
  { id: 's-zug', tokens: [t('Der Zug', 'subject'), t('kommt', 'verb'), t('um acht Uhr', 'time')], vi: 'Tàu đến lúc tám giờ.', structure: 'Chủ ngữ + Động từ + Thời gian', punctuation: '.' },
  { id: 's-morgen-arbeite', tokens: [t('Morgen', 'time'), t('arbeite', 'verb'), t('ich', 'subject'), t('in Berlin', 'place')], vi: 'Ngày mai tôi làm việc ở Berlin.', structure: 'Thời gian + Động từ + Chủ ngữ + Nơi chốn', punctuation: '.', alternatives: ['Ich arbeite morgen in Berlin'] },
  { id: 's-du-bist', tokens: [t('Du', 'subject'), t('bist', 'verb'), t('sehr nett', 'object')], vi: 'Bạn rất tốt bụng.', structure: 'Chủ ngữ + sein + Tính từ', punctuation: '.' },
];
