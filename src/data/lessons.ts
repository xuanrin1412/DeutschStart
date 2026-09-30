import type { Lesson, Phrase } from '@/types/models';

const greetings: Phrase[] = [
  { de: 'Hallo!', vi: 'Xin chào!', ipa: '/haˈloː/', emoji: '👋', note: 'Dùng được mọi lúc, thân mật.' },
  { de: 'Guten Morgen!', vi: 'Chào buổi sáng!', ipa: '/ˈɡuːtn̩ ˈmɔʁɡn̩/', emoji: '🌅', note: 'Đến khoảng 10–11 giờ sáng.' },
  { de: 'Guten Tag!', vi: 'Xin chào! (ban ngày)', ipa: '/ˈɡuːtn̩ taːk/', emoji: '☀️', note: 'Lịch sự, dùng với người lạ.' },
  { de: 'Guten Abend!', vi: 'Chào buổi tối!', ipa: '/ˈɡuːtn̩ ˈaːbn̩t/', emoji: '🌆' },
  { de: 'Gute Nacht!', vi: 'Chúc ngủ ngon!', ipa: '/ˈɡuːtə naxt/', emoji: '🌙' },
  { de: 'Wie geht es Ihnen?', vi: 'Ông/bà có khỏe không?', ipa: '/viː ɡeːt ɛs ˈiːnən/', emoji: '🙂', note: 'Lịch sự (Sie).' },
  { de: 'Wie geht’s?', vi: 'Khỏe không?', ipa: '/viː ɡeːts/', emoji: '😄', note: 'Thân mật (du).' },
  { de: 'Danke, gut!', vi: 'Cảm ơn, tôi khỏe!', ipa: '/ˈdaŋkə ɡuːt/', emoji: '👍' },
  { de: 'Tschüss!', vi: 'Tạm biệt! (thân mật)', ipa: '/tʃʏs/', emoji: '🤚' },
  { de: 'Auf Wiedersehen!', vi: 'Tạm biệt! (lịch sự)', ipa: '/aʊ̯f ˈviːdɐˌzeːən/', emoji: '🙇' },
];

const introduce: Phrase[] = [
  { de: 'Ich heiße Minh.', vi: 'Tôi tên là Minh.', ipa: '/ɪç ˈhaɪ̯sə mɪn/' },
  { de: 'Mein Name ist Lan.', vi: 'Tên tôi là Lan.', ipa: '/maɪ̯n ˈnaːmə ɪst lan/' },
  { de: 'Ich komme aus Vietnam.', vi: 'Tôi đến từ Việt Nam.', ipa: '/ɪç ˈkɔmə aʊ̯s viˈɛtnam/' },
  { de: 'Ich wohne in Berlin.', vi: 'Tôi sống ở Berlin.', ipa: '/ɪç ˈvoːnə ɪn bɛʁˈliːn/' },
  { de: 'Ich bin 25 Jahre alt.', vi: 'Tôi 25 tuổi.', ipa: '/ɪç bɪn ˈfʏnfʊntˌtsvantsɪç ˈjaːʁə alt/' },
  { de: 'Ich bin Studentin.', vi: 'Tôi là sinh viên (nữ).', ipa: '/ɪç bɪn ʃtuˈdɛntɪn/', note: 'Nam: Ich bin Student.' },
  { de: 'Ich spreche Vietnamesisch.', vi: 'Tôi nói tiếng Việt.', ipa: '/ɪç ˈʃpʁɛçə vi̯ɛtnaˈmeːzɪʃ/' },
  { de: 'Freut mich!', vi: 'Rất vui được gặp bạn!', ipa: '/fʁɔɪ̯t mɪç/' },
];

