import type { PronunciationSound } from '@/types/models';

export const sounds: PronunciationSound[] = [
  // ---- Vowels ----
  {
    id: 'long-short', grapheme: 'a / aa / ah', ipa: '/aː/ – /a/', title: 'Nguyên âm dài và ngắn', category: 'vowel',
    explanation: 'Tiếng Đức phân biệt nguyên âm dài và ngắn. Nguyên âm thường dài khi đứng trước "h", được viết đôi (aa, ee, oo) hoặc chỉ có một phụ âm theo sau. Nguyên âm ngắn khi có hai phụ âm theo sau (Mann, Bett).',
    mouthTip: 'Âm dài: giữ miệng lâu hơn một chút. Âm ngắn: dứt khoát, nhanh.',
    vietnameseHint: 'Giống "a" trong "ba" (dài) và "ă" trong "ăn" (ngắn).',
    examples: [
      { de: 'Name', ipa: '/ˈnaːmə/', vi: 'tên' },
      { de: 'Mann', ipa: '/man/', vi: 'người đàn ông' },
      { de: 'Staat', ipa: '/ʃtaːt/', vi: 'nhà nước' },
    ],
    mouth: { lips: 'open', tongue: 'low' },
  },
  {
    id: 'ae', grapheme: 'ä', ipa: '/ɛː/ /ɛ/', title: 'Umlaut ä', category: 'vowel',
    explanation: 'Ä đọc gần như "e" tiếng Việt – miệng mở rộng hơn "ê".',
    mouthTip: 'Mở miệng vừa phải, môi dẹt, lưỡi ở giữa.',
    vietnameseHint: 'Gần "e" trong "xe".',
    examples: [
      { de: 'Käse', ipa: '/ˈkɛːzə/', vi: 'phô mai' },
      { de: 'Äpfel', ipa: '/ˈɛpfəl/', vi: 'những quả táo' },
      { de: 'spät', ipa: '/ʃpɛːt/', vi: 'muộn' },
    ],
    mouth: { lips: 'spread', tongue: 'front-mid' },
  },
  {
    id: 'oe', grapheme: 'ö', ipa: '/øː/ /œ/', title: 'Umlaut ö', category: 'vowel',
    explanation: 'Ö không có trong tiếng Việt. Hãy nói "ê" rồi từ từ tròn môi lại như nói "ô" – giữ nguyên vị trí lưỡi.',
    mouthTip: 'Lưỡi như "ê", môi tròn như "ô".',
    vietnameseHint: 'Khoảng giữa "ê" và "ô".',
    examples: [
      { de: 'schön', ipa: '/ʃøːn/', vi: 'đẹp' },
      { de: 'Löwe', ipa: '/ˈløːvə/', vi: 'sư tử' },
      { de: 'können', ipa: '/ˈkœnən/', vi: 'có thể' },
    ],
    mouth: { lips: 'rounded', tongue: 'front-mid' },
  },
  {
    id: 'ue', grapheme: 'ü', ipa: '/yː/ /ʏ/', title: 'Umlaut ü', category: 'vowel',
    explanation: 'Ü cũng không có trong tiếng Việt. Nói "i" thật dài, rồi chu môi tròn như khi nói "u" – lưỡi vẫn giữ ở vị trí "i".',
    mouthTip: 'Lưỡi như "i", môi chu tròn như "u".',
    vietnameseHint: 'Nói "i" với môi tròn.',
    examples: [
      { de: 'Tür', ipa: '/tyːɐ̯/', vi: 'cánh cửa' },
      { de: 'müde', ipa: '/ˈmyːdə/', vi: 'mệt' },
      { de: 'fünf', ipa: '/fʏnf/', vi: 'số năm' },
    ],
    mouth: { lips: 'rounded', tongue: 'front-high' },
  },

  // ---- Consonants ----
  {
    id: 'ch-ich', grapheme: 'ch (ich)', ipa: '/ç/', title: 'Ich-Laut', category: 'consonant',
    explanation: 'Sau e, i, ä, ö, ü, ei, eu và sau l, n, r: "ch" là một âm xì nhẹ, như tiếng mèo "khè" rất khẽ. Không đọc thành "ch" tiếng Việt!',
    mouthTip: 'Đặt lưỡi như nói "i", rồi thổi hơi qua khe hẹp giữa lưỡi và vòm miệng.',
    vietnameseHint: 'Giống âm "h" rất bẹt khi nói "hì".',
    examples: [
      { de: 'ich', ipa: '/ɪç/', vi: 'tôi' },
      { de: 'Milch', ipa: '/mɪlç/', vi: 'sữa' },
      { de: 'Mädchen', ipa: '/ˈmɛːtçən/', vi: 'cô bé' },
    ],
    mouth: { lips: 'spread', tongue: 'front-high' },
  },
  {
    id: 'ch-ach', grapheme: 'ch (ach)', ipa: '/x/', title: 'Ach-Laut', category: 'consonant',
    explanation: 'Sau a, o, u, au: "ch" đọc như "kh" tiếng Việt – hơi cọ xát ở phía sau cổ họng.',
    mouthTip: 'Nâng phần sau lưỡi lên gần vòm mềm và thổi hơi.',
    vietnameseHint: 'Giống "kh" trong "không".',
    examples: [
      { de: 'Buch', ipa: '/buːx/', vi: 'quyển sách' },
      { de: 'acht', ipa: '/axt/', vi: 'số tám' },
      { de: 'Woche', ipa: '/ˈvɔxə/', vi: 'tuần' },
    ],
    mouth: { lips: 'neutral', tongue: 'back-high' },
  },
  {
    id: 'r', grapheme: 'r', ipa: '/ʁ/ – /ɐ/', title: 'Âm R tiếng Đức', category: 'consonant',
    explanation: 'R đầu âm tiết phát ra ở cuống họng, giống âm "r" giọng Pháp hoặc âm "gờ" khi súc miệng nhẹ. Ở cuối từ (-er, -r), R gần như biến thành "ơ/a".',
    mouthTip: 'Để lưỡi thả lỏng, phần sau lưỡi nâng lên gần lưỡi gà và rung nhẹ.',
    vietnameseHint: 'Gần "g" trong "gà" nhưng mềm hơn, sâu hơn.',
    examples: [
      { de: 'rot', ipa: '/ʁoːt/', vi: 'màu đỏ' },
      { de: 'Brot', ipa: '/bʁoːt/', vi: 'bánh mì' },
      { de: 'Lehrer', ipa: '/ˈleːʁɐ/', vi: 'giáo viên' },
    ],
    mouth: { lips: 'neutral', tongue: 'uvular' },
  },
  {
    id: 'z', grapheme: 'z', ipa: '/ts/', title: 'Chữ Z', category: 'consonant',
    explanation: 'Z luôn đọc là "ts" – một âm "t" nối liền với "s". Tz cũng đọc là "ts".',
    mouthTip: 'Đầu lưỡi chạm sau răng trên, bật ra "t" rồi xì "s" ngay lập tức.',
    vietnameseHint: 'Như "ts" – không có trong tiếng Việt chuẩn.',
    examples: [
      { de: 'Zug', ipa: '/tsuːk/', vi: 'tàu hỏa' },
      { de: 'zehn', ipa: '/tseːn/', vi: 'số mười' },
      { de: 'Katze', ipa: '/ˈkatsə/', vi: 'con mèo' },
    ],
    mouth: { lips: 'spread', tongue: 'tip-teeth' },
  },
  {
    id: 'w', grapheme: 'w', ipa: '/v/', title: 'Chữ W', category: 'consonant',
    explanation: 'W đọc như "v" tiếng Việt. Người mới học hay đọc nhầm thành "w" tiếng Anh.',
    mouthTip: 'Răng trên chạm nhẹ môi dưới, rung thanh quản.',
    vietnameseHint: 'Giống "v" trong "và".',
    examples: [
      { de: 'Wasser', ipa: '/ˈvasɐ/', vi: 'nước' },
      { de: 'wo', ipa: '/voː/', vi: 'ở đâu' },
      { de: 'Woche', ipa: '/ˈvɔxə/', vi: 'tuần' },
    ],
    mouth: { lips: 'lips', tongue: 'lips' },
  },
  {
    id: 'v', grapheme: 'v', ipa: '/f/', title: 'Chữ V', category: 'consonant',
    explanation: 'Trong từ gốc Đức, V đọc như "ph" (F). Chỉ trong từ mượn (Vase, Video) V mới đọc là "v".',
    mouthTip: 'Răng trên chạm môi dưới, thổi hơi – không rung thanh quản.',
    vietnameseHint: 'Giống "ph" trong "phở".',
    examples: [
      { de: 'Vater', ipa: '/ˈfaːtɐ/', vi: 'bố' },
      { de: 'Vogel', ipa: '/ˈfoːɡəl/', vi: 'con chim' },
      { de: 'viel', ipa: '/fiːl/', vi: 'nhiều' },
    ],
    mouth: { lips: 'lips', tongue: 'lips' },
  },
  {
    id: 'sch', grapheme: 'sch', ipa: '/ʃ/', title: 'Âm SCH', category: 'special',
    explanation: 'Ba chữ "sch" chỉ tạo thành một âm: "s" nặng, giống "s" (uốn lưỡi) miền Bắc đọc chuẩn, hoặc "sh" tiếng Anh.',
    mouthTip: 'Chu môi nhẹ ra phía trước, lưỡi lùi về sau và thổi hơi.',
    vietnameseHint: 'Giống "s" uốn lưỡi trong "sông".',
    examples: [
      { de: 'Schule', ipa: '/ˈʃuːlə/', vi: 'trường học' },
      { de: 'Fisch', ipa: '/fɪʃ/', vi: 'con cá' },
      { de: 'Tasche', ipa: '/ˈtaʃə/', vi: 'cái túi' },
    ],
    mouth: { lips: 'rounded', tongue: 'front-mid' },
  },
  {
    id: 'sp', grapheme: 'sp', ipa: '/ʃp/', title: 'SP đầu từ', category: 'special',
    explanation: 'Khi đứng đầu từ (hoặc đầu thành phần từ ghép), "sp" đọc là "schp".',
    mouthTip: 'Nói "sch" rồi khép môi bật "p".',
    examples: [
      { de: 'spielen', ipa: '/ˈʃpiːlən/', vi: 'chơi' },
      { de: 'Sport', ipa: '/ʃpɔʁt/', vi: 'thể thao' },
      { de: 'sprechen', ipa: '/ˈʃpʁɛçən/', vi: 'nói' },
    ],
    mouth: { lips: 'rounded', tongue: 'front-mid' },
  },
  {
    id: 'st', grapheme: 'st', ipa: '/ʃt/', title: 'ST đầu từ', category: 'special',
    explanation: 'Khi đứng đầu từ, "st" đọc là "scht". Ở giữa hoặc cuối từ (Fenster, ist) thì vẫn đọc "st" bình thường.',
    mouthTip: 'Nói "sch" rồi chạm đầu lưỡi sau răng để bật "t".',
    examples: [
      { de: 'Stuhl', ipa: '/ʃtuːl/', vi: 'cái ghế' },
      { de: 'Straße', ipa: '/ˈʃtʁaːsə/', vi: 'con đường' },
      { de: 'ist', ipa: '/ɪst/', vi: 'là (không đổi)' },
    ],
    mouth: { lips: 'rounded', tongue: 'tip-teeth' },
  },
  {
    id: 'ei', grapheme: 'ei', ipa: '/aɪ̯/', title: 'Nguyên âm đôi EI', category: 'special',
    explanation: '"ei" đọc là "ai" – ngược với trực giác! Ví dụ: "nein" đọc là "nai-n".',
    mouthTip: 'Bắt đầu từ "a" và trượt nhanh sang "i".',
    vietnameseHint: 'Giống "ai" trong "hai".',
    examples: [
      { de: 'nein', ipa: '/naɪ̯n/', vi: 'không' },
      { de: 'drei', ipa: '/dʁaɪ̯/', vi: 'số ba' },
      { de: 'Arbeit', ipa: '/ˈaʁbaɪ̯t/', vi: 'công việc' },
    ],
    mouth: { lips: 'open', tongue: 'low' },
  },
  {
    id: 'ie', grapheme: 'ie', ipa: '/iː/', title: 'Nguyên âm IE', category: 'special',
    explanation: '"ie" đọc là "i" dài. Mẹo nhớ: đọc theo chữ cái thứ hai – "ie" → i, "ei" → a-i.',
    mouthTip: 'Môi dẹt, cười nhẹ, kéo dài âm "i".',
    vietnameseHint: 'Giống "i" kéo dài.',
    examples: [
      { de: 'vier', ipa: '/fiːɐ̯/', vi: 'số bốn' },
      { de: 'Liebe', ipa: '/ˈliːbə/', vi: 'tình yêu' },
      { de: 'spielen', ipa: '/ˈʃpiːlən/', vi: 'chơi' },
    ],
    mouth: { lips: 'spread', tongue: 'front-high' },
  },
  {
    id: 'eu', grapheme: 'eu / äu', ipa: '/ɔɪ̯/', title: 'Nguyên âm đôi EU', category: 'special',
    explanation: '"eu" và "äu" đều đọc là "oi".',
    mouthTip: 'Bắt đầu với "o" tròn môi và trượt sang "i".',
    vietnameseHint: 'Giống "oi" trong "đói".',
    examples: [
      { de: 'neu', ipa: '/nɔɪ̯/', vi: 'mới' },
      { de: 'heute', ipa: '/ˈhɔɪ̯tə/', vi: 'hôm nay' },
      { de: 'Häuser', ipa: '/ˈhɔɪ̯zɐ/', vi: 'những ngôi nhà' },
    ],
    mouth: { lips: 'rounded', tongue: 'back-high' },
  },
];
