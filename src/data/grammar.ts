import type { GrammarLesson, Question } from '@/types/models';

/** Helper: multiple-choice grammar question. */
const mc = (id: string, prompt: string, display: string, options: string[], answer: string, explanation: string): Question => ({
  id: `g-${id}`, type: 'fill-blank', prompt, display, options, answer, explanation, category: 'grammar',
});

export const grammarLessons: GrammarLesson[] = [
  {
    id: 'pronouns', order: 1, title: 'Đại từ nhân xưng', titleDe: 'Personalpronomen', level: 'A1', icon: '🧑', available: true,
    summary: 'ich, du, er, sie, es… – những từ nhỏ dùng nhiều nhất.',
    explanation: [
      'Đại từ nhân xưng thay cho người hoặc vật: tôi, bạn, anh ấy…',
      'Chú ý: "sie" viết thường có hai nghĩa – "cô ấy" hoặc "họ". "Sie" viết hoa là cách xưng hô lịch sự (ông/bà/anh/chị).',
      'Danh từ giống đực (der) được thay bằng "er", giống cái (die) bằng "sie", trung tính (das) bằng "es".',
    ],
    table: {
      headers: ['Tiếng Đức', 'Tiếng Việt'],
      rows: [['ich', 'tôi'], ['du', 'bạn (thân mật)'], ['er', 'anh ấy / nó (der)'], ['sie', 'cô ấy / nó (die)'], ['es', 'nó (das)'], ['wir', 'chúng tôi'], ['ihr', 'các bạn'], ['sie', 'họ'], ['Sie', 'ông/bà (lịch sự)']],
      audioCols: [0],
    },
    examples: [
      { de: 'Ich bin Minh.', vi: 'Tôi là Minh.', highlight: ['Ich'] },
      { de: 'Der Tisch ist neu. Er ist groß.', vi: 'Cái bàn mới. Nó to.', highlight: ['Er'] },
      { de: 'Wir lernen Deutsch.', vi: 'Chúng tôi học tiếng Đức.', highlight: ['Wir'] },
    ],
    questions: [
      mc('pr1', 'Chọn đại từ đúng: "chúng tôi"', '___ lernen Deutsch.', ['Wir', 'Ihr', 'Sie', 'Ich'], 'Wir', '"wir" = chúng tôi.'),
      mc('pr2', 'Thay "die Lampe" bằng đại từ', 'Die Lampe ist neu. ___ ist hell.', ['Er', 'Sie', 'Es', 'Wir'], 'Sie', 'die Lampe (giống cái) → sie.'),
      mc('pr3', 'Thay "das Buch" bằng đại từ', 'Das Buch ist gut. ___ ist interessant.', ['Er', 'Sie', 'Es', 'Ihr'], 'Es', 'das Buch (trung tính) → es.'),
      mc('pr4', 'Cách xưng hô lịch sự với người lạ', 'Wie heißen ___?', ['du', 'Sie', 'ihr', 'er'], 'Sie', '"Sie" viết hoa là cách xưng hô lịch sự.'),
    ],
    tip: 'Mẹo: der → er, die → sie, das → es. Chữ cái cuối của mạo từ giúp bạn nhớ đại từ!',
  },
  {
    id: 'sein', order: 2, title: 'Động từ sein (là, thì, ở)', titleDe: 'Das Verb „sein“', level: 'A1', icon: '🟰', available: true,
    summary: 'Động từ quan trọng nhất – và bất quy tắc.',
    explanation: [
      '"sein" nghĩa là "là", "thì", "ở". Dùng để nói tên, nghề nghiệp, quốc tịch, tính chất.',
      'sein là động từ bất quy tắc – bạn cần học thuộc bảng chia.',
    ],
    table: { headers: ['Đại từ', 'sein'], rows: [['ich', 'bin'], ['du', 'bist'], ['er/sie/es', 'ist'], ['wir', 'sind'], ['ihr', 'seid'], ['sie/Sie', 'sind']], audioCols: [0, 1] },
    structureLabel: 'Chủ ngữ + sein + Bổ ngữ',
    structure: [{ text: 'Ich', role: 'subject' }, { text: 'bin', role: 'verb' }, { text: 'Student.', role: 'object' }],
    examples: [
      { de: 'Ich bin Studentin.', vi: 'Tôi là sinh viên.', highlight: ['bin'] },
      { de: 'Du bist sehr nett.', vi: 'Bạn rất tốt bụng.', highlight: ['bist'] },
      { de: 'Wir sind in Berlin.', vi: 'Chúng tôi đang ở Berlin.', highlight: ['sind'] },
    ],
    sentenceIds: ['s-er-ist', 's-du-bist'],
    questions: [
      mc('se1', 'Điền dạng đúng của "sein"', 'Ich ___ aus Vietnam.', ['bin', 'bist', 'ist', 'sind'], 'bin', 'ich → bin.'),
      mc('se2', 'Điền dạng đúng của "sein"', 'Er ___ Lehrer.', ['bin', 'bist', 'ist', 'seid'], 'ist', 'er/sie/es → ist.'),
      mc('se3', 'Điền dạng đúng của "sein"', 'Wir ___ müde.', ['sind', 'seid', 'ist', 'bin'], 'sind', 'wir → sind.'),
      mc('se4', 'Điền dạng đúng của "sein"', 'Ihr ___ sehr nett.', ['sind', 'seid', 'bist', 'ist'], 'seid', 'ihr → seid.'),
      mc('se5', 'Điền dạng đúng của "sein"', '___ du Student?', ['Bin', 'Bist', 'Ist', 'Sind'], 'Bist', 'du → bist. Câu hỏi Có/Không: động từ đứng đầu.'),
    ],
  },
  {
    id: 'haben', order: 3, title: 'Động từ haben (có)', titleDe: 'Das Verb „haben“', level: 'A1', icon: '🤲', available: true,
    summary: 'Nói về những gì bạn có: gia đình, đồ vật, thời gian.',
    explanation: [
      '"haben" nghĩa là "có". Chú ý: du hast, er hat – chữ "b" biến mất!',
      'Người Đức cũng dùng haben để nói tuổi? Không! Tuổi dùng "sein": Ich bin 20 Jahre alt.',
    ],
    table: { headers: ['Đại từ', 'haben'], rows: [['ich', 'habe'], ['du', 'hast'], ['er/sie/es', 'hat'], ['wir', 'haben'], ['ihr', 'habt'], ['sie/Sie', 'haben']], audioCols: [0, 1] },
    structureLabel: 'Chủ ngữ + haben + Tân ngữ',
    structure: [{ text: 'Ich', role: 'subject' }, { text: 'habe', role: 'verb' }, { text: 'einen Bruder.', role: 'object' }],
    examples: [
      { de: 'Ich habe einen Bruder.', vi: 'Tôi có một anh trai.', highlight: ['habe'] },
      { de: 'Hast du Zeit?', vi: 'Bạn có thời gian không?', highlight: ['Hast'] },
      { de: 'Sie hat eine Katze.', vi: 'Cô ấy có một con mèo.', highlight: ['hat'] },
    ],
    sentenceIds: ['s-wir-haben'],
    questions: [
      mc('ha1', 'Điền dạng đúng của "haben"', 'Ich ___ eine Schwester.', ['habe', 'hast', 'hat', 'habt'], 'habe', 'ich → habe.'),
      mc('ha2', 'Điền dạng đúng của "haben"', 'Du ___ ein Auto.', ['habe', 'hast', 'hat', 'haben'], 'hast', 'du → hast.'),
      mc('ha3', 'Điền dạng đúng của "haben"', 'Mein Vater ___ viel Arbeit.', ['habt', 'hast', 'hat', 'haben'], 'hat', 'mein Vater = er → hat.'),
      mc('ha4', 'Chọn câu đúng về tuổi', '"Tôi 20 tuổi."', ['Ich habe 20 Jahre.', 'Ich bin 20 Jahre alt.', 'Ich hat 20 Jahre alt.', 'Ich bist 20 Jahre.'], 'Ich bin 20 Jahre alt.', 'Tuổi dùng "sein", không dùng "haben".'),
    ],
  },
  {
    id: 'regular-verbs', order: 4, title: 'Động từ có quy tắc', titleDe: 'Regelmäßige Verben', level: 'A1', icon: '⚙️', available: true,
    summary: 'Gốc động từ + đuôi: -e, -st, -t, -en, -t, -en.',
    explanation: [
      'Động từ nguyên mẫu thường kết thúc bằng -en: lernen, wohnen, kommen.',
      'Bỏ -en để được gốc (lern-), rồi thêm đuôi theo chủ ngữ.',
      'Gốc kết thúc bằng -t hoặc -d thì thêm "e": du arbeitest, er arbeitet.',
    ],
    table: { headers: ['Đại từ', 'Đuôi', 'lernen', 'wohnen'], rows: [['ich', '-e', 'lerne', 'wohne'], ['du', '-st', 'lernst', 'wohnst'], ['er/sie/es', '-t', 'lernt', 'wohnt'], ['wir', '-en', 'lernen', 'wohnen'], ['ihr', '-t', 'lernt', 'wohnt'], ['sie/Sie', '-en', 'lernen', 'wohnen']], audioCols: [0, 2] },
    examples: [
      { de: 'Ich wohne in Hamburg.', vi: 'Tôi sống ở Hamburg.', highlight: ['wohne'] },
      { de: 'Du lernst schnell.', vi: 'Bạn học nhanh.', highlight: ['lernst'] },
      { de: 'Sie arbeitet in einem Café.', vi: 'Cô ấy làm việc ở một quán cà phê.', highlight: ['arbeitet'] },
    ],
    sentenceIds: ['s-komme-aus', 's-lerne-heute'],
    questions: [
      mc('rv1', 'Chia động từ "lernen"', 'Du ___ Deutsch.', ['lerne', 'lernst', 'lernt', 'lernen'], 'lernst', 'du → -st.'),
      mc('rv2', 'Chia động từ "wohnen"', 'Wir ___ in Köln.', ['wohne', 'wohnst', 'wohnt', 'wohnen'], 'wohnen', 'wir → -en.'),
      mc('rv3', 'Chia động từ "kommen"', 'Er ___ aus Vietnam.', ['komme', 'kommst', 'kommt', 'kommen'], 'kommt', 'er → -t.'),
      mc('rv4', 'Chia động từ "arbeiten"', 'Du ___ viel.', ['arbeitst', 'arbeitest', 'arbeiten', 'arbeite'], 'arbeitest', 'Gốc tận cùng -t → thêm e: arbeitest.'),
    ],
  },
  {
    id: 'word-order', order: 5, title: 'Trật tự từ', titleDe: 'Satzbau', level: 'A1', icon: '🧱', available: true,
    summary: 'Động từ luôn ở vị trí số 2 trong câu trần thuật.',
    explanation: [
      'Quy tắc vàng: động từ chia đứng ở vị trí thứ 2.',
      'Vị trí 1 có thể là chủ ngữ, thời gian hoặc nơi chốn. Nếu không phải chủ ngữ, chủ ngữ sẽ đứng ngay sau động từ.',
    ],
    structureLabel: 'Vị trí 1 + Động từ (vị trí 2) + …',
    structure: [{ text: 'Heute', role: 'time' }, { text: 'lerne', role: 'verb' }, { text: 'ich', role: 'subject' }, { text: 'Deutsch.', role: 'object' }],
    examples: [
      { de: 'Ich lerne heute Deutsch.', vi: 'Hôm nay tôi học tiếng Đức.', highlight: ['lerne'] },
      { de: 'Heute lerne ich Deutsch.', vi: 'Hôm nay tôi học tiếng Đức.', highlight: ['lerne'] },
      { de: 'In Berlin wohnt meine Schwester.', vi: 'Chị gái tôi sống ở Berlin.', highlight: ['wohnt'] },
    ],
    sentenceIds: ['s-lerne-heute', 's-heute-lerne', 's-morgen-arbeite', 's-zug'],
    questions: [
      mc('wo1', 'Chọn câu đúng', '"Ngày mai tôi làm việc."', ['Morgen ich arbeite.', 'Morgen arbeite ich.', 'Arbeite morgen ich.', 'Ich morgen arbeite.'], 'Morgen arbeite ich.', 'Động từ ở vị trí 2, chủ ngữ ngay sau.'),
      mc('wo2', 'Chọn câu đúng', '"Hôm nay trời lạnh."', ['Heute es ist kalt.', 'Heute ist es kalt.', 'Es heute ist kalt.', 'Ist heute es kalt.'], 'Heute ist es kalt.', 'Heute (1) – ist (2) – es.'),
      mc('wo3', 'Động từ đứng ở vị trí nào?', 'Ich trinke Kaffee.', ['Vị trí 1', 'Vị trí 2', 'Cuối câu', 'Tùy ý'], 'Vị trí 2', 'Câu trần thuật: động từ ở vị trí 2.'),
    ],
  },
  {
    id: 'articles', order: 6, title: 'Mạo từ der, die, das', titleDe: 'Artikel', level: 'A1', icon: '🎯', available: true,
    summary: 'Ba giống của danh từ và mẹo ghi nhớ.',
    explanation: [
      'Mỗi danh từ tiếng Đức có một giống: giống đực (der), giống cái (die) hoặc trung tính (das). Số nhiều luôn dùng "die".',
      'Giống ngữ pháp không luôn khớp với giới tính thật: das Mädchen (cô bé) là trung tính!',
      'Cách học tốt nhất: luôn học danh từ cùng mạo từ và màu sắc – der (xanh dương), die (đỏ), das (xanh lá).',
    ],
    table: { headers: ['Dấu hiệu', 'Mạo từ', 'Ví dụ'], rows: [['Người nam, ngày, tháng, mùa', 'der', 'der Vater, der Montag'], ['-ung, -heit, -keit, -e (thường)', 'die', 'die Wohnung, die Lampe'], ['-chen, -lein, -um', 'das', 'das Mädchen, das Museum'], ['Số nhiều', 'die', 'die Bücher']], audioCols: [2] },
    examples: [
      { de: 'der Tisch – die Tische', vi: 'cái bàn – những cái bàn', highlight: ['der', 'die'] },
      { de: 'die Wohnung', vi: 'căn hộ', highlight: ['die'] },
      { de: 'das Mädchen', vi: 'cô bé', highlight: ['das'] },
    ],
    questions: [
      { id: 'g-ar1', type: 'article', prompt: 'Chọn mạo từ đúng', display: '___ Zeitung', options: ['der', 'die', 'das'], answer: 'die', explanation: 'Tận cùng "-ung" → luôn là die.', category: 'grammar' },
      { id: 'g-ar2', type: 'article', prompt: 'Chọn mạo từ đúng', display: '___ Brötchen', options: ['der', 'die', 'das'], answer: 'das', explanation: 'Tận cùng "-chen" → luôn là das.', category: 'grammar' },
      { id: 'g-ar3', type: 'article', prompt: 'Chọn mạo từ đúng', display: '___ Freitag', options: ['der', 'die', 'das'], answer: 'der', explanation: 'Các ngày trong tuần → der.', category: 'grammar' },
      { id: 'g-ar4', type: 'article', prompt: 'Số nhiều của "das Buch"', display: '___ Bücher', options: ['der', 'die', 'das'], answer: 'die', explanation: 'Số nhiều luôn dùng die.', category: 'grammar' },
    ],
    tip: 'Luyện thêm ở phần "Luyện mạo từ" – hệ thống sẽ ưu tiên mạo từ bạn hay sai.',
  },
  {
    id: 'negation', order: 7, title: 'Phủ định: nicht và kein', titleDe: 'Negation', level: 'A1', icon: '🚫', available: true,
    summary: '"kein" cho danh từ, "nicht" cho mọi thứ khác.',
    explanation: [
      'Dùng "kein/keine/keinen" trước danh từ đi với "ein" hoặc không có mạo từ: Ich habe keine Zeit.',
      'Dùng "nicht" để phủ định động từ, tính từ, nơi chốn, danh từ có mạo từ xác định: Ich wohne nicht in Berlin.',
    ],
    structureLabel: 'Chủ ngữ + Động từ + nicht/kein + …',
    structure: [{ text: 'Ich', role: 'subject' }, { text: 'trinke', role: 'verb' }, { text: 'keinen', role: 'negation' }, { text: 'Kaffee.', role: 'object' }],
    examples: [
      { de: 'Ich habe kein Auto.', vi: 'Tôi không có ô tô.', highlight: ['kein'] },
      { de: 'Das ist nicht teuer.', vi: 'Cái này không đắt.', highlight: ['nicht'] },
      { de: 'Er kommt heute nicht.', vi: 'Hôm nay anh ấy không đến.', highlight: ['nicht'] },
    ],
    sentenceIds: ['s-kein-kaffee', 's-nicht-berlin'],
    questions: [
      mc('ne1', 'nicht hay kein?', 'Ich habe ___ Zeit.', ['nicht', 'keine'], 'keine', 'Danh từ không có mạo từ → kein(e).'),
      mc('ne2', 'nicht hay kein?', 'Das Wetter ist ___ gut.', ['nicht', 'kein'], 'nicht', 'Phủ định tính từ → nicht.'),
      mc('ne3', 'nicht hay kein?', 'Er hat ___ Bruder.', ['nicht', 'keinen'], 'keinen', 'einen Bruder → keinen Bruder.'),
      mc('ne4', 'nicht hay kein?', 'Wir wohnen ___ in Köln.', ['nicht', 'kein'], 'nicht', 'Phủ định nơi chốn → nicht.'),
    ],
  },
  {
    id: 'questions', order: 8, title: 'Câu hỏi', titleDe: 'Fragesätze', level: 'A1', icon: '❓', available: true,
    summary: 'Câu hỏi W và câu hỏi Có/Không.',
    explanation: [
      'Câu hỏi W: Từ để hỏi (vị trí 1) + Động từ (vị trí 2) + Chủ ngữ. Ví dụ: Wo wohnst du?',
      'Câu hỏi Có/Không: Động từ đứng đầu câu. Ví dụ: Kommst du aus Vietnam? – Ja / Nein.',
    ],
    table: { headers: ['Từ để hỏi', 'Nghĩa'], rows: [['wer', 'ai'], ['was', 'cái gì'], ['wo', 'ở đâu'], ['woher', 'từ đâu'], ['wohin', 'đi đâu'], ['wann', 'khi nào'], ['wie', 'như thế nào'], ['warum', 'tại sao']], audioCols: [0] },
    structureLabel: 'Từ để hỏi + Động từ + Chủ ngữ?',
    structure: [{ text: 'Woher', role: 'question' }, { text: 'kommst', role: 'verb' }, { text: 'du?', role: 'subject' }],
    examples: [
      { de: 'Wie heißt du?', vi: 'Bạn tên là gì?', highlight: ['Wie'] },
      { de: 'Wann beginnt der Kurs?', vi: 'Khi nào khóa học bắt đầu?', highlight: ['Wann'] },
      { de: 'Sprichst du Deutsch?', vi: 'Bạn có nói tiếng Đức không?', highlight: ['Sprichst'] },
    ],
    sentenceIds: ['s-wie-heisst', 's-woher', 's-kommst-du'],
    questions: [
      mc('qu1', 'Chọn từ để hỏi đúng', '___ wohnst du? – In Berlin.', ['Wer', 'Wo', 'Wann', 'Was'], 'Wo', 'Hỏi nơi chốn → wo.'),
      mc('qu2', 'Chọn từ để hỏi đúng', '___ kommst du? – Aus Vietnam.', ['Woher', 'Wohin', 'Wie', 'Wer'], 'Woher', 'Hỏi nguồn gốc → woher.'),
      mc('qu3', 'Chọn từ để hỏi đúng', '___ ist das? – Das ist Frau Müller.', ['Was', 'Wer', 'Wo', 'Wie'], 'Wer', 'Hỏi người → wer.'),
      mc('qu4', 'Chọn câu hỏi Có/Không đúng', '"Bạn có mệt không?"', ['Du bist müde?', 'Bist du müde?', 'Müde du bist?', 'Du müde bist?'], 'Bist du müde?', 'Câu hỏi Có/Không: động từ đứng đầu.'),
    ],
  },
  { id: 'conjugation', order: 9, title: 'Động từ biến đổi gốc', titleDe: 'Verben mit Vokalwechsel', level: 'A1', icon: '🔁', available: false, summary: 'fahren → du fährst, essen → er isst.' },
  { id: 'nominative', order: 10, title: 'Cách 1 – Nominativ', titleDe: 'Nominativ', level: 'A1', icon: '1️⃣', available: false, summary: 'Chủ ngữ của câu: Wer? Was?' },
  { id: 'accusative', order: 11, title: 'Cách 4 – Akkusativ', titleDe: 'Akkusativ', level: 'A1', icon: '4️⃣', available: false, summary: 'Tân ngữ trực tiếp: der → den.' },
  { id: 'dative', order: 12, title: 'Cách 3 – Dativ (nhập môn)', titleDe: 'Dativ', level: 'A2', icon: '3️⃣', available: false, summary: 'mit dem Bus, zum Arzt.' },
  { id: 'plural', order: 13, title: 'Số nhiều', titleDe: 'Plural', level: 'A1', icon: '👥', available: false, summary: '5 cách tạo số nhiều của danh từ.' },
  { id: 'modal', order: 14, title: 'Động từ khuyết thiếu', titleDe: 'Modalverben', level: 'A1', icon: '💪', available: false, summary: 'können, müssen, möchten, wollen…' },
  { id: 'separable', order: 15, title: 'Động từ tách', titleDe: 'Trennbare Verben', level: 'A1', icon: '✂️', available: false, summary: 'aufstehen → Ich stehe um 7 Uhr auf.' },
];