const numbers1: Phrase[] = [
  ['null', 'số 0', '/nʊl/'], ['eins', 'số 1', '/aɪ̯ns/'], ['zwei', 'số 2', '/tsvaɪ̯/'], ['drei', 'số 3', '/dʁaɪ̯/'],
  ['vier', 'số 4', '/fiːɐ̯/'], ['fünf', 'số 5', '/fʏnf/'], ['sechs', 'số 6', '/zɛks/'], ['sieben', 'số 7', '/ˈziːbn̩/'],
  ['acht', 'số 8', '/axt/'], ['neun', 'số 9', '/nɔɪ̯n/'], ['zehn', 'số 10', '/tseːn/'], ['elf', 'số 11', '/ɛlf/'], ['zwölf', 'số 12', '/tsvœlf/'],
].map(([de, vi, ipa]) => ({ de, vi, ipa }));

const numbers2: Phrase[] = [
  ['dreizehn', 'số 13', '/ˈdʁaɪ̯tseːn/'], ['sechzehn', 'số 16', '/ˈzɛçtseːn/'], ['siebzehn', 'số 17', '/ˈziːptseːn/'],
  ['zwanzig', 'số 20', '/ˈtsvantsɪç/'], ['einundzwanzig', 'số 21', '/ˈaɪ̯nʊntˌtsvantsɪç/'], ['dreißig', 'số 30', '/ˈdʁaɪ̯sɪç/'],
  ['vierzig', 'số 40', '/ˈfɪʁtsɪç/'], ['fünfzig', 'số 50', '/ˈfʏnftsɪç/'], ['hundert', 'số 100', '/ˈhʊndɐt/'],
].map(([de, vi, ipa]) => ({ de, vi, ipa }));

const days: Phrase[] = [
  ['Montag', 'thứ Hai', '/ˈmoːntaːk/'], ['Dienstag', 'thứ Ba', '/ˈdiːnstaːk/'], ['Mittwoch', 'thứ Tư', '/ˈmɪtvɔx/'],
  ['Donnerstag', 'thứ Năm', '/ˈdɔnɐstaːk/'], ['Freitag', 'thứ Sáu', '/ˈfʁaɪ̯taːk/'], ['Samstag', 'thứ Bảy', '/ˈzamstaːk/'],
  ['Sonntag', 'Chủ nhật', '/ˈzɔntaːk/'],
].map(([de, vi, ipa]) => ({ de: `der ${de}`, vi, ipa }));

const months: Phrase[] = [
  ['Januar', 'tháng Một', '/ˈjanuaːɐ̯/'], ['Februar', 'tháng Hai', '/ˈfeːbʁuaːɐ̯/'], ['März', 'tháng Ba', '/mɛʁts/'],
  ['April', 'tháng Tư', '/aˈpʁɪl/'], ['Mai', 'tháng Năm', '/maɪ̯/'], ['Juni', 'tháng Sáu', '/ˈjuːni/'],
  ['Juli', 'tháng Bảy', '/ˈjuːli/'], ['August', 'tháng Tám', '/aʊ̯ˈɡʊst/'], ['September', 'tháng Chín', '/zɛpˈtɛmbɐ/'],
  ['Oktober', 'tháng Mười', '/ɔkˈtoːbɐ/'], ['November', 'tháng Mười Một', '/noˈvɛmbɐ/'], ['Dezember', 'tháng Mười Hai', '/deˈtsɛmbɐ/'],
].map(([de, vi, ipa]) => ({ de: `der ${de}`, vi, ipa }));

const questions: Phrase[] = [
  { de: 'Wie heißt du?', vi: 'Bạn tên là gì?', ipa: '/viː haɪ̯st duː/' },
  { de: 'Woher kommst du?', vi: 'Bạn đến từ đâu?', ipa: '/voˈheːɐ̯ kɔmst duː/' },
  { de: 'Wo wohnst du?', vi: 'Bạn sống ở đâu?', ipa: '/voː voːnst duː/' },
  { de: 'Wie alt bist du?', vi: 'Bạn bao nhiêu tuổi?', ipa: '/viː alt bɪst duː/' },
  { de: 'Was machst du?', vi: 'Bạn làm nghề gì / đang làm gì?', ipa: '/vas maxst duː/' },
  { de: 'Sprechen Sie Englisch?', vi: 'Ông/bà có nói tiếng Anh không?', ipa: '/ˈʃpʁɛçn̩ ziː ˈɛŋlɪʃ/' },
  { de: 'Wie viel kostet das?', vi: 'Cái này giá bao nhiêu?', ipa: '/viː fiːl ˈkɔstət das/' },
  { de: 'Wie spät ist es?', vi: 'Mấy giờ rồi?', ipa: '/viː ʃpɛːt ɪst ɛs/' },
];

