import type { Article, CefrLevel, Difficulty, Vocabulary, WordType } from '@/types/models';

/** Compact row format → keeps the data file readable. Add new words here. */
type Row = [
  id: string,
  article: Article | '',
  word: string,
  plural: string,
  type: WordType,
  ipa: string,
  meaning: string,
  emoji: string,
  example: string,
  exampleVi: string,
  topicId: string,
  level: CefrLevel,
  difficulty: Difficulty,
  articleHint?: string,
];

const rows: Row[] = [
  // Greetings
  ['hallo', '', 'Hallo', '', 'interjection', '/haˈloː/', 'xin chào', '👋', 'Hallo, ich bin Minh.', 'Xin chào, tôi là Minh.', 'greetings', 'A1', 1],
  ['danke', '', 'Danke', '', 'interjection', '/ˈdaŋkə/', 'cảm ơn', '🙏', 'Danke für die Hilfe!', 'Cảm ơn vì đã giúp đỡ!', 'greetings', 'A1', 1],
  ['bitte', '', 'Bitte', '', 'interjection', '/ˈbɪtə/', 'làm ơn / không có gì', '😊', 'Ein Wasser, bitte.', 'Cho tôi một chai nước.', 'greetings', 'A1', 1],
  ['tschuess', '', 'Tschüss', '', 'interjection', '/tʃʏs/', 'tạm biệt (thân mật)', '🤚', 'Tschüss, bis morgen!', 'Tạm biệt, hẹn mai gặp!', 'greetings', 'A1', 1],

  // Family
  ['mutter', 'die', 'Mutter', 'die Mütter', 'noun', '/ˈmʊtɐ/', 'mẹ', '👩', 'Meine Mutter heißt Lan.', 'Mẹ tôi tên là Lan.', 'family', 'A1', 1, 'Người nữ thường dùng "die": die Mutter, die Frau, die Schwester.'],
  ['vater', 'der', 'Vater', 'die Väter', 'noun', '/ˈfaːtɐ/', 'bố', '👨', 'Mein Vater arbeitet in Hanoi.', 'Bố tôi làm việc ở Hà Nội.', 'family', 'A1', 1, 'Người nam thường dùng "der": der Vater, der Mann, der Bruder.'],
  ['kind', 'das', 'Kind', 'die Kinder', 'noun', '/kɪnt/', 'đứa trẻ', '🧒', 'Das Kind spielt im Garten.', 'Đứa trẻ chơi trong vườn.', 'family', 'A1', 1, '"Kind" là trung tính: das Kind – không phân biệt trai hay gái.'],
  ['bruder', 'der', 'Bruder', 'die Brüder', 'noun', '/ˈbʁuːdɐ/', 'anh / em trai', '👦', 'Ich habe einen Bruder.', 'Tôi có một anh trai.', 'family', 'A1', 1, 'Người nam → der.'],
  ['schwester', 'die', 'Schwester', 'die Schwestern', 'noun', '/ˈʃvɛstɐ/', 'chị / em gái', '👩‍🦱', 'Meine Schwester ist Studentin.', 'Chị gái tôi là sinh viên.', 'family', 'A1', 2, 'Người nữ → die.'],
  ['maedchen', 'das', 'Mädchen', 'die Mädchen', 'noun', '/ˈmɛːtçən/', 'cô bé', '👧', 'Das Mädchen liest ein Buch.', 'Cô bé đọc một quyển sách.', 'family', 'A1', 2, 'Mọi danh từ tận cùng bằng "-chen" đều là "das" – kể cả das Mädchen!'],

  // Home
  ['haus', 'das', 'Haus', 'die Häuser', 'noun', '/haʊ̯s/', 'ngôi nhà', '🏠', 'Das Haus ist groß.', 'Ngôi nhà rất to.', 'home', 'A1', 1],
  ['tisch', 'der', 'Tisch', 'die Tische', 'noun', '/tɪʃ/', 'cái bàn', '', 'Der Tisch ist aus Holz.', 'Cái bàn làm bằng gỗ.', 'home', 'A1', 1, 'Không có quy tắc rõ ràng – hãy học thuộc cả cụm "der Tisch".'],
  ['stuhl', 'der', 'Stuhl', 'die Stühle', 'noun', '/ʃtuːl/', 'cái ghế', '🪑', 'Der Stuhl steht am Tisch.', 'Cái ghế ở cạnh bàn.', 'home', 'A1', 1],
  ['bett', 'das', 'Bett', 'die Betten', 'noun', '/bɛt/', 'cái giường', '🛏️', 'Das Bett ist sehr bequem.', 'Cái giường rất êm.', 'home', 'A1', 1],
  ['tuer', 'die', 'Tür', 'die Türen', 'noun', '/tyːɐ̯/', 'cánh cửa', '🚪', 'Die Tür ist offen.', 'Cửa đang mở.', 'home', 'A1', 2],
  ['lampe', 'die', 'Lampe', 'die Lampen', 'noun', '/ˈlampə/', 'cái đèn', '💡', 'Die Lampe ist hell.', 'Cái đèn sáng.', 'home', 'A1', 1, 'Nhiều danh từ tận cùng bằng "-e" là "die": die Lampe, die Tasche, die Schule.'],

  // Food
  ['apfel', 'der', 'Apfel', 'die Äpfel', 'noun', '/ˈapfəl/', 'quả táo', '🍎', 'Ich esse einen Apfel.', 'Tôi ăn một quả táo.', 'food', 'A1', 1],
  ['brot', 'das', 'Brot', 'die Brote', 'noun', '/bʁoːt/', 'bánh mì', '🍞', 'Das Brot ist frisch.', 'Bánh mì còn mới.', 'food', 'A1', 1],
  ['wasser', 'das', 'Wasser', '', 'noun', '/ˈvasɐ/', 'nước', '💧', 'Ich trinke jeden Tag Wasser.', 'Tôi uống nước mỗi ngày.', 'food', 'A1', 1],
  ['kaffee', 'der', 'Kaffee', 'die Kaffees', 'noun', '/ˈkafe/', 'cà phê', '☕', 'Ich möchte einen Kaffee, bitte.', 'Cho tôi một ly cà phê.', 'food', 'A1', 1, 'Đồ uống thường là "der": der Kaffee, der Tee, der Saft (trừ das Wasser, das Bier).'],
  ['milch', 'die', 'Milch', '', 'noun', '/mɪlç/', 'sữa', '🥛', 'Die Milch ist kalt.', 'Sữa lạnh.', 'food', 'A1', 2],
  ['kaese', 'der', 'Käse', 'die Käse', 'noun', '/ˈkɛːzə/', 'phô mai', '🧀', 'Der Käse kommt aus der Schweiz.', 'Phô mai này đến từ Thụy Sĩ.', 'food', 'A1', 2, 'Ngoại lệ: tận cùng "-e" nhưng là "der Käse".'],
  ['ei', 'das', 'Ei', 'die Eier', 'noun', '/aɪ̯/', 'quả trứng', '🥚', 'Ich esse ein Ei zum Frühstück.', 'Tôi ăn một quả trứng vào bữa sáng.', 'food', 'A1', 1],
  ['banane', 'die', 'Banane', 'die Bananen', 'noun', '/baˈnaːnə/', 'quả chuối', '🍌', 'Die Banane ist gelb.', 'Quả chuối màu vàng.', 'food', 'A1', 1, 'Tận cùng "-e" → thường là "die".'],

  // Shopping
  ['geld', 'das', 'Geld', '', 'noun', '/ɡɛlt/', 'tiền', '💶', 'Ich habe kein Geld dabei.', 'Tôi không mang theo tiền.', 'shopping', 'A1', 1],
  ['supermarkt', 'der', 'Supermarkt', 'die Supermärkte', 'noun', '/ˈzuːpɐˌmaʁkt/', 'siêu thị', '🛒', 'Der Supermarkt öffnet um acht Uhr.', 'Siêu thị mở cửa lúc tám giờ.', 'shopping', 'A1', 2, 'Từ ghép lấy mạo từ của từ cuối: der Markt → der Supermarkt.'],
  ['tasche', 'die', 'Tasche', 'die Taschen', 'noun', '/ˈtaʃə/', 'cái túi', '👜', 'Die Tasche ist schwer.', 'Cái túi nặng.', 'shopping', 'A1', 1, 'Tận cùng "-e" → thường là "die".'],
  ['kaufen', '', 'kaufen', '', 'verb', '/ˈkaʊ̯fn̩/', 'mua', '🛍️', 'Ich kaufe Brot im Supermarkt.', 'Tôi mua bánh mì ở siêu thị.', 'shopping', 'A1', 1],

  // Transport
  ['zug', 'der', 'Zug', 'die Züge', 'noun', '/tsuːk/', 'tàu hỏa', '🚆', 'Der Zug kommt um acht Uhr.', 'Tàu đến lúc tám giờ.', 'transport', 'A1', 1],
  ['auto', 'das', 'Auto', 'die Autos', 'noun', '/ˈaʊ̯to/', 'ô tô', '🚗', 'Das Auto ist neu.', 'Chiếc ô tô còn mới.', 'transport', 'A1', 1],
  ['bus', 'der', 'Bus', 'die Busse', 'noun', '/bʊs/', 'xe buýt', '🚌', 'Ich fahre mit dem Bus.', 'Tôi đi bằng xe buýt.', 'transport', 'A1', 1],
  ['fahrrad', 'das', 'Fahrrad', 'die Fahrräder', 'noun', '/ˈfaːɐ̯ˌʁaːt/', 'xe đạp', '🚲', 'Mein Fahrrad ist rot.', 'Xe đạp của tôi màu đỏ.', 'transport', 'A1', 2, 'Từ ghép: fahren + das Rad → das Fahrrad.'],
  ['bahnhof', 'der', 'Bahnhof', 'die Bahnhöfe', 'noun', '/ˈbaːnˌhoːf/', 'nhà ga', '🚉', 'Wo ist der Bahnhof?', 'Nhà ga ở đâu?', 'transport', 'A1', 2, 'Từ ghép: die Bahn + der Hof → der Bahnhof (theo từ cuối).'],

  // School
  ['buch', 'das', 'Buch', 'die Bücher', 'noun', '/buːx/', 'quyển sách', '📖', 'Das Buch ist interessant.', 'Quyển sách này thú vị.', 'school', 'A1', 1],
  ['stift', 'der', 'Stift', 'die Stifte', 'noun', '/ʃtɪft/', 'cây bút', '✏️', 'Hast du einen Stift?', 'Bạn có cây bút không?', 'school', 'A1', 1],
  ['schule', 'die', 'Schule', 'die Schulen', 'noun', '/ˈʃuːlə/', 'trường học', '🏫', 'Die Schule beginnt um acht.', 'Trường bắt đầu lúc tám giờ.', 'school', 'A1', 1, 'Tận cùng "-e" → thường là "die".'],
  ['lehrer', 'der', 'Lehrer', 'die Lehrer', 'noun', '/ˈleːʁɐ/', 'thầy giáo', '👨‍🏫', 'Der Lehrer erklärt die Grammatik.', 'Thầy giáo giải thích ngữ pháp.', 'school', 'A1', 1, 'Nghề nghiệp nam tận cùng "-er" → der. Nữ: die Lehrerin.'],
  ['lernen', '', 'lernen', '', 'verb', '/ˈlɛʁnən/', 'học', '🧠', 'Ich lerne jeden Tag Deutsch.', 'Tôi học tiếng Đức mỗi ngày.', 'school', 'A1', 1],

  // Work
  ['arbeit', 'die', 'Arbeit', 'die Arbeiten', 'noun', '/ˈaʁbaɪ̯t/', 'công việc', '💼', 'Die Arbeit beginnt um neun Uhr.', 'Công việc bắt đầu lúc chín giờ.', 'work', 'A1', 1],
  ['computer', 'der', 'Computer', 'die Computer', 'noun', '/kɔmˈpjuːtɐ/', 'máy tính', '💻', 'Der Computer ist sehr schnell.', 'Máy tính rất nhanh.', 'work', 'A1', 1],
  ['arbeiten', '', 'arbeiten', '', 'verb', '/ˈaʁbaɪ̯tn̩/', 'làm việc', '👷', 'Ich arbeite in Berlin.', 'Tôi làm việc ở Berlin.', 'work', 'A1', 1],
  ['kollege', 'der', 'Kollege', 'die Kollegen', 'noun', '/kɔˈleːɡə/', 'đồng nghiệp (nam)', '🧑‍💼', 'Mein Kollege kommt aus Hamburg.', 'Đồng nghiệp của tôi đến từ Hamburg.', 'work', 'A2', 2, 'Người nam → der, dù tận cùng bằng "-e". Nữ: die Kollegin.'],

  // Time
  ['uhr', 'die', 'Uhr', 'die Uhren', 'noun', '/uːɐ̯/', 'đồng hồ; giờ', '⌚', 'Es ist drei Uhr.', 'Bây giờ là ba giờ.', 'time', 'A1', 1],
  ['tag', 'der', 'Tag', 'die Tage', 'noun', '/taːk/', 'ngày', '📅', 'Der Tag ist lang.', 'Một ngày dài.', 'time', 'A1', 1, 'Ngày, tháng, mùa đều là "der": der Montag, der Mai, der Winter.'],
  ['woche', 'die', 'Woche', 'die Wochen', 'noun', '/ˈvɔxə/', 'tuần', '🗓️', 'Die Woche hat sieben Tage.', 'Một tuần có bảy ngày.', 'time', 'A1', 1, 'Tận cùng "-e" → thường là "die".'],
  ['heute', '', 'heute', '', 'adverb', '/ˈhɔɪ̯tə/', 'hôm nay', '📆', 'Heute ist Montag.', 'Hôm nay là thứ Hai.', 'time', 'A1', 1],

  // Weather
  ['sonne', 'die', 'Sonne', 'die Sonnen', 'noun', '/ˈzɔnə/', 'mặt trời', '☀️', 'Die Sonne scheint.', 'Mặt trời chiếu sáng.', 'weather', 'A1', 1],
  ['regen', 'der', 'Regen', '', 'noun', '/ˈʁeːɡn̩/', 'mưa', '🌧️', 'Heute gibt es viel Regen.', 'Hôm nay mưa nhiều.', 'weather', 'A1', 2, 'Hiện tượng thời tiết thường là "der": der Regen, der Schnee, der Wind.'],
  ['kalt', '', 'kalt', '', 'adjective', '/kalt/', 'lạnh', '🥶', 'Im Winter ist es kalt.', 'Vào mùa đông trời lạnh.', 'weather', 'A1', 1],

  // Clothes
  ['jacke', 'die', 'Jacke', 'die Jacken', 'noun', '/ˈjakə/', 'áo khoác', '🧥', 'Die Jacke ist warm.', 'Áo khoác này ấm.', 'clothes', 'A1', 1, 'Tận cùng "-e" → thường là "die".'],
  ['schuh', 'der', 'Schuh', 'die Schuhe', 'noun', '/ʃuː/', 'chiếc giày', '👟', 'Der Schuh ist zu klein.', 'Chiếc giày quá nhỏ.', 'clothes', 'A1', 1],
  ['hose', 'die', 'Hose', 'die Hosen', 'noun', '/ˈhoːzə/', 'quần dài', '👖', 'Die Hose ist blau.', 'Cái quần màu xanh.', 'clothes', 'A1', 1, 'Tận cùng "-e" → thường là "die".'],

  // Health
  ['arzt', 'der', 'Arzt', 'die Ärzte', 'noun', '/aːɐ̯tst/', 'bác sĩ (nam)', '👨‍⚕️', 'Ich gehe heute zum Arzt.', 'Hôm nay tôi đi khám bác sĩ.', 'health', 'A1', 2, 'Người nam → der. Nữ: die Ärztin.'],
  ['kopf', 'der', 'Kopf', 'die Köpfe', 'noun', '/kɔpf/', 'cái đầu', '🤕', 'Mein Kopf tut weh.', 'Tôi bị đau đầu.', 'health', 'A1', 2],
  ['apotheke', 'die', 'Apotheke', 'die Apotheken', 'noun', '/apoˈteːkə/', 'hiệu thuốc', '💊', 'Die Apotheke ist um die Ecke.', 'Hiệu thuốc ở ngay góc đường.', 'health', 'A1', 2, 'Tận cùng "-e" → thường là "die".'],

  // Travel
  ['koffer', 'der', 'Koffer', 'die Koffer', 'noun', '/ˈkɔfɐ/', 'va li', '🧳', 'Der Koffer ist sehr schwer.', 'Cái va li rất nặng.', 'travel', 'A1', 1],
  ['flugzeug', 'das', 'Flugzeug', 'die Flugzeuge', 'noun', '/ˈfluːkˌtsɔɪ̯k/', 'máy bay', '✈️', 'Das Flugzeug fliegt nach Berlin.', 'Máy bay bay đến Berlin.', 'travel', 'A1', 2, 'Từ ghép: der Flug + das Zeug → das Flugzeug.'],
  ['hotel', 'das', 'Hotel', 'die Hotels', 'noun', '/hoˈtɛl/', 'khách sạn', '🏨', 'Das Hotel liegt im Zentrum.', 'Khách sạn nằm ở trung tâm.', 'travel', 'A1', 1],

  // Living in Germany
  ['wohnung', 'die', 'Wohnung', 'die Wohnungen', 'noun', '/ˈvoːnʊŋ/', 'căn hộ', '🏢', 'Die Wohnung hat zwei Zimmer.', 'Căn hộ có hai phòng.', 'living', 'A1', 2, 'Tận cùng "-ung" → luôn là "die".'],
  ['anmeldung', 'die', 'Anmeldung', 'die Anmeldungen', 'noun', '/ˈanˌmɛldʊŋ/', 'đăng ký cư trú', '📝', 'Ich brauche einen Termin für die Anmeldung.', 'Tôi cần một cuộc hẹn để đăng ký cư trú.', 'living', 'A2', 3, 'Tận cùng "-ung" → luôn là "die".'],
  ['termin', 'der', 'Termin', 'die Termine', 'noun', '/tɛʁˈmiːn/', 'cuộc hẹn', '📌', 'Ich habe morgen einen Termin.', 'Ngày mai tôi có một cuộc hẹn.', 'living', 'A2', 2],
];

const TABLE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect x='6' y='18' width='52' height='8' rx='3' fill='%23b7793f'/%3E%3Crect x='11' y='26' width='6' height='26' rx='2' fill='%238a5a2b'/%3E%3Crect x='47' y='26' width='6' height='26' rx='2' fill='%238a5a2b'/%3E%3C/svg%3E";

export const vocabulary: Vocabulary[] = rows.map(
  ([id, article, word, plural, type, ipa, meaning, emoji, example, exampleVi, topicId, level, difficulty, articleHint]) => ({
    id,
    word,
    article: article || undefined,
    plural: plural || undefined,
    type,
    ipa,
    meaning,
    image: emoji ? { emoji, alt: meaning } : { url: id === 'tisch' ? TABLE_SVG : undefined, alt: meaning },
    example,
    exampleVi,
    topicId,
    level,
    difficulty,
    articleHint,
  }),
);
