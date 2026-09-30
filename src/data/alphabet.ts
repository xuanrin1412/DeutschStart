import type { AlphabetLetter } from '@/types/models';

type Row = [letter: string, name: string, nameIpa: string, word: string, wordIpa: string, emoji: string, meaning: string, example: string, exampleVi: string, tip?: string];

const rows: Row[] = [
  ['A', 'a', '/aː/', 'der Apfel', '/ˈapfəl/', '🍎', 'quả táo', 'Der Apfel ist rot.', 'Quả táo màu đỏ.'],
  ['B', 'be', '/beː/', 'das Buch', '/buːx/', '📖', 'quyển sách', 'Das Buch ist neu.', 'Quyển sách còn mới.'],
  ['C', 'tse', '/tseː/', 'das Café', '/kaˈfeː/', '☕', 'quán cà phê', 'Das Café ist klein.', 'Quán cà phê nhỏ.', 'Tên chữ đọc là "tsê". Chữ C ít khi đứng một mình – thường nằm trong "ch", "sch", "ck". Trong từ mượn, C đọc là "k" (Café).'],
  ['D', 'de', '/deː/', 'der Drache', '/ˈdʁaxə/', '🐉', 'con rồng', 'Der Drache fliegt.', 'Con rồng đang bay.', 'Ở cuối từ, D đọc gần như T: "Hund" (con chó) → "hunt".'],
  ['E', 'e', '/eː/', 'der Elefant', '/eleˈfant/', '🐘', 'con voi', 'Der Elefant ist groß.', 'Con voi rất to.', 'E dài đọc như "ê" kéo dài. E ở cuối từ (Lampe) đọc nhẹ như "ơ".'],
  ['F', 'ef', '/ɛf/', 'der Fisch', '/fɪʃ/', '🐟', 'con cá', 'Der Fisch schwimmt.', 'Con cá bơi.'],
  ['G', 'ge', '/ɡeː/', 'die Gabel', '/ˈɡaːbəl/', '🍴', 'cái nĩa', 'Die Gabel liegt auf dem Tisch.', 'Cái nĩa nằm trên bàn.', 'G luôn đọc cứng như "g" trong "ga", không đọc như "gi".'],
  ['H', 'ha', '/haː/', 'das Haus', '/haʊ̯s/', '🏠', 'ngôi nhà', 'Das Haus ist groß.', 'Ngôi nhà to.', 'H đầu từ đọc như "h" tiếng Việt. H sau nguyên âm thì câm và làm nguyên âm dài ra: "sehr" → "zê-ơ".'],
  ['I', 'i', '/iː/', 'der Igel', '/ˈiːɡəl/', '🦔', 'con nhím', 'Der Igel ist klein.', 'Con nhím nhỏ.'],
  ['J', 'jot', '/jɔt/', 'die Jacke', '/ˈjakə/', '🧥', 'áo khoác', 'Die Jacke ist warm.', 'Áo khoác ấm.', 'J đọc như "i" / "d" giọng miền Nam ("da" → "ja"), KHÔNG đọc như "j" tiếng Anh.'],
  ['K', 'ka', '/kaː/', 'die Katze', '/ˈkatsə/', '🐱', 'con mèo', 'Die Katze schläft.', 'Con mèo đang ngủ.'],
  ['L', 'el', '/ɛl/', 'die Lampe', '/ˈlampə/', '💡', 'cái đèn', 'Die Lampe ist hell.', 'Cái đèn sáng.'],
  ['M', 'em', '/ɛm/', 'die Milch', '/mɪlç/', '🥛', 'sữa', 'Die Milch ist kalt.', 'Sữa lạnh.'],
  ['N', 'en', '/ɛn/', 'die Nase', '/ˈnaːzə/', '👃', 'cái mũi', 'Die Nase ist rot.', 'Cái mũi đỏ.'],
  ['O', 'o', '/oː/', 'die Oma', '/ˈoːma/', '👵', 'bà', 'Meine Oma ist nett.', 'Bà tôi rất hiền.'],
  ['P', 'pe', '/peː/', 'die Pizza', '/ˈpɪtsa/', '🍕', 'bánh pizza', 'Die Pizza ist heiß.', 'Bánh pizza còn nóng.', 'P tiếng Đức bật hơi mạnh, giống "p" trong "pin" tiếng Anh.'],
  ['Q', 'ku', '/kuː/', 'die Qualle', '/ˈkvalə/', '🪼', 'con sứa', 'Die Qualle lebt im Meer.', 'Con sứa sống ở biển.', 'Q luôn đi với U và đọc là "kv": Qualle → "kva-lơ".'],
  ['R', 'er', '/ɛʁ/', 'die Rose', '/ˈʁoːzə/', '🌹', 'hoa hồng', 'Die Rose ist schön.', 'Hoa hồng rất đẹp.', 'R tiếng Đức phát ra từ cuống họng, gần giống âm "gờ" khi súc miệng nhẹ. Ở cuối từ (-er), R gần như thành "ơ/a": Lehrer → "lê-rơ".'],
  ['S', 'es', '/ɛs/', 'die Sonne', '/ˈzɔnə/', '☀️', 'mặt trời', 'Die Sonne scheint.', 'Mặt trời chiếu sáng.', 'S đứng trước nguyên âm đọc như "z" (gần "d" miền Bắc): Sonne → "zon-nơ".'],
  ['T', 'te', '/teː/', 'die Tomate', '/toˈmaːtə/', '🍅', 'quả cà chua', 'Die Tomate ist rot.', 'Quả cà chua màu đỏ.', 'T bật hơi như "th" tiếng Việt.'],
  ['U', 'u', '/uː/', 'die Uhr', '/uːɐ̯/', '⌚', 'đồng hồ', 'Die Uhr ist teuer.', 'Cái đồng hồ đắt.'],
  ['V', 'fau', '/faʊ̯/', 'der Vogel', '/ˈfoːɡəl/', '🐦', 'con chim', 'Der Vogel singt.', 'Con chim hót.', 'V thường đọc như "ph" (F): Vogel → "phô-gơl". Trong từ mượn thì đọc "v": Vase.'],
  ['W', 've', '/veː/', 'das Wasser', '/ˈvasɐ/', '💧', 'nước', 'Das Wasser ist kalt.', 'Nước lạnh.', 'W đọc như "v" tiếng Việt: Wasser → "va-xơ".'],
  ['X', 'iks', '/ɪks/', 'das Xylofon', '/ksyloˈfoːn/', '🎶', 'đàn mộc cầm', 'Das Xylofon ist bunt.', 'Cây đàn mộc cầm nhiều màu.', 'X đọc là "ks".'],
  ['Y', 'üpsilon', '/ˈʏpsilɔn/', 'das Yoga', '/ˈjoːɡa/', '🧘', 'yoga', 'Ich mache jeden Tag Yoga.', 'Tôi tập yoga mỗi ngày.', 'Trong từ gốc Đức, Y đọc như "ü" (Typ). Trong từ mượn đầu từ, đọc như "i" (Yoga).'],
  ['Z', 'tset', '/tsɛt/', 'der Zug', '/tsuːk/', '🚆', 'tàu hỏa', 'Der Zug kommt.', 'Tàu đang đến.', 'Z đọc là "ts" – không phải "z" tiếng Anh: Zug → "tsuk".'],
  ['Ä', 'ä', '/ɛː/', 'der Käse', '/ˈkɛːzə/', '🧀', 'phô mai', 'Der Käse ist lecker.', 'Phô mai rất ngon.', 'Ä đọc gần như "e" tiếng Việt (mở miệng hơn "ê"). Käse → "ke-zơ".'],
  ['Ö', 'ö', '/øː/', 'der Löwe', '/ˈløːvə/', '🦁', 'con sư tử', 'Der Löwe ist stark.', 'Con sư tử rất khỏe.', 'Ö: tròn môi như nói "ô" nhưng lưỡi đặt như nói "ê". Không có âm này trong tiếng Việt – hãy luyện nhiều!'],
  ['Ü', 'ü', '/yː/', 'die Tür', '/tyːɐ̯/', '🚪', 'cánh cửa', 'Die Tür ist offen.', 'Cửa đang mở.', 'Ü: chu môi tròn như nói "u" nhưng lưỡi đặt như nói "i". Giữ môi tròn trong suốt âm.'],
  ['ß', 'eszett', '/ɛsˈtsɛt/', 'die Straße', '/ˈʃtʁaːsə/', '🛣️', 'con đường', 'Die Straße ist lang.', 'Con đường dài.', 'ß (Eszett) luôn đọc là "s" rõ, không bao giờ đọc "z". Xuất hiện sau nguyên âm dài: Straße, groß.'],
];

// TTS reads `name` as a German word and guesses: "tse" comes out as a short "tsə", "er" as the pronoun /eːɐ̯/.
// These spellings force the right vowel: "eh" = long e (like Reh, Zeh), doubled consonant = short e (like Bett).
const spoken: Record<string, string> = {
  B: 'Beh', C: 'Zeh', D: 'Deh', F: 'Eff', G: 'Geh', H: 'Hah', J: 'Jott', K: 'Kah', L: 'Ell', M: 'Emm', N: 'Enn',
  P: 'Peh', Q: 'Kuh', R: 'Err', S: 'Ess', T: 'Teh', V: 'Fau', W: 'Weh', X: 'Iks', Y: 'Ypsilon', Z: 'Zett', ß: 'Eszett',
};

export const alphabet: AlphabetLetter[] = rows.map(([letter, name, nameIpa, word, wordIpa, emoji, meaning, example, exampleVi, tip]) => ({
  letter,
  name,
  speak: spoken[letter] ?? name,
  nameIpa,
  word,
  wordIpa,
  image: { emoji, alt: meaning },
  meaning,
  example,
  exampleVi,
  tip,
  special: ['Ä', 'Ö', 'Ü', 'ß'].includes(letter),
}));
