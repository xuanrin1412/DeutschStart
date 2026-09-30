import type { Article, SrsState, TokenRole } from '@/types/models';

export const ROLE_LABELS: Record<TokenRole, string> = {
  subject: 'Chủ ngữ',
  verb: 'Động từ',
  verb2: 'Động từ cuối câu',
  time: 'Thời gian',
  object: 'Tân ngữ',
  place: 'Nơi chốn',
  negation: 'Phủ định',
  question: 'Từ để hỏi',
  other: 'Thành phần khác',
};

export const ARTICLES: Article[] = ['der', 'die', 'das'];

export const ARTICLE_LABELS: Record<Article, string> = {
  der: 'giống đực',
  die: 'giống cái',
  das: 'trung tính',
};

export const SRS_LABELS: Record<SrsState, string> = {
  new: 'Mới',
  learning: 'Đang học',
  review: 'Ôn tập',
  mastered: 'Thành thạo',
};

export const WORD_TYPE_LABELS: Record<string, string> = {
  noun: 'Danh từ',
  verb: 'Động từ',
  adjective: 'Tính từ',
  adverb: 'Trạng từ',
  phrase: 'Cụm từ',
  interjection: 'Thán từ',
};
