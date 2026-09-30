import type { FillBlankItem, ListeningSentence, TranslationItem } from '@/types/models';

/** Listening level 2: play a sentence, choose what you heard. */
export const listeningSentences: ListeningSentence[] = [
  { id: 'ls1', de: 'Ich komme aus Vietnam.', vi: 'Tôi đến từ Việt Nam.', distractors: ['Ich wohne in Vietnam.', 'Ich komme aus Wien.', 'Er kommt aus Vietnam.'] },
  { id: 'ls2', de: 'Wie heißt du?', vi: 'Bạn tên là gì?', distractors: ['Wie geht’s dir?', 'Wo wohnst du?', 'Wie heißen Sie?'] },
  { id: 'ls3', de: 'Ich möchte einen Kaffee.', vi: 'Tôi muốn một ly cà phê.', distractors: ['Ich möchte einen Tee.', 'Ich mache einen Kaffee.', 'Ich habe einen Kaffee.'] },
  { id: 'ls4', de: 'Der Zug kommt um acht Uhr.', vi: 'Tàu đến lúc tám giờ.', distractors: ['Der Zug kommt um elf Uhr.', 'Der Bus kommt um acht Uhr.', 'Der Zug fährt um acht Uhr.'] },
  { id: 'ls5', de: 'Heute ist Montag.', vi: 'Hôm nay là thứ Hai.', distractors: ['Heute ist Mittwoch.', 'Morgen ist Montag.', 'Heute ist Sonntag.'] },
  { id: 'ls6', de: 'Das Wasser ist kalt.', vi: 'Nước lạnh.', distractors: ['Das Wetter ist kalt.', 'Das Wasser ist alt.', 'Der Kaffee ist kalt.'] },
  { id: 'ls7', de: 'Wo ist der Bahnhof?', vi: 'Nhà ga ở đâu?', distractors: ['Wo ist die Bank?', 'Wie ist der Bahnhof?', 'Wo ist der Supermarkt?'] },
  { id: 'ls8', de: 'Ich habe zwei Brüder.', vi: 'Tôi có hai anh trai.', distractors: ['Ich habe drei Brüder.', 'Ich habe zwei Bücher.', 'Ich habe zwei Schwestern.'] },
];

/** Listening level 3: fill in the missing word. */
export const fillBlanks: FillBlankItem[] = [
  { id: 'fb1', sentence: 'Ich ___ aus Vietnam.', answer: 'komme', options: ['komme', 'kommst', 'wohne', 'bin'], vi: 'Tôi đến từ Việt Nam.' },
  { id: 'fb2', sentence: 'Ich ___ in Berlin.', answer: 'wohne', options: ['wohne', 'komme', 'heiße', 'habe'], vi: 'Tôi sống ở Berlin.' },
  { id: 'fb3', sentence: 'Das ___ drei Euro.', answer: 'kostet', options: ['kostet', 'kommt', 'macht', 'ist'], vi: 'Cái này giá ba euro.' },
  { id: 'fb4', sentence: 'Ich ___ Deutsch.', answer: 'lerne', options: ['lerne', 'lese', 'lebe', 'liebe'], vi: 'Tôi học tiếng Đức.' },
  { id: 'fb5', sentence: 'Wir ___ Hunger.', answer: 'haben', options: ['haben', 'sind', 'hat', 'habt'], vi: 'Chúng tôi đói.' },
  { id: 'fb6', sentence: 'Die ___ ist offen.', answer: 'Tür', options: ['Tür', 'Tier', 'Uhr', 'Tour'], vi: 'Cửa đang mở.' },
];

/** Translation (Vietnamese → German). */
export const translations: TranslationItem[] = [
  { id: 'tr1', vi: 'Tôi đang học tiếng Đức.', accepted: ['Ich lerne Deutsch', 'Ich lerne gerade Deutsch'] },
  { id: 'tr2', vi: 'Tôi đến từ Việt Nam.', accepted: ['Ich komme aus Vietnam'] },
  { id: 'tr3', vi: 'Cảm ơn!', accepted: ['Danke', 'Danke schön', 'Vielen Dank'] },
  { id: 'tr4', vi: 'Tôi tên là Lan.', accepted: ['Ich heiße Lan', 'Mein Name ist Lan', 'Ich bin Lan'] },
  { id: 'tr5', vi: 'Nhà ga ở đâu?', accepted: ['Wo ist der Bahnhof'] },
  { id: 'tr6', vi: 'Cho tôi một ly cà phê.', accepted: ['Einen Kaffee bitte', 'Ich möchte einen Kaffee', 'Ich möchte einen Kaffee bitte', 'Einen Kaffee, bitte'] },
  { id: 'tr7', vi: 'Hôm nay là thứ Hai.', accepted: ['Heute ist Montag'] },
  { id: 'tr8', vi: 'Tôi có một anh trai.', accepted: ['Ich habe einen Bruder'] },
];