const minimalPairs: Phrase[] = [
  { de: 'Staat – Stadt', vi: 'nhà nước – thành phố', note: 'a dài / a ngắn' },
  { de: 'Miete – Mitte', vi: 'tiền thuê nhà – ở giữa', note: 'i dài / i ngắn' },
  { de: 'Ofen – offen', vi: 'cái lò – mở', note: 'o dài / o ngắn' },
  { de: 'schon – schön', vi: 'đã rồi – đẹp', note: 'o / ö' },
  { de: 'Mutter – Mütter', vi: 'mẹ – những người mẹ', note: 'u / ü' },
];

export const lessons: Lesson[] = [
  {
    id: 'alphabet', level: 'A0', order: 1, title: 'Bảng chữ cái tiếng Đức', titleDe: 'Das Alphabet', icon: '🔤', minutes: 10,
    description: '26 chữ cái cơ bản, cách đọc tên chữ và một từ ví dụ cho mỗi chữ.',
    steps: [
      { type: 'intro', title: 'Bảng chữ cái – nền móng đầu tiên', body: 'Tiếng Đức dùng bảng chữ cái Latinh giống tiếng Việt, cộng thêm 4 chữ đặc biệt: Ä, Ö, Ü và ß. Tin vui: tiếng Đức đọc gần như đúng như viết!', why: 'Bạn sẽ cần đánh vần tên, địa chỉ và email – ví dụ khi gọi điện hay làm thủ tục ở Đức.' },
      { type: 'letters', title: 'A đến M', letters: 'ABCDEFGHIJKLM'.split('') },
      { type: 'letters', title: 'N đến Z', letters: 'NOPQRSTUVWXYZ'.split('') },
      { type: 'tip', title: 'Những chữ dễ nhầm', body: 'J đọc là "i-ốt", V đọc là "phau", W đọc là "vê", Z đọc là "tset". Khi đánh vần, người Đức hay nói: "A wie Anton, B wie Berta…"' },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 5 },
    ],
  },
  {
    id: 'umlauts', level: 'A0', order: 2, title: 'Ä Ö Ü và ß', titleDe: 'Umlaute und Eszett', icon: '✨', minutes: 8,
    description: 'Bốn chữ cái đặc biệt chỉ có trong tiếng Đức.',
    steps: [
      { type: 'intro', title: 'Umlaut là gì?', body: 'Hai dấu chấm trên a, o, u gọi là Umlaut – chúng thay đổi hoàn toàn cách đọc. ß (Eszett) là "s" sắc. Nếu bàn phím không có, bạn có thể viết ae, oe, ue và ss.', why: 'Umlaut làm thay đổi nghĩa: schon (đã) ≠ schön (đẹp).' },
      { type: 'letters', title: 'Bốn chữ đặc biệt', letters: ['Ä', 'Ö', 'Ü', 'ß'] },
      { type: 'sounds', title: 'Luyện âm', soundIds: ['ae', 'oe', 'ue'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 4 },
    ],
  },
  {
    id: 'pronunciation-basics', level: 'A0', order: 3, title: 'Phát âm tiếng Đức', titleDe: 'Aussprache', icon: '🗣️', minutes: 10,
    description: 'Quy tắc vàng: đọc như viết, nhấn âm tiết đầu.',
    steps: [
      { type: 'intro', title: '3 quy tắc vàng', body: '1) Tiếng Đức đọc gần như đúng như viết. 2) Trọng âm thường rơi vào âm tiết đầu tiên: ˈArbeit, ˈMutter. 3) Phụ âm cuối b, d, g đọc thành p, t, k: Tag → "tak".', why: 'Nắm vững quy tắc giúp bạn đọc được cả những từ chưa từng gặp.' },
      { type: 'sounds', title: 'Những chữ đọc khác tiếng Việt', soundIds: ['w', 'v', 'z'] },
      { type: 'tip', title: 'Mẹo cho người Việt', body: 'Tiếng Việt có thanh điệu, tiếng Đức thì không. Đừng thêm dấu vào từ tiếng Đức – hãy đọc đều giọng, nhưng nhấn mạnh âm tiết có trọng âm.' },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 4 },
    ],
  },
  {
    id: 'vowels', level: 'A0', order: 4, title: 'Nguyên âm', titleDe: 'Vokale', icon: '🅰️', minutes: 8,
    description: 'Nguyên âm dài, nguyên âm ngắn và cách phân biệt.',
    steps: [
      { type: 'intro', title: 'Dài hay ngắn?', body: 'Độ dài nguyên âm có thể thay đổi nghĩa của từ. Nguyên âm dài khi: viết đôi (Staat), có h theo sau (Sohn), hoặc chỉ một phụ âm theo sau (Name).' },
      { type: 'sounds', title: 'Nguyên âm quan trọng', soundIds: ['long-short', 'ae', 'oe', 'ue'] },
      { type: 'phrases', title: 'Cặp từ tối thiểu', items: minimalPairs },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 4 },
    ],
  },
  {
    id: 'consonants', level: 'A0', order: 5, title: 'Phụ âm', titleDe: 'Konsonanten', icon: '🔠', minutes: 10,
    description: 'R, CH, Z, W, V – những phụ âm người Việt hay đọc sai.',
    steps: [
      { type: 'intro', title: 'Phụ âm khó', body: 'Phần lớn phụ âm tiếng Đức giống tiếng Việt. Bài này tập trung vào những âm khác biệt nhất.' },
      { type: 'sounds', title: 'Luyện từng âm', soundIds: ['r', 'ch-ich', 'ch-ach', 'z', 'w', 'v'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 5 },
    ],
  },
  {
    id: 'special-sounds', level: 'A0', order: 6, title: 'Âm đặc biệt', titleDe: 'Besondere Laute', icon: '🎵', minutes: 10,
    description: 'sch, sp, st, ei, ie, eu – tổ hợp chữ cái tạo âm mới.',
    steps: [
      { type: 'intro', title: 'Nhiều chữ – một âm', body: 'Trong tiếng Đức, một số tổ hợp chữ cái chỉ tạo thành một âm. Nhớ các tổ hợp này, bạn sẽ đọc đúng phần lớn từ vựng A1.' },
      { type: 'sounds', title: 'Tổ hợp phụ âm', soundIds: ['sch', 'sp', 'st'] },
      { type: 'sounds', title: 'Nguyên âm đôi', soundIds: ['ei', 'ie', 'eu'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 5 },
    ],
  },
  {
    id: 'greetings', level: 'A0', order: 7, title: 'Chào hỏi', titleDe: 'Begrüßung', icon: '👋', minutes: 8,
    description: 'Chào buổi sáng, hỏi thăm sức khỏe và tạm biệt.',
    steps: [
      { type: 'intro', title: 'Lời chào đầu tiên', body: 'Người Đức rất coi trọng việc chào hỏi. Khi vào cửa hàng, thang máy hay phòng chờ bác sĩ, hãy nói "Guten Tag" hoặc "Hallo".', why: 'Đây là những câu bạn sẽ dùng hằng ngày từ lúc đặt chân đến Đức.' },
      { type: 'phrases', title: 'Câu chào thông dụng', items: greetings },
      { type: 'tip', title: 'du hay Sie?', body: '"du" (bạn) dùng với bạn bè, gia đình, trẻ em. "Sie" (ông/bà/anh/chị – lịch sự) dùng với người lạ, đồng nghiệp mới, nhân viên. Khi không chắc, hãy dùng "Sie".' },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 5 },
    ],
  },
  {
    id: 'introduce', level: 'A0', order: 8, title: 'Giới thiệu bản thân', titleDe: 'Sich vorstellen', icon: '🙋', minutes: 10,
    description: 'Nói tên, quê quán, nơi ở, tuổi và nghề nghiệp.',
    steps: [
      { type: 'intro', title: 'Xin chào, tôi là…', body: 'Chỉ với 5–6 câu, bạn có thể tự giới thiệu trong lớp học, ở chỗ làm hay khi gặp hàng xóm.' },
      { type: 'phrases', title: 'Mẫu câu giới thiệu', items: introduce },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-heisse', 's-komme-aus'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 5 },
    ],
  },
  {
    id: 'numbers', level: 'A0', order: 9, title: 'Số đếm', titleDe: 'Zahlen', icon: '🔢', minutes: 12,
    description: 'Đếm từ 0 đến 100 – và bí mật của số "ngược".',
    steps: [
      { type: 'intro', title: 'Đếm bằng tiếng Đức', body: 'Số đếm dùng ở khắp nơi: giá tiền, số điện thoại, giờ giấc, địa chỉ.' },
      { type: 'phrases', title: 'Từ 0 đến 12', items: numbers1 },
      { type: 'phrases', title: 'Từ 13 đến 100', items: numbers2 },
      { type: 'tip', title: 'Số "ngược"', body: 'Từ 21 trở đi, tiếng Đức đọc hàng đơn vị trước: 21 = einundzwanzig (một-và-hai mươi). 35 = fünfunddreißig. Hãy luyện điều này thật kỹ!' },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'days-months', level: 'A0', order: 10, title: 'Ngày và tháng', titleDe: 'Tage und Monate', icon: '📅', minutes: 10,
    description: 'Các ngày trong tuần và 12 tháng trong năm.',
    steps: [
      { type: 'intro', title: 'Lịch tiếng Đức', body: 'Tất cả các ngày và tháng đều dùng mạo từ "der". Tuần ở Đức bắt đầu từ thứ Hai (Montag).' },
      { type: 'phrases', title: 'Ngày trong tuần', items: days },
      { type: 'phrases', title: 'Tháng trong năm', items: months },
      { type: 'tip', title: 'am và im', body: 'Với ngày dùng "am": am Montag (vào thứ Hai). Với tháng dùng "im": im Mai (vào tháng Năm).' },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'basic-questions', level: 'A0', order: 11, title: 'Câu hỏi cơ bản', titleDe: 'Einfache Fragen', icon: '❓', minutes: 10,
    description: 'W-Fragen: wie, wo, woher, was, wie viel.',
    steps: [
      { type: 'intro', title: 'Hỏi để giao tiếp', body: 'Hầu hết từ để hỏi tiếng Đức bắt đầu bằng W: wer (ai), was (cái gì), wo (ở đâu), woher (từ đâu), wie (như thế nào).' },
      { type: 'phrases', title: 'Câu hỏi thông dụng', items: questions },
      { type: 'builder', title: 'Ghép câu hỏi', sentenceIds: ['s-wie-heisst', 's-woher'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 5 },
    ],
  },
  {
    id: 'basic-sentences', level: 'A0', order: 12, title: 'Câu đơn giản', titleDe: 'Einfache Sätze', icon: '🧩', minutes: 12,
    description: 'Quy tắc vàng: động từ luôn ở vị trí thứ 2.',
    steps: [
      { type: 'intro', title: 'Động từ ở vị trí số 2', body: 'Trong câu trần thuật, động từ chia luôn đứng ở vị trí thứ hai. Nếu câu bắt đầu bằng thời gian (Heute), chủ ngữ sẽ đứng sau động từ: "Heute lerne ich Deutsch."', why: 'Đây là quy tắc quan trọng nhất của ngữ pháp tiếng Đức.' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-lerne-heute', 's-heute-lerne', 's-er-ist', 's-zug', 's-kein-kaffee'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 5 },
    ],
  },
];
