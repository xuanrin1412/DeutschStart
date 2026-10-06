import type { Lesson, LessonExample, LessonQuestion } from '@/types/models';

/**
 * A0 – German foundations, for a learner who knows ZERO German.
 * Rule: every German word on screen was taught before (or in this lesson), or carries an inline gloss.
 * `scripts`-style check: see services/curriculum.ts → validateCurriculum().
 */

const ex = (de: string, vi: string, note?: string, gloss?: Record<string, string>): LessonExample => ({ de, vi, note, gloss });
const q = (prompt: string, display: string | undefined, options: string[], answer: string, explanation: string, skill?: LessonQuestion['skill']): LessonQuestion => ({
  prompt, display, options, answer, explanation, skill,
});

type Draft = Omit<Lesson, 'order' | 'unit' | 'level' | 'prerequisites'> & { prerequisites?: string[] };

const HERR = { Herr: 'ông (cách xưng hô lịch sự)' };

const drafts: Draft[] = [
  /* ---------------- Alphabet & pronunciation ---------------- */
  {
    id: 'a0-alphabet', title: 'Bảng chữ cái (A – M)', titleDe: 'Das Alphabet 1', icon: '🔤', minutes: 10, area: 'alphabet',
    description: 'Tên và âm của 13 chữ cái đầu tiên.',
    objective: 'Hôm nay bạn sẽ học 13 chữ cái đầu tiên (A–M): tên của mỗi chữ khi đánh vần và âm của nó khi đọc.',
    teaches: [],
    steps: [
      { type: 'concept', title: 'Chữ cái tiếng Đức', body: [
        'Tiếng Đức dùng bảng chữ cái Latinh giống tiếng Việt: 26 chữ cái, cộng thêm 4 chữ đặc biệt Ä, Ö, Ü, ß (bạn sẽ học ở bài sau).',
        'Mỗi chữ có một TÊN (dùng khi đánh vần) và một ÂM (dùng khi đọc từ). Ví dụ chữ B có tên là "bê", còn âm là "b".',
        'Tin vui: tiếng Đức đọc gần như đúng như viết – học chắc chữ cái là bạn đọc được hầu hết từ mới.',
      ] },
      { type: 'letters', title: 'Chữ A đến M', letters: 'ABCDEFGHIJKLM'.split('') },
      { type: 'tip', title: 'Những chữ dễ nhầm', body: 'C đọc là "tsê", G đọc là "gê" (không phải "giê"), H đọc là "ha", J đọc là "i-ốt". Bấm vào từng chữ để nghe lại nhiều lần. Từ ví dụ trong mỗi thẻ chỉ để nghe âm – bạn chưa cần nhớ chúng.' },
    ],
  },
  {
    id: 'a0-alphabet-2', title: 'Bảng chữ cái (N – Z)', titleDe: 'Das Alphabet 2', icon: '🔡', minutes: 10, area: 'alphabet',
    description: '13 chữ cái còn lại và cách đánh vần tên.',
    objective: 'Hôm nay bạn sẽ học 13 chữ cái còn lại (N–Z) và tập đánh vần tên của mình.',
    teaches: [],
    steps: [
      { type: 'concept', title: 'Nửa sau bảng chữ cái', body: [
        'Bạn đã biết A–M. Hôm nay là N đến Z.',
        'Những chữ hay nhầm nhất: V đọc là "phau", W đọc là "vê", Z đọc là "tset", Y đọc là "üp-xi-lon".',
      ] },
      { type: 'letters', title: 'Chữ N đến Z', letters: 'NOPQRSTUVWXYZ'.split('') },
      { type: 'concept', title: 'Đánh vần', body: [
        'Ở Đức, khi làm thủ tục hay gọi điện, người ta thường yêu cầu bạn đánh vần tên – đọc từng chữ cái.',
        'Ví dụ tên "Lan": L – A – N, đọc là "el – a – en".',
        'Hãy tập đánh vần họ và tên của bạn bằng tên chữ cái tiếng Đức.',
      ] },
    ],
  },
  {
    id: 'a0-umlauts', title: 'Ä, Ö, Ü', titleDe: 'Die Umlaute', icon: '✨', minutes: 10, area: 'pronunciation',
    description: 'Ba nguyên âm có hai dấu chấm.',
    objective: 'Hôm nay bạn sẽ học 3 nguyên âm có hai dấu chấm (gọi là Umlaut): Ä, Ö, Ü – cách đọc và cách khẩu hình miệng.',
    teaches: [],
    steps: [
      { type: 'concept', title: 'Umlaut là gì?', body: [
        'Hai dấu chấm trên a, o, u gọi là Umlaut. Chúng biến a, o, u thành ba âm khác hẳn: ä, ö, ü.',
        'Umlaut làm thay đổi nghĩa của từ – nên đừng bỏ qua hai dấu chấm!',
        'Không có bàn phím Đức? Bạn có thể viết ae, oe, ue thay cho ä, ö, ü.',
      ] },
      { type: 'letters', title: 'Ba chữ Umlaut', letters: ['Ä', 'Ö', 'Ü'] },
      { type: 'sounds', title: 'Luyện khẩu hình', soundIds: ['ae', 'oe', 'ue'] },
    ],
  },
  {
    id: 'a0-eszett', title: 'Chữ ß', titleDe: 'Das Eszett', icon: '🐍', minutes: 5, area: 'pronunciation',
    description: 'Chữ "s sắc" chỉ có trong tiếng Đức.',
    objective: 'Hôm nay bạn sẽ học chữ ß (Eszett): cách đọc và khi nào nó xuất hiện.',
    teaches: [],
    steps: [
      { type: 'concept', title: 'ß là gì?', body: [
        'ß (gọi là Eszett) luôn đọc là "s" rõ – giống "x" trong tiếng Việt, không bao giờ đọc thành "z".',
        'ß chỉ đứng sau nguyên âm dài hoặc nguyên âm đôi. Sau nguyên âm ngắn, người ta viết "ss".',
        'Không gõ được ß? Hãy viết "ss" thay thế.',
      ] },
      { type: 'letters', title: 'Chữ ß', letters: ['ß'] },
    ],
    questions: [
      q('ß đọc như âm nào?', 'ß', ['s rõ (như "x")', 'z', 'b'], 's rõ (như "x")', 'ß luôn đọc là "s" rõ.', 'pronunciation'),
      q('Không có phím ß, bạn viết thế nào?', undefined, ['ss', 'b', 'sz'], 'ss', 'Có thể thay ß bằng "ss".', 'pronunciation'),
    ],
  },
  {
    id: 'a0-vowels', title: 'Nguyên âm dài và ngắn', titleDe: 'Lange und kurze Vokale', icon: '🅰️', minutes: 10, area: 'pronunciation',
    description: 'a, e, i, o, u – khi nào đọc dài, khi nào đọc ngắn.',
    objective: 'Hôm nay bạn sẽ học 5 nguyên âm a, e, i, o, u và cách phân biệt âm dài – âm ngắn.',
    teaches: [],
    steps: [
      { type: 'concept', title: 'Dài hay ngắn?', body: [
        'Tiếng Đức có 5 nguyên âm cơ bản: a, e, i, o, u. Mỗi nguyên âm có thể đọc DÀI hoặc NGẮN.',
        'Nguyên âm thường DÀI khi: viết đôi (aa, ee, oo), có chữ h theo sau (ah, eh), hoặc chỉ có một phụ âm theo sau.',
        'Nguyên âm thường NGẮN khi có hai phụ âm theo sau (tt, nn, ck…).',
        'Độ dài có thể làm đổi nghĩa của từ, nên hãy nghe thật kỹ.',
      ] },
      { type: 'sounds', title: 'Nghe và so sánh', soundIds: ['long-short'] },
    ],
    questions: [
      q('Nguyên âm trước "tt", "nn", "ck" thường đọc thế nào?', undefined, ['dài', 'ngắn'], 'ngắn', 'Hai phụ âm theo sau → nguyên âm ngắn.', 'pronunciation'),
      q('"aa", "ee", "oo" đọc thế nào?', undefined, ['dài', 'ngắn'], 'dài', 'Nguyên âm viết đôi → dài.', 'pronunciation'),
      q('Chữ h sau nguyên âm (ah, eh) làm nguyên âm…', undefined, ['dài ra', 'ngắn lại', 'không đổi'], 'dài ra', 'h sau nguyên âm thì câm và kéo dài nguyên âm.', 'pronunciation'),
    ],
  },
  {
    id: 'a0-consonants', title: 'Phụ âm cơ bản', titleDe: 'Konsonanten', icon: '🔠', minutes: 10, area: 'pronunciation',
    description: 'b/d/g ở cuối từ, chữ h và chữ j.',
    objective: 'Hôm nay bạn sẽ học 3 quy tắc phụ âm quan trọng: b/d/g ở cuối từ, chữ h và chữ j.',
    teaches: [],
    steps: [
      { type: 'concept', title: 'Ba quy tắc', body: [
        'Phần lớn phụ âm tiếng Đức đọc giống tiếng Việt. Bài này chỉ học những điểm khác.',
        'Quy tắc 1: ở cuối từ, b đọc thành p, d thành t, g thành k.',
        'Quy tắc 2: h ở đầu từ đọc như "h" tiếng Việt; h sau nguyên âm thì câm và làm nguyên âm dài ra.',
        'Quy tắc 3: j đọc như "i" (không phải "j" tiếng Anh).',
      ], table: { headers: ['Chữ', 'Đọc như', 'Ví dụ (chỉ để nghe)'], rows: [['-b (cuối từ)', 'p', 'gelb (màu vàng) → "gelp"'], ['-d (cuối từ)', 't', 'Hund (con chó) → "hunt"'], ['-g (cuối từ)', 'k', 'Tag (ngày) → "tak"'], ['j', 'i', 'ja (vâng) → "ia"'], ['h sau nguyên âm', 'câm', 'sehr (rất) → "ze-ơ"']] } },
    ],
    questions: [
      q('Chữ g ở cuối từ "Tag" đọc như âm nào?', 'Tag', ['g', 'k', 'gh'], 'k', 'Cuối từ, g đọc thành k: "tak".', 'pronunciation'),
      q('Chữ d ở cuối từ "Hund" đọc như âm nào?', 'Hund', ['d', 't', 'đ'], 't', 'Cuối từ, d đọc thành t: "hunt".', 'pronunciation'),
      q('Chữ j trong "ja" đọc như âm nào?', 'ja', ['gi', 'i', 'd'], 'i', 'j đọc như "i": "ia".', 'pronunciation'),
      q('Chữ h trong "sehr" đọc thế nào?', 'sehr', ['đọc như h', 'câm – không đọc'], 'câm – không đọc', 'h sau nguyên âm thì câm.', 'pronunciation'),
    ],
  },
  {
    id: 'a0-ch', title: 'Âm ch', titleDe: 'Der ch-Laut', icon: '🌬️', minutes: 10, area: 'pronunciation',
    description: 'Hai cách đọc chữ ch.',
    objective: 'Hôm nay bạn sẽ học hai cách đọc chữ ch: âm nhẹ (như trong "ich") và âm mạnh (như trong "ach").',
    teaches: [],
    steps: [
      { type: 'concept', title: 'Một chữ – hai âm', body: [
        'Sau e, i, ä, ö, ü và sau phụ âm: ch đọc NHẸ, như tiếng "hì" thì thầm, lưỡi gần vòm miệng.',
        'Sau a, o, u, au: ch đọc MẠNH từ cuống họng, giống "kh" tiếng Việt.',
        'Mẹo: nhìn nguyên âm ngay TRƯỚC ch để biết đọc kiểu nào.',
      ] },
      { type: 'sounds', title: 'Luyện hai âm ch', soundIds: ['ch-ich', 'ch-ach'] },
    ],
    questions: [
      q('ch trong "ich" (tôi) đọc thế nào?', 'ich', ['nhẹ như "hì" thì thầm', 'mạnh như "kh"'], 'nhẹ như "hì" thì thầm', 'Sau i → ch nhẹ.', 'pronunciation'),
      q('ch trong "Buch" (quyển sách) đọc thế nào?', 'Buch', ['nhẹ như "hì" thì thầm', 'mạnh như "kh"'], 'mạnh như "kh"', 'Sau u → ch mạnh.', 'pronunciation'),
      q('ch trong "acht" (số 8) đọc thế nào?', 'acht', ['nhẹ như "hì" thì thầm', 'mạnh như "kh"'], 'mạnh như "kh"', 'Sau a → ch mạnh.', 'pronunciation'),
      q('ch trong "Milch" (sữa) đọc thế nào?', 'Milch', ['nhẹ như "hì" thì thầm', 'mạnh như "kh"'], 'nhẹ như "hì" thì thầm', 'Sau phụ âm l → ch nhẹ.', 'pronunciation'),
    ],
  },
  {
    id: 'a0-sch-sp-st', title: 'sch, sp, st', titleDe: 'sch, sp, st', icon: '🤫', minutes: 10, area: 'pronunciation',
    description: 'Ba tổ hợp phụ âm rất hay gặp.',
    objective: 'Hôm nay bạn sẽ học cách đọc sch, và sp / st ở đầu từ.',
    teaches: [],
    steps: [
      { type: 'concept', title: 'Nhiều chữ – một âm', body: [
        'sch luôn đọc như "s" uốn lưỡi rất mạnh, môi chu ra (giống "sh" tiếng Anh).',
        'sp và st ở ĐẦU từ đọc là "shp" và "sht".',
        'Ở giữa hoặc cuối từ, st đọc bình thường: "ist" (là) đọc là "ist".',
      ] },
      { type: 'sounds', title: 'Luyện âm', soundIds: ['sch', 'sp', 'st'] },
    ],
    questions: [
      q('st trong "Stuhl" (cái ghế) đọc thế nào?', 'Stuhl', ['st', 'sht'], 'sht', 'Đầu từ: st → "sht".', 'pronunciation'),
      q('st trong "ist" (là) đọc thế nào?', 'ist', ['st', 'sht'], 'st', 'Cuối từ: st đọc bình thường.', 'pronunciation'),
      q('sp trong "Sport" (thể thao) đọc thế nào?', 'Sport', ['sp', 'shp'], 'shp', 'Đầu từ: sp → "shp".', 'pronunciation'),
      q('sch trong "Schule" (trường học) đọc thế nào?', 'Schule', ['s thường', 'sh – uốn lưỡi, chu môi'], 'sh – uốn lưỡi, chu môi', 'sch luôn đọc như "sh".', 'pronunciation'),
    ],
  },
  {
    id: 'a0-r', title: 'Âm R tiếng Đức', titleDe: 'Das deutsche R', icon: '🗣️', minutes: 8, area: 'pronunciation',
    description: 'R cuống họng và R ở cuối từ.',
    objective: 'Hôm nay bạn sẽ học âm R tiếng Đức – phát ra từ cuống họng – và cách đọc đuôi -er.',
    teaches: [],
    steps: [
      { type: 'concept', title: 'R cuống họng', body: [
        'R tiếng Đức phát ra từ cuống họng, gần giống âm "gờ" rung nhẹ – như khi súc miệng. Lưỡi không rung như r tiếng Việt.',
        'Ở cuối từ, nhất là đuôi -er, r gần như biến thành "ơ" hoặc "a": "Lehrer" (giáo viên) đọc gần như "lê-rơ".',
      ] },
      { type: 'sounds', title: 'Luyện âm R', soundIds: ['r'] },
    ],
    questions: [
      q('R tiếng Đức phát ra từ đâu?', undefined, ['đầu lưỡi (như r tiếng Việt)', 'cuống họng'], 'cuống họng', 'R tiếng Đức là âm cuống họng.', 'pronunciation'),
      q('Đuôi -er trong "Vater" (bố) đọc gần như?', 'Vater', ['er rung mạnh', 'ơ / a nhẹ'], 'ơ / a nhẹ', 'Cuối từ, -er đọc nhẹ như "ơ".', 'pronunciation'),
    ],
  },
  {
    id: 'a0-wvz', title: 'w, v, z', titleDe: 'w, v, z', icon: '🐝', minutes: 8, area: 'pronunciation',
    description: 'Ba chữ người Việt hay đọc sai.',
    objective: 'Hôm nay bạn sẽ học cách đọc w, v và z – ba chữ đọc khác hẳn tiếng Việt và tiếng Anh.',
    teaches: [],
    steps: [
      { type: 'concept', title: 'Ba chữ "đánh lừa"', body: [
        'w đọc như "v" tiếng Việt: Wasser (nước) → "va-xơ".',
        'v thường đọc như "ph": Vater (bố) → "pha-tơ".',
        'z luôn đọc là "ts": Zug (tàu hỏa) → "tsuk".',
      ] },
      { type: 'sounds', title: 'Luyện âm', soundIds: ['w', 'v', 'z'] },
    ],
    questions: [
      q('Chữ w trong "Wasser" (nước) đọc như?', 'Wasser', ['u', 'v', 'w tiếng Anh'], 'v', 'w đọc như "v".', 'pronunciation'),
      q('Chữ v trong "Vater" (bố) đọc như?', 'Vater', ['v', 'ph'], 'ph', 'v thường đọc như "ph".', 'pronunciation'),
      q('Chữ z trong "Zug" (tàu hỏa) đọc như?', 'Zug', ['d', 'ts', 'z tiếng Anh'], 'ts', 'z luôn đọc là "ts".', 'pronunciation'),
    ],
  },
  {
    id: 'a0-ei-ie-eu', title: 'ei, ie, eu', titleDe: 'Diphthonge', icon: '🔁', minutes: 8, area: 'pronunciation',
    description: 'Hai nguyên âm đứng cạnh nhau.',
    objective: 'Hôm nay bạn sẽ học ba tổ hợp nguyên âm ei, ie, eu – và mẹo để không nhầm ei với ie.',
    teaches: [],
    steps: [
      { type: 'concept', title: 'Hai chữ – một âm', body: [
        'ei đọc là "ai": nein (không) → "nai-n".',
        'ie đọc là "i" dài: sie (cô ấy) → "zi".',
        'eu (và äu) đọc là "oi": heute (hôm nay) → "hoi-tơ".',
        'Mẹo: với ei và ie, đọc chữ cái THỨ HAI theo kiểu tiếng Anh: ei → "I" (ai), ie → "E" (i).',
      ] },
      { type: 'sounds', title: 'Luyện âm', soundIds: ['ei', 'ie', 'eu'] },
    ],
    questions: [
      q('ei trong "nein" đọc như?', 'nein', ['ê-i', 'ai', 'i'], 'ai', 'ei → "ai".', 'pronunciation'),
      q('ie trong "sie" đọc như?', 'sie', ['i dài', 'i-ê', 'ai'], 'i dài', 'ie → "i" dài.', 'pronunciation'),
      q('eu trong "heute" đọc như?', 'heute', ['ê-u', 'oi', 'iu'], 'oi', 'eu → "oi".', 'pronunciation'),
    ],
  },

  /* ---------------- First words ---------------- */
  {
    id: 'a0-greetings', title: 'Chào hỏi', titleDe: 'Begrüßung', icon: '👋', minutes: 10, area: 'phrases',
    description: 'Hallo, Guten Morgen, Guten Tag, Guten Abend.',
    objective: 'Hôm nay bạn sẽ học 4 câu chào: Hallo, Guten Morgen, Guten Tag, Guten Abend – và khi nào dùng mỗi câu.',
    teaches: ['hallo', 'guten-morgen', 'guten-tag', 'guten-abend'],
    patterns: ['Guten Morgen, …!'],
    steps: [
      { type: 'concept', title: 'Chào theo thời gian trong ngày', body: [
        '"Hallo" dùng được mọi lúc, với mọi người – hơi thân mật.',
        'Ba câu chào lịch sự đều bắt đầu bằng "Guten" (nghĩa là "tốt"), rồi đến thời điểm trong ngày: Morgen (buổi sáng), Tag (ngày), Abend (buổi tối).',
        'Vậy "Guten Morgen" nghĩa đen là "buổi sáng tốt lành". Bây giờ bạn chỉ cần học cả cụm.',
      ], table: { headers: ['Câu chào', 'Khi nào?'], rows: [['Guten Morgen', 'sáng sớm đến khoảng 10–11 giờ'], ['Guten Tag', 'ban ngày, lịch sự'], ['Guten Abend', 'từ chiều tối (khoảng 18 giờ)'], ['Hallo', 'mọi lúc, thân mật']], audioCols: [0] } },
      { type: 'words', title: 'Từng câu chào', words: ['hallo', 'guten-morgen', 'guten-tag', 'guten-abend'], examples: {
        hallo: ex('Hallo, Anna!', 'Chào Anna!'),
        'guten-morgen': ex('Guten Morgen, Minh!', 'Chào buổi sáng, Minh!'),
        'guten-tag': ex('Guten Tag, Herr Weber!', 'Xin chào ông Weber!', undefined, HERR),
        'guten-abend': ex('Guten Abend, Lan!', 'Chào buổi tối, Lan!'),
      } },
      { type: 'tip', title: 'Văn hóa Đức', body: 'Ở Đức, khi bước vào cửa hàng, thang máy hay phòng chờ bác sĩ, người ta thường chào "Guten Tag" hoặc "Hallo" với mọi người.' },
    ],
    sentences: [ex('Hallo, Minh!', 'Chào Minh!'), ex('Guten Abend, Lan!', 'Chào buổi tối, Lan!'), ex('Guten Morgen, Anna!', 'Chào buổi sáng, Anna!')],
    questions: [
      q('Bây giờ là 8 giờ sáng. Bạn chào sếp thế nào?', undefined, ['Guten Morgen', 'Guten Abend'], 'Guten Morgen', 'Buổi sáng → Guten Morgen.', 'vocab'),
      q('Bây giờ là 19 giờ. Bạn chào hàng xóm lịch sự thế nào?', undefined, ['Guten Morgen', 'Guten Abend', 'Guten Tag'], 'Guten Abend', 'Buổi tối → Guten Abend.', 'vocab'),
    ],
  },
  {
    id: 'a0-goodbye', title: 'Tạm biệt', titleDe: 'Verabschiedung', icon: '🤚', minutes: 8, area: 'phrases',
    description: 'Tschüss, Auf Wiedersehen, Bis bald, Gute Nacht.',
    objective: 'Hôm nay bạn sẽ học 4 cách tạm biệt – thân mật và lịch sự.',
    teaches: ['tschuess', 'auf-wiedersehen', 'bis-bald', 'gute-nacht'],
    steps: [
      { type: 'concept', title: 'Thân mật hay lịch sự?', body: [
        'Giống lời chào, lời tạm biệt cũng có kiểu thân mật và kiểu lịch sự.',
        '"Tschüss" – thân mật, với bạn bè. "Auf Wiedersehen" – lịch sự (nghĩa đen: "hẹn gặp lại").',
        '"Bis bald" = hẹn sớm gặp lại. "Gute Nacht" = chúc ngủ ngon – chỉ nói trước khi đi ngủ, không dùng để chào buổi tối!',
      ] },
      { type: 'words', title: 'Từng lời tạm biệt', words: ['tschuess', 'auf-wiedersehen', 'bis-bald', 'gute-nacht'], examples: {
        tschuess: ex('Tschüss, Anna!', 'Tạm biệt Anna!'),
        'auf-wiedersehen': ex('Auf Wiedersehen, Herr Weber!', 'Chào tạm biệt ông Weber!', undefined, HERR),
        'bis-bald': ex('Tschüss, bis bald!', 'Tạm biệt, hẹn sớm gặp lại!'),
        'gute-nacht': ex('Gute Nacht, Minh!', 'Chúc ngủ ngon, Minh!'),
      } },
    ],
    sentences: [ex('Tschüss, bis bald!', 'Tạm biệt, hẹn sớm gặp lại!'), ex('Gute Nacht, Anna!', 'Chúc ngủ ngon, Anna!'), ex('Auf Wiedersehen, Lan!', 'Tạm biệt Lan!')],
    questions: [
      q('Buổi tối, bạn gặp bà hàng xóm. Câu chào nào đúng?', undefined, ['Guten Abend', 'Gute Nacht'], 'Guten Abend', '"Gute Nacht" chỉ dùng khi đi ngủ.', 'vocab'),
      q('Bạn rời một cửa hàng. Lời tạm biệt lịch sự là?', undefined, ['Tschüss', 'Auf Wiedersehen'], 'Auf Wiedersehen', 'Lịch sự → Auf Wiedersehen.', 'vocab'),
    ],
  },
  {
    id: 'a0-polite', title: 'Cảm ơn, làm ơn, xin lỗi', titleDe: 'Danke und Bitte', icon: '🙏', minutes: 8, area: 'phrases',
    description: 'Danke, Bitte, Vielen Dank, Gern geschehen, Entschuldigung.',
    objective: 'Hôm nay bạn sẽ học những từ lịch sự quan trọng nhất: cảm ơn, làm ơn, không có gì, xin lỗi.',
    teaches: ['danke', 'bitte', 'vielen-dank', 'gern-geschehen', 'entschuldigung'],
    steps: [
      { type: 'concept', title: 'Năm từ lịch sự', body: [
        '"Danke" = cảm ơn. "Vielen Dank" = cảm ơn nhiều (lịch sự hơn).',
        '"Bitte" có hai nghĩa: "làm ơn" khi nhờ hoặc gọi món, và "không có gì" khi đáp lại lời cảm ơn.',
        '"Gern geschehen" cũng có nghĩa "không có gì" – lịch sự hơn một chút.',
        '"Entschuldigung" = xin lỗi, hoặc "làm phiền một chút" khi bắt chuyện với người lạ.',
      ] },
      { type: 'words', title: 'Từng từ', words: ['danke', 'bitte', 'vielen-dank', 'gern-geschehen', 'entschuldigung'], examples: {
        danke: ex('Danke, Anna!', 'Cảm ơn Anna!'),
        bitte: ex('Danke! – Bitte!', 'Cảm ơn! – Không có gì!'),
        'vielen-dank': ex('Vielen Dank, Herr Weber!', 'Cảm ơn ông Weber nhiều!', undefined, HERR),
        'gern-geschehen': ex('Vielen Dank! – Gern geschehen.', 'Cảm ơn nhiều! – Không có gì.'),
        entschuldigung: ex('Entschuldigung!', 'Xin lỗi! / Làm phiền một chút!'),
      } },
    ],
    sentences: [ex('Danke, Minh!', 'Cảm ơn Minh!'), ex('Vielen Dank, Lan!', 'Cảm ơn Lan nhiều!'), ex('Entschuldigung, Anna!', 'Xin lỗi, Anna!')],
    questions: [
      q('Ai đó nói "Danke!". Bạn đáp lại thế nào?', undefined, ['Bitte!', 'Danke!', 'Tschüss!'], 'Bitte!', '"Bitte" đáp lại lời cảm ơn = không có gì.', 'vocab'),
      q('Bạn muốn hỏi đường một người lạ. Bạn bắt đầu bằng?', undefined, ['Entschuldigung', 'Gute Nacht', 'Bis bald'], 'Entschuldigung', '"Entschuldigung" = làm phiền một chút.', 'vocab'),
      q('"Bitte" trong "Danke! – Bitte!" nghĩa là?', undefined, ['làm ơn', 'không có gì', 'tạm biệt'], 'không có gì', 'Đáp lời cảm ơn → "không có gì".', 'vocab'),
    ],
  },
  {
    id: 'a0-yes-no', title: 'Có, không – và "khỏe không?"', titleDe: 'Ja, nein, wie geht’s?', icon: '✅', minutes: 8, area: 'phrases',
    description: 'ja, nein, gut, Wie geht’s?',
    objective: 'Hôm nay bạn sẽ học "ja" (có), "nein" (không), "gut" (tốt) và câu hỏi thăm "Wie geht’s?".',
    teaches: ['ja', 'nein', 'wie-gehts', 'gut'],
    patterns: ['Wie geht’s? – Gut, danke!'],
    steps: [
      { type: 'concept', title: 'Bốn từ cho cuộc hội thoại đầu tiên', body: [
        '"ja" = có, vâng. "nein" = không.',
        '"Wie geht’s?" = Bạn khỏe không? (thân mật). Trả lời ngắn: "Gut, danke!" (Khỏe, cảm ơn!).',
        '"gut" nghĩa là "tốt / khỏe". Bạn đã gặp nó trong "Guten Morgen": "Guten" chính là "gut" thêm đuôi.',
      ] },
      { type: 'words', title: 'Từng từ', words: ['ja', 'nein', 'wie-gehts', 'gut'], examples: {
        ja: ex('Ja, danke!', 'Vâng, cảm ơn!'),
        nein: ex('Nein, danke.', 'Không, cảm ơn.'),
        'wie-gehts': ex('Hallo Anna, wie geht’s?', 'Chào Anna, khỏe không?'),
        gut: ex('Gut, danke!', 'Khỏe, cảm ơn!'),
      } },
      { type: 'examples', title: 'Hội thoại đầu tiên', items: [ex('Hallo Minh, wie geht’s? – Gut, danke!', 'Chào Minh, khỏe không? – Khỏe, cảm ơn!'), ex('Danke! – Bitte! Tschüss!', 'Cảm ơn! – Không có gì! Tạm biệt!')] },
    ],
    sentences: [ex('Gut, danke!', 'Khỏe, cảm ơn!'), ex('Nein, danke.', 'Không, cảm ơn.'), ex('Ja, bitte.', 'Vâng, làm ơn.')],
    questions: [
      q('"Wie geht’s?" – Bạn khỏe. Bạn trả lời?', undefined, ['Gut, danke!', 'Nein, danke.', 'Gute Nacht!'], 'Gut, danke!', 'Khỏe → Gut, danke!', 'vocab'),
    ],
  },

  /* ---------------- First grammar ---------------- */
  {
    id: 'a0-pronouns', title: 'Đại từ nhân xưng', titleDe: 'Personalpronomen', icon: '🧑', minutes: 12, area: 'grammar',
    description: 'ich, du, er, sie, es, wir, ihr, sie, Sie.',
    objective: 'Hôm nay bạn sẽ học các từ chỉ người: tôi, bạn, anh ấy, cô ấy… (đại từ nhân xưng) – nền móng cho mọi câu.',
    teaches: ['g-ich', 'g-du', 'g-er', 'g-sie', 'g-es', 'g-wir', 'g-ihr', 'g-Sie'],
    concepts: ['pronoun'],
    steps: [
      { type: 'concept', title: 'Đại từ là gì?', terms: ['pronoun'], body: [
        'Trước khi nói câu, bạn cần các từ chỉ người: tôi, bạn, anh ấy… Đó là đại từ nhân xưng.',
        'Tiếng Đức có hai cách nói "bạn": "du" (thân mật – bạn bè, gia đình) và "Sie" (lịch sự – người lạ, đồng nghiệp mới). Khi không chắc, hãy dùng "Sie".',
        '"sie" viết thường có hai nghĩa: "cô ấy" và "họ". Ngữ cảnh sẽ cho bạn biết nghĩa nào.',
      ], table: { headers: ['Tiếng Đức', 'Tiếng Việt'], rows: [['ich', 'tôi'], ['du', 'bạn (thân mật)'], ['er', 'anh ấy'], ['sie', 'cô ấy'], ['es', 'nó'], ['wir', 'chúng tôi'], ['ihr', 'các bạn'], ['sie', 'họ'], ['Sie', 'ông / bà (lịch sự)']], audioCols: [0] } },
      { type: 'words', title: 'Từng đại từ', words: ['g-ich', 'g-du', 'g-er', 'g-sie', 'g-es', 'g-wir', 'g-ihr', 'g-Sie'] },
      { type: 'tip', title: 'Mẹo nhớ', body: '"ich" (tôi) và "du" (bạn) là hai từ quan trọng nhất – bạn sẽ dùng chúng trong hầu hết các câu ở bài sau.' },
    ],
    questions: [
      q('Bạn nói chuyện với một người lạ lớn tuổi. Dùng từ nào cho "ông/bà"?', undefined, ['du', 'Sie', 'ihr'], 'Sie', '"Sie" viết hoa là cách xưng hô lịch sự.'),
      q('"wir" nghĩa là?', undefined, ['tôi', 'chúng tôi', 'các bạn'], 'chúng tôi', 'wir = chúng tôi.', 'vocab'),
      q('"sie" viết thường có thể nghĩa là?', undefined, ['cô ấy hoặc họ', 'tôi', 'ông/bà (lịch sự)'], 'cô ấy hoặc họ', '"sie" viết thường = cô ấy / họ.'),
    ],
  },
  {
    id: 'a0-sein', title: 'Động từ sein (là, ở)', titleDe: 'Das Verb „sein“', icon: '🟰', minutes: 15, area: 'grammar',
    description: 'ich bin, du bist, er ist…',
    objective: 'Hôm nay bạn sẽ học động từ đầu tiên và quan trọng nhất: "sein" (là, ở) – và hiểu thế nào là "chia động từ".',
    teaches: ['sein', 'hier', 'muede'],
    concepts: ['verb', 'conjugation'],
    patterns: ['Ich bin …'],
    steps: [
      { type: 'concept', title: 'Động từ và cách chia', terms: ['verb', 'infinitive', 'conjugation'], body: [
        'Động từ đầu tiên: "sein" – nghĩa là "là", "thì", "ở".',
        'Trong tiếng Việt, "là" không đổi: tôi là, bạn là. Trong tiếng Đức, "sein" đổi hình dạng theo người nói. "sein" là động từ bất quy tắc, nên hãy học thuộc bảng này.',
      ], table: { headers: ['Đại từ', 'sein', 'Nghĩa'], rows: [['ich', 'bin', 'tôi là / ở'], ['du', 'bist', 'bạn là / ở'], ['er / sie / es', 'ist', 'anh ấy / cô ấy / nó là'], ['wir', 'sind', 'chúng tôi là'], ['ihr', 'seid', 'các bạn là'], ['sie / Sie', 'sind', 'họ / ông bà là']], audioCols: [0, 1] } },
      { type: 'words', title: 'Hai từ mới để đặt câu', words: ['sein', 'hier', 'muede'], examples: {
        sein: ex('Ich bin hier.', 'Tôi ở đây.'),
        hier: ex('Wir sind hier.', 'Chúng tôi ở đây.'),
        muede: ex('Du bist müde.', 'Bạn mệt.'),
      } },
      { type: 'examples', title: 'Câu với sein', items: [ex('Ich bin hier.', 'Tôi ở đây.'), ex('Du bist müde.', 'Bạn mệt.'), ex('Er ist hier.', 'Anh ấy ở đây.'), ex('Wir sind müde.', 'Chúng tôi mệt.'), ex('Sie sind hier.', 'Họ ở đây. / Ông bà ở đây.')] },
    ],
    sentences: [ex('Ich bin hier.', 'Tôi ở đây.'), ex('Du bist müde.', 'Bạn mệt.'), ex('Er ist hier.', 'Anh ấy ở đây.'), ex('Wir sind müde.', 'Chúng tôi mệt.')],
    questions: [
      q('Chọn dạng đúng của sein', 'Ich ___ müde.', ['bin', 'bist', 'ist', 'sind'], 'bin', 'ich → bin.'),
      q('Chọn dạng đúng của sein', 'Du ___ hier.', ['bin', 'bist', 'ist'], 'bist', 'du → bist.'),
      q('Chọn dạng đúng của sein', 'Er ___ müde.', ['ist', 'bist', 'sind'], 'ist', 'er/sie/es → ist.'),
      q('Chọn dạng đúng của sein', 'Wir ___ hier.', ['seid', 'sind', 'ist'], 'sind', 'wir → sind.'),
      q('Chọn dạng đúng của sein', 'Ihr ___ müde.', ['seid', 'sind', 'bist'], 'seid', 'ihr → seid.'),
    ],
  },
  {
    id: 'a0-sentence', title: 'Câu đơn giản và câu hỏi', titleDe: 'Einfache Sätze', icon: '🧱', minutes: 12, area: 'grammar',
    description: 'Động từ ở vị trí 2, câu hỏi có/không, phủ định với nicht.',
    objective: 'Hôm nay bạn sẽ học cấu trúc câu tiếng Đức: động từ ở vị trí số 2, cách đặt câu hỏi có/không, và cách nói "không" với nicht.',
    teaches: ['nicht'],
    concepts: ['subject', 'sentence', 'question'],
    patterns: ['Bist du …?', '… nicht …'],
    steps: [
      { type: 'concept', title: 'Một câu cần gì?', terms: ['subject', 'sentence'], body: [
        'Câu đơn giản: Chủ ngữ + Động từ + phần còn lại. Ví dụ: Ich (chủ ngữ) + bin (động từ) + müde.',
        'Trong câu kể, động từ đứng ở VỊ TRÍ SỐ 2. Đây là quy tắc quan trọng nhất của câu tiếng Đức.',
      ] },
      { type: 'concept', title: 'Câu hỏi có/không', terms: ['question'], body: [
        'Muốn hỏi "có … không?", chỉ cần đưa động từ lên ĐẦU câu: Du bist müde. → Bist du müde?',
        'Trả lời bằng "Ja" hoặc "Nein".',
      ] },
      { type: 'words', title: 'Từ mới: nicht', words: ['nicht'], examples: { nicht: ex('Ich bin nicht müde.', 'Tôi không mệt.', '"nicht" đứng sau động từ sein.') } },
      { type: 'examples', title: 'Hỏi và trả lời', items: [
        ex('Bist du müde? – Ja, ich bin müde.', 'Bạn mệt không? – Có, tôi mệt.'),
        ex('Ist er hier? – Nein, er ist nicht hier.', 'Anh ấy có ở đây không? – Không, anh ấy không ở đây.'),
        ex('Wir sind nicht müde.', 'Chúng tôi không mệt.'),
      ] },
    ],
    sentences: [ex('Bist du müde?', 'Bạn có mệt không?'), ex('Ich bin nicht hier.', 'Tôi không ở đây.'), ex('Ist sie müde?', 'Cô ấy có mệt không?')],
    questions: [
      q('Chọn câu hỏi đúng', '"Bạn có mệt không?"', ['Du bist müde?', 'Bist du müde?', 'Müde du bist?'], 'Bist du müde?', 'Câu hỏi có/không: động từ lên đầu câu.'),
      q('Trong câu kể, động từ đứng ở vị trí nào?', undefined, ['Vị trí 1', 'Vị trí 2', 'Cuối câu'], 'Vị trí 2', 'Quy tắc vàng: động từ ở vị trí 2.'),
      q('Chọn câu đúng', '"Tôi không mệt."', ['Ich nicht bin müde.', 'Ich bin nicht müde.', 'Nicht ich bin müde.'], 'Ich bin nicht müde.', '"nicht" đứng sau động từ sein.'),
    ],
  },
  {
    id: 'a0-nouns', title: 'Danh từ và giống', titleDe: 'Nomen und Genus', icon: '🏷️', minutes: 15, area: 'grammar',
    description: 'Danh từ viết hoa, ba giống, mạo từ der/die/das.',
    objective: 'Hôm nay bạn sẽ học danh từ là gì, vì sao mỗi danh từ tiếng Đức có một "giống", và ba mạo từ der, die, das.',
    teaches: ['g-der', 'g-die', 'g-das', 'mann', 'frau', 'kind'],
    concepts: ['noun', 'gender', 'article'],
    patterns: ['Der Mann ist …'],
    steps: [
      { type: 'concept', title: 'Danh từ là gì?', terms: ['noun'], body: [
        'Danh từ là từ chỉ người, con vật, đồ vật. Trong tiếng Đức, danh từ LUÔN viết hoa chữ cái đầu – kể cả ở giữa câu.',
        'Đây là cách dễ nhất để nhận ra danh từ khi đọc: Mann, Frau, Kind đều viết hoa.',
      ] },
      { type: 'concept', title: 'Ba giống và ba mạo từ', terms: ['gender', 'article'], body: [
        'Mỗi danh từ tiếng Đức thuộc một trong ba nhóm, gọi là "giống": giống đực, giống cái, giống trung.',
        'Giống là đặc điểm NGỮ PHÁP của từ, không phải giới tính thật. Với người thì thường trùng: người đàn ông là giống đực. Với đồ vật thì phải học thuộc.',
        'Một từ nhỏ đứng trước danh từ cho bạn biết giống của nó. Từ nhỏ đó gọi là mạo từ: der (với giống đực), die (với giống cái), das (với giống trung).',
        'Chú ý: "die" KHÔNG có nghĩa là "giống cái". "die" là mạo từ (≈ "the") được dùng với danh từ giống cái. Nghĩa "phụ nữ" nằm ở từ "Frau".',
      ], table: { headers: ['Giống', 'Mạo từ', 'Ví dụ'], rows: [['giống đực', 'der', 'der Mann'], ['giống cái', 'die', 'die Frau'], ['giống trung', 'das', 'das Kind']], audioCols: [2] } },
      { type: 'words', title: 'Ba danh từ đầu tiên', words: ['mann', 'frau', 'kind'], examples: {
        mann: ex('Der Mann ist hier.', 'Người đàn ông ở đây.'),
        frau: ex('Die Frau ist müde.', 'Người phụ nữ mệt.'),
        kind: ex('Das Kind ist hier.', 'Đứa trẻ ở đây.'),
      } },
      { type: 'tip', title: 'Thói quen quan trọng nhất', body: 'Luôn học danh từ CÙNG mạo từ: không học "Mann" mà học "der Mann". Trên trang này: der = xanh dương, die = đỏ, das = xanh lá.' },
    ],
    sentences: [ex('Der Mann ist hier.', 'Người đàn ông ở đây.'), ex('Die Frau ist nicht müde.', 'Người phụ nữ không mệt.'), ex('Das Kind ist müde.', 'Đứa trẻ mệt.')],
    questions: [
      q('Danh từ tiếng Đức viết thế nào?', undefined, ['luôn viết hoa chữ đầu', 'luôn viết thường', 'chỉ viết hoa ở đầu câu'], 'luôn viết hoa chữ đầu', 'Mọi danh từ tiếng Đức đều viết hoa.'),
      q('"die" trong "die Frau" là gì?', undefined, ['mạo từ dùng với danh từ giống cái', 'nghĩa là "phụ nữ"', 'nghĩa là "giống cái"'], 'mạo từ dùng với danh từ giống cái', '"die" là mạo từ; nghĩa "phụ nữ" nằm ở "Frau".'),
    ],
  },
  {
    id: 'a0-articles', title: 'der, die, das – mạo từ xác định', titleDe: 'Der bestimmte Artikel', icon: '🎯', minutes: 15, area: 'grammar',
    description: 'der/die/das = "the", số nhiều luôn là die, der → er.',
    objective: 'Hôm nay bạn sẽ hiểu sâu hơn về der, die, das: chúng nghĩa là gì, số nhiều dùng mạo từ nào, và cách thay danh từ bằng er / sie / es.',
    teaches: ['tisch', 'lampe', 'buch'],
    concepts: ['definite', 'plural'],
    steps: [
      { type: 'concept', title: 'der / die / das ≈ "the"', terms: ['definite'], body: [
        'der, die, das đều có nghĩa giống "the" trong tiếng Anh: chỉ một người/vật cụ thể mà cả hai người đều biết.',
        'Chọn der, die hay das tùy GIỐNG của danh từ – không tùy vào nghĩa.',
        'Với đồ vật, giống thường không có lý do: der Tisch (cái bàn) là giống đực, die Lampe (cái đèn) giống cái, das Buch (quyển sách) giống trung. Hãy học thuộc từng cặp.',
      ] },
      { type: 'words', title: 'Ba đồ vật', words: ['tisch', 'lampe', 'buch'], examples: {
        tisch: ex('Der Tisch ist hier.', 'Cái bàn ở đây.'),
        lampe: ex('Die Lampe ist hier.', 'Cái đèn ở đây.'),
        buch: ex('Das Buch ist hier.', 'Quyển sách ở đây.'),
      } },
      { type: 'concept', title: 'Số nhiều luôn là "die"', terms: ['plural'], body: [
        'Khi có nhiều người/vật, mạo từ luôn là "die" – với cả ba giống: der Mann → die Männer, das Kind → die Kinder.',
        'Đuôi số nhiều của danh từ có nhiều kiểu, nên mỗi thẻ từ đều ghi sẵn số nhiều để bạn học dần.',
      ] },
      { type: 'concept', title: 'der → er, die → sie, das → es', body: [
        'Khi đã nói tới một danh từ, câu sau có thể thay nó bằng đại từ: der → er, die → sie, das → es.',
        'Mẹo: nhìn chữ cái cuối của mạo từ: deR → eR, diE → siE, daS → eS.',
      ] },
      { type: 'examples', title: 'Thay bằng đại từ', items: [ex('Der Mann ist müde. Er ist müde.', 'Người đàn ông mệt. Anh ấy mệt.'), ex('Die Lampe ist hier. Sie ist hier.', 'Cái đèn ở đây. Nó ở đây.'), ex('Das Kind ist nicht hier. Es ist nicht hier.', 'Đứa trẻ không ở đây. Nó không ở đây.')] },
    ],
    sentences: [ex('Der Tisch ist hier.', 'Cái bàn ở đây.'), ex('Die Lampe ist nicht hier.', 'Cái đèn không ở đây.'), ex('Das Buch ist hier.', 'Quyển sách ở đây.')],
    questions: [
      q('Thay "die Lampe" bằng đại từ', 'Die Lampe ist hier. ___ ist hier.', ['Er', 'Sie', 'Es'], 'Sie', 'die → sie.'),
      q('Thay "das Buch" bằng đại từ', 'Das Buch ist hier. ___ ist hier.', ['Er', 'Sie', 'Es'], 'Es', 'das → es.'),
      q('Mạo từ số nhiều là?', undefined, ['der', 'die', 'das'], 'die', 'Số nhiều luôn dùng "die".', 'article'),
    ],
  },
  {
    id: 'a0-adjectives', title: 'Tính từ: to, nhỏ, mới, cũ', titleDe: 'Erste Adjektive', icon: '📏', minutes: 12, area: 'vocabulary',
    description: 'groß, klein, neu, alt, schön.',
    objective: 'Hôm nay bạn sẽ học 5 tính từ đầu tiên và mẫu câu "Danh từ + sein + tính từ": Der Tisch ist neu.',
    teaches: ['gross', 'klein', 'neu', 'alt', 'schoen'],
    concepts: ['adjective'],
    patterns: ['Der … ist …'],
    steps: [
      { type: 'concept', title: 'Tính từ', terms: ['adjective'], body: [
        'Tính từ mô tả tính chất. Mẫu câu đơn giản nhất: Danh từ + sein + tính từ.',
        'Sau sein, tính từ giữ nguyên, không đổi đuôi: Der Tisch ist klein. Die Lampe ist klein. Das Buch ist klein.',
        '"alt" có hai nghĩa: "cũ" (đồ vật) và "già" (người, con vật).',
      ] },
      { type: 'words', title: 'Năm tính từ', words: ['gross', 'klein', 'neu', 'alt', 'schoen'], examples: {
        gross: ex('Der Mann ist groß.', 'Người đàn ông cao to.'),
        klein: ex('Das Kind ist klein.', 'Đứa trẻ nhỏ.'),
        neu: ex('Der Tisch ist neu.', 'Cái bàn mới.'),
        alt: ex('Das Buch ist alt.', 'Quyển sách cũ.'),
        schoen: ex('Die Lampe ist schön.', 'Cái đèn đẹp.'),
      } },
      { type: 'tip', title: 'Học theo cặp', body: 'Học tính từ theo cặp trái nghĩa: groß ↔ klein, neu ↔ alt. Nhớ một từ là nhớ luôn từ kia.' },
    ],
    sentences: [ex('Das Kind ist klein.', 'Đứa trẻ nhỏ.'), ex('Der Tisch ist nicht neu.', 'Cái bàn không mới.'), ex('Die Frau ist schön.', 'Người phụ nữ đẹp.'), ex('Ist das Buch alt?', 'Quyển sách có cũ không?')],
    questions: [
      q('Trái nghĩa của "groß" là?', undefined, ['klein', 'neu', 'schön'], 'klein', 'groß ↔ klein.', 'vocab'),
      q('Chọn câu đúng', '"Cái bàn mới."', ['Der Tisch neu ist.', 'Der Tisch ist neu.', 'Ist der Tisch neu.'], 'Der Tisch ist neu.', 'Động từ "ist" ở vị trí 2.'),
    ],
  },
  {
    id: 'a0-everyday-nouns', title: 'Đồ vật và con vật quen thuộc', titleDe: 'Erste Nomen', icon: '🏠', minutes: 15, area: 'vocabulary',
    description: 'Haus, Tür, Stuhl, Bett, Tasche, Auto, Katze, Hund.',
    objective: 'Hôm nay bạn sẽ học 8 danh từ quen thuộc – luôn cùng mạo từ – và dùng chúng với các tính từ đã biết.',
    teaches: ['haus', 'tuer', 'stuhl', 'bett', 'tasche', 'auto', 'katze', 'hund'],
    steps: [
      { type: 'concept', title: 'Học danh từ thông minh', body: [
        'Bài này có 8 danh từ mới. Với mỗi từ, hãy đọc to CẢ mạo từ: "der Stuhl", không chỉ "Stuhl".',
        'Một mẹo đoán giống: nhiều danh từ tận cùng bằng -e là giống cái (die Tasche, die Katze). Nhưng đây chỉ là mẹo, không phải luật.',
      ] },
      { type: 'words', title: 'Trong nhà', words: ['haus', 'tuer', 'stuhl', 'bett'], examples: {
        haus: ex('Das Haus ist groß.', 'Ngôi nhà to.'),
        tuer: ex('Die Tür ist neu.', 'Cánh cửa mới.'),
        stuhl: ex('Der Stuhl ist alt.', 'Cái ghế cũ.'),
        bett: ex('Das Bett ist klein.', 'Cái giường nhỏ.'),
      } },
      { type: 'words', title: 'Đồ dùng và con vật', words: ['tasche', 'auto', 'katze', 'hund'], examples: {
        tasche: ex('Die Tasche ist schön.', 'Cái túi đẹp.'),
        auto: ex('Das Auto ist neu.', 'Chiếc ô tô mới.'),
        katze: ex('Die Katze ist klein.', 'Con mèo nhỏ.'),
        hund: ex('Der Hund ist groß.', 'Con chó to.'),
      } },
    ],
    sentences: [ex('Die Katze ist klein.', 'Con mèo nhỏ.'), ex('Das Auto ist nicht neu.', 'Chiếc ô tô không mới.'), ex('Der Hund ist hier.', 'Con chó ở đây.'), ex('Ist das Haus groß?', 'Ngôi nhà có to không?')],
  },
  {
    id: 'a0-ein-eine', title: 'ein, eine – "một"', titleDe: 'Der unbestimmte Artikel', icon: '1️⃣', minutes: 12, area: 'grammar',
    description: 'Mạo từ không xác định và câu "Das ist …".',
    objective: 'Hôm nay bạn sẽ học mạo từ ein / eine (một) – dùng khi nhắc tới lần đầu – và câu giới thiệu "Das ist …" (Đây là …).',
    teaches: ['g-ein', 'g-eine', 'g-das-demo'],
    concepts: ['indefinite'],
    patterns: ['Das ist ein / eine …'],
    steps: [
      { type: 'concept', title: 'ein / eine', terms: ['indefinite'], body: [
        'der/die/das dùng cho người/vật đã biết. Khi nhắc tới LẦN ĐẦU, ta dùng ein / eine – nghĩa là "một".',
        'der → ein, das → ein, die → eine. Chỉ giống cái có thêm "e".',
        'Số nhiều không có "ein": Kinder, Bücher.',
      ], table: { headers: ['Giống', 'xác định', 'không xác định'], rows: [['giống đực', 'der Hund', 'ein Hund'], ['giống cái', 'die Katze', 'eine Katze'], ['giống trung', 'das Auto', 'ein Auto']], audioCols: [1, 2] } },
      { type: 'concept', title: '"Das ist …" = Đây là …', body: [
        'Để giới thiệu người hoặc vật, dùng "Das ist …" = "Đây là / Đó là …".',
        'Chú ý: "das" ở đây KHÔNG phải mạo từ giống trung. Nó có nghĩa "đây / đó" và dùng với mọi giống: Das ist ein Hund. Das ist eine Katze.',
      ] },
      { type: 'words', title: 'Ba từ mới', words: ['g-ein', 'g-eine', 'g-das-demo'], examples: {
        'g-ein': ex('Das ist ein Hund.', 'Đây là một con chó.'),
        'g-eine': ex('Das ist eine Katze.', 'Đây là một con mèo.'),
        'g-das-demo': ex('Das ist ein Auto.', 'Đây là một chiếc ô tô.'),
      } },
      { type: 'examples', title: 'Lần đầu "ein", lần sau "der"', items: [ex('Das ist ein Hund. Der Hund ist klein.', 'Đây là một con chó. Con chó (đó) nhỏ.'), ex('Das ist eine Tasche. Die Tasche ist neu.', 'Đây là một cái túi. Cái túi (đó) mới.'), ex('Das ist ein Haus. Das Haus ist groß.', 'Đây là một ngôi nhà. Ngôi nhà (đó) to.')] },
    ],
    sentences: [ex('Das ist eine Katze.', 'Đây là một con mèo.'), ex('Das ist ein Tisch.', 'Đây là một cái bàn.'), ex('Ist das ein Buch?', 'Đây có phải một quyển sách không?')],
    questions: [
      q('ein hay eine?', 'Das ist ___ Lampe.', ['ein', 'eine'], 'eine', 'die Lampe → eine Lampe.', 'article'),
      q('ein hay eine?', 'Das ist ___ Bett.', ['ein', 'eine'], 'ein', 'das Bett → ein Bett.', 'article'),
      q('ein hay eine?', 'Das ist ___ Stuhl.', ['ein', 'eine'], 'ein', 'der Stuhl → ein Stuhl.', 'article'),
      q('"Das" trong "Das ist eine Katze" nghĩa là?', undefined, ['đây / đó', 'mạo từ giống trung', 'con mèo'], 'đây / đó', 'Trong "Das ist …", das = đây/đó, dùng với mọi giống.'),
    ],
  },
  {
    id: 'a0-haben', title: 'Động từ haben (có)', titleDe: 'Das Verb „haben“', icon: '🤲', minutes: 12, area: 'grammar',
    description: 'ich habe, du hast, er hat…',
    objective: 'Hôm nay bạn sẽ học động từ "haben" (có) và nói về những gì bạn có: Ich habe eine Katze.',
    teaches: ['haben'],
    patterns: ['Ich habe ein / eine …'],
    steps: [
      { type: 'concept', title: 'haben = có', body: [
        '"haben" = có. Giống "sein", "haben" là động từ rất quan trọng và hơi bất quy tắc.',
        'Chú ý: du hast, er hat – chữ "b" biến mất!',
      ], table: { headers: ['Đại từ', 'haben'], rows: [['ich', 'habe'], ['du', 'hast'], ['er / sie / es', 'hat'], ['wir', 'haben'], ['ihr', 'habt'], ['sie / Sie', 'haben']], audioCols: [0, 1] } },
      { type: 'words', title: 'Động từ mới', words: ['haben'], examples: { haben: ex('Ich habe eine Katze.', 'Tôi có một con mèo.') } },
      { type: 'concept', title: 'Một điều cần biết trước', body: [
        'Sau "haben", danh từ giống đực đổi "ein" thành "einen": Sie hat einen Hund. Bạn sẽ học kỹ quy tắc này (cách 4 – Akkusativ) ở A1.',
        'Trong bài này, chúng ta chủ yếu dùng danh từ giống cái (eine) và giống trung (ein) – chúng không thay đổi.',
      ] },
      { type: 'examples', title: 'Câu với haben', items: [
        ex('Ich habe eine Katze.', 'Tôi có một con mèo.'),
        ex('Du hast ein Auto.', 'Bạn có một chiếc ô tô.'),
        ex('Er hat ein Haus.', 'Anh ấy có một ngôi nhà.'),
        ex('Hast du ein Buch? – Ja, ich habe ein Buch.', 'Bạn có quyển sách không? – Có, tôi có một quyển sách.'),
        ex('Sie hat einen Hund.', 'Cô ấy có một con chó.', '"einen" = "ein" với danh từ giống đực sau haben – học kỹ ở A1.', { einen: 'một (giống đực, sau haben)' }),
      ] },
    ],
    sentences: [ex('Ich habe eine Katze.', 'Tôi có một con mèo.'), ex('Hast du ein Auto?', 'Bạn có ô tô không?'), ex('Er hat ein Haus.', 'Anh ấy có một ngôi nhà.')],
    questions: [
      q('Chia haben', 'Ich ___ ein Buch.', ['habe', 'hast', 'hat'], 'habe', 'ich → habe.'),
      q('Chia haben', 'Du ___ eine Tasche.', ['habe', 'hast', 'hat'], 'hast', 'du → hast.'),
      q('Chia haben', 'Er ___ ein Auto.', ['haben', 'hat', 'hast'], 'hat', 'er → hat.'),
      q('Chia haben', 'Wir ___ ein Haus.', ['haben', 'habt', 'hat'], 'haben', 'wir → haben.'),
    ],
  },
  {
    id: 'a0-verbs', title: 'Động từ có quy tắc', titleDe: 'Regelmäßige Verben', icon: '⚙️', minutes: 15, area: 'grammar',
    description: 'lernen, wohnen, kommen – và từ nhỏ in, aus.',
    objective: 'Hôm nay bạn sẽ học cách chia động từ có quy tắc (một bảng đuôi dùng cho hàng trăm động từ) với lernen, wohnen, kommen.',
    teaches: ['lernen', 'wohnen', 'kommen', 'g-in', 'aus', 'deutsch', 'vietnam'],
    concepts: ['infinitive'],
    patterns: ['Ich lerne …', 'Ich wohne in …', 'Ich komme aus …'],
    steps: [
      { type: 'concept', title: 'Gốc + đuôi', terms: ['infinitive'], body: [
        'Hầu hết động từ có quy tắc: bỏ đuôi -en để lấy GỐC (lernen → lern-), rồi thêm đuôi theo người: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en.',
        'Học một bảng đuôi là chia được hàng trăm động từ!',
      ], table: { headers: ['Đại từ', 'Đuôi', 'lernen', 'wohnen'], rows: [['ich', '-e', 'lerne', 'wohne'], ['du', '-st', 'lernst', 'wohnst'], ['er / sie / es', '-t', 'lernt', 'wohnt'], ['wir', '-en', 'lernen', 'wohnen'], ['ihr', '-t', 'lernt', 'wohnt'], ['sie / Sie', '-en', 'lernen', 'wohnen']], audioCols: [0, 2] } },
      { type: 'words', title: 'Ba động từ', words: ['lernen', 'wohnen', 'kommen'], examples: {
        lernen: ex('Ich lerne Deutsch.', 'Tôi học tiếng Đức.'),
        wohnen: ex('Ich wohne in Berlin.', 'Tôi sống ở Berlin.'),
        kommen: ex('Ich komme aus Vietnam.', 'Tôi đến từ Việt Nam.'),
      } },
      { type: 'words', title: 'Từ nhỏ đi kèm', words: ['g-in', 'aus', 'deutsch', 'vietnam'], examples: {
        'g-in': ex('Er wohnt in Hanoi.', 'Anh ấy sống ở Hà Nội.'),
        aus: ex('Sie kommt aus Vietnam.', 'Cô ấy đến từ Việt Nam.'),
        deutsch: ex('Wir lernen Deutsch.', 'Chúng tôi học tiếng Đức.'),
        vietnam: ex('Vietnam ist schön.', 'Việt Nam đẹp.'),
      } },
    ],
    sentences: [ex('Ich lerne Deutsch.', 'Tôi học tiếng Đức.'), ex('Du wohnst in Berlin.', 'Bạn sống ở Berlin.'), ex('Er kommt aus Vietnam.', 'Anh ấy đến từ Việt Nam.'), ex('Wohnst du in Hanoi?', 'Bạn có sống ở Hà Nội không?')],
    questions: [
      q('Chia lernen', 'Du ___ Deutsch.', ['lerne', 'lernst', 'lernt'], 'lernst', 'du → -st.'),
      q('Chia wohnen', 'Er ___ in Berlin.', ['wohne', 'wohnst', 'wohnt'], 'wohnt', 'er → -t.'),
      q('Chia kommen', 'Wir ___ aus Vietnam.', ['kommen', 'kommt', 'komme'], 'kommen', 'wir → -en.'),
      q('in hay aus?', 'Ich komme ___ Vietnam.', ['in', 'aus'], 'aus', 'Đến từ → aus.'),
      q('in hay aus?', 'Ich wohne ___ Berlin.', ['in', 'aus'], 'in', 'Sống ở → in.'),
    ],
  },
  {
    id: 'a0-introduce', title: 'Giới thiệu bản thân', titleDe: 'Sich vorstellen', icon: '🙋', minutes: 15, area: 'communication',
    description: 'Ich heiße …, Mein Name ist …, Ich spreche …',
    objective: 'Hôm nay bạn sẽ tự giới thiệu được: tên, quê, nơi ở, ngôn ngữ – bằng những từ đã học và vài từ mới.',
    teaches: ['heissen', 'wie', 'name', 'g-mein', 'sprechen', 'vietnamesisch', 'freut-mich'],
    patterns: ['Ich heiße …', 'Mein Name ist …', 'Wie heißt du?'],
    steps: [
      { type: 'concept', title: 'Đủ từ để giới thiệu', body: [
        '"heißen" = tên là: Ich heiße Minh. Câu hỏi: Wie heißt du? ("wie" = như thế nào).',
        '"mein" = của tôi: Mein Name ist Lan (Tên của tôi là Lan).',
        '"sprechen" = nói (một ngôn ngữ). Chú ý: du sprichst, er spricht – nguyên âm e đổi thành i.',
      ] },
      { type: 'words', title: 'Từ mới', words: ['heissen', 'wie', 'name', 'g-mein'], examples: {
        heissen: ex('Ich heiße Minh.', 'Tôi tên là Minh.'),
        wie: ex('Wie heißt du?', 'Bạn tên là gì?'),
        name: ex('Mein Name ist Lan.', 'Tên tôi là Lan.'),
        'g-mein': ex('Mein Name ist Minh.', 'Tên tôi là Minh.'),
      } },
      { type: 'words', title: 'Ngôn ngữ và lời chào', words: ['sprechen', 'vietnamesisch', 'freut-mich'], examples: {
        sprechen: ex('Ich spreche Vietnamesisch.', 'Tôi nói tiếng Việt.'),
        vietnamesisch: ex('Sprichst du Vietnamesisch?', 'Bạn có nói tiếng Việt không?'),
        'freut-mich': ex('Ich heiße Anna. – Freut mich!', 'Tôi tên là Anna. – Rất vui được gặp bạn!'),
      } },
      { type: 'examples', title: 'Một đoạn giới thiệu', items: [ex('Hallo! Ich heiße Minh. Ich komme aus Vietnam. Ich wohne in Berlin. Ich lerne Deutsch.', 'Xin chào! Tôi tên là Minh. Tôi đến từ Việt Nam. Tôi sống ở Berlin. Tôi học tiếng Đức.')] },
    ],
    sentences: [ex('Ich heiße Lan.', 'Tôi tên là Lan.'), ex('Wie heißt du?', 'Bạn tên là gì?'), ex('Mein Name ist Minh.', 'Tên tôi là Minh.'), ex('Ich spreche Deutsch.', 'Tôi nói tiếng Đức.')],
    questions: [
      q('Chia heißen', 'Wie ___ du?', ['heiße', 'heißt', 'heißen'], 'heißt', 'du → heißt (gốc tận cùng ß chỉ thêm t).'),
      q('Chia sprechen', 'Er ___ Deutsch.', ['sprecht', 'spricht', 'sprechen'], 'spricht', 'sprechen: e → i với er.'),
      q('Đáp lại "Ich heiße Anna."', undefined, ['Freut mich!', 'Gute Nacht!', 'Nein, danke.'], 'Freut mich!', 'Freut mich = Rất vui được gặp bạn.', 'vocab'),
    ],
  },
  {
    id: 'a0-numbers-1', title: 'Số đếm 0 – 12', titleDe: 'Zahlen 0–12', icon: '🔢', minutes: 12, area: 'vocabulary',
    description: 'null, eins, zwei … zwölf.',
    objective: 'Hôm nay bạn sẽ học đếm từ 0 đến 12.',
    teaches: ['g-num-null', 'g-num-eins', 'g-num-zwei', 'g-num-drei', 'g-num-vier', 'g-num-fünf', 'g-num-sechs', 'g-num-sieben', 'g-num-acht', 'g-num-neun', 'g-num-zehn', 'g-num-elf', 'g-num-zwölf'],
    steps: [
      { type: 'concept', title: 'Số đếm', body: [
        'Số đếm dùng ở khắp nơi: giá tiền, số điện thoại, giờ giấc, tuổi.',
        'Chú ý cách đọc: zwei ("tsvai"), drei ("drai"), vier ("fia"), sieben ("zi-bần"), zwölf ("tsvơlf").',
      ] },
      { type: 'words', title: 'Từ 0 đến 6', words: ['g-num-null', 'g-num-eins', 'g-num-zwei', 'g-num-drei', 'g-num-vier', 'g-num-fünf', 'g-num-sechs'], examples: { 'g-num-zwei': ex('Ich habe zwei Katzen.', 'Tôi có hai con mèo.') } },
      { type: 'words', title: 'Từ 7 đến 12', words: ['g-num-sieben', 'g-num-acht', 'g-num-neun', 'g-num-zehn', 'g-num-elf', 'g-num-zwölf'] },
    ],
    questions: [q('Số 7 là?', undefined, ['sieben', 'siebzehn', 'zwei'], 'sieben', '7 = sieben.', 'vocab')],
  },
  {
    id: 'a0-numbers-2', title: 'Số đếm 13 – 100', titleDe: 'Zahlen bis 100', icon: '💯', minutes: 15, area: 'vocabulary',
    description: 'Số "ngược": einundzwanzig = 21.',
    objective: 'Hôm nay bạn sẽ đếm đến 100 và học bí mật của số "ngược": 21 = einundzwanzig. Bạn cũng học từ "und" (và).',
    teaches: ['und', 'g-num-ein', 'g-num-dreizehn', 'g-num-vierzehn', 'g-num-fünfzehn', 'g-num-sechzehn', 'g-num-siebzehn', 'g-num-achtzehn', 'g-num-neunzehn', 'g-num-zwanzig', 'g-num-dreißig', 'g-num-vierzig', 'g-num-fünfzig', 'g-num-sechzig', 'g-num-siebzig', 'g-num-achtzig', 'g-num-neunzig', 'g-num-hundert'],
    steps: [
      { type: 'concept', title: '13 – 19', body: [
        '13–19: số đơn vị + zehn: dreizehn (3 + 10), vierzehn (4 + 10).',
        'Chú ý: sechzehn (không phải "sechszehn"), siebzehn (không phải "siebenzehn").',
      ] },
      { type: 'words', title: 'Từ 13 đến 19', words: ['g-num-dreizehn', 'g-num-vierzehn', 'g-num-fünfzehn', 'g-num-sechzehn', 'g-num-siebzehn', 'g-num-achtzehn', 'g-num-neunzehn'] },
      { type: 'concept', title: 'Hàng chục', body: ['20 zwanzig, 30 dreißig (viết bằng ß!), 40 vierzig, 50 fünfzig, 60 sechzig, 70 siebzig, 80 achtzig, 90 neunzig, 100 hundert.'] },
      { type: 'words', title: 'Hàng chục', words: ['g-num-zwanzig', 'g-num-dreißig', 'g-num-vierzig', 'g-num-fünfzig', 'g-num-sechzig', 'g-num-siebzig', 'g-num-achtzig', 'g-num-neunzig', 'g-num-hundert'] },
      { type: 'concept', title: 'Số "ngược"', body: [
        'Từ 21, tiếng Đức đọc hàng ĐƠN VỊ trước, rồi "und" (và), rồi hàng chục: 21 = einundzwanzig ("một-và-hai mươi"), 35 = fünfunddreißig.',
        '"und" nghĩa là "và" – bạn sẽ dùng nó ở mọi nơi: Anna und Tom.',
        'Với số 1 trong số ghép, dùng "ein" (không phải "eins"): einundzwanzig.',
      ] },
      { type: 'words', title: 'Từ nhỏ "und"', words: ['und', 'g-num-ein'], examples: { und: ex('Anna und Tom sind hier.', 'Anna và Tom ở đây.'), 'g-num-ein': ex('einundzwanzig, einunddreißig', '21, 31') } },
      { type: 'examples', title: 'Đọc số', items: [ex('dreiundzwanzig', '23'), ex('fünfundvierzig', '45'), ex('achtundneunzig', '98')] },
    ],
    questions: [
      q('Số 25 đọc là?', undefined, ['zwanzigfünf', 'fünfundzwanzig', 'fünfzwanzig'], 'fünfundzwanzig', 'Đơn vị trước, rồi und, rồi hàng chục.', 'vocab'),
      q('Số 16 viết là?', undefined, ['sechszehn', 'sechzehn', 'sechzig'], 'sechzehn', '16 = sechzehn.', 'vocab'),
      q('"dreißig" là số?', undefined, ['13', '30', '33'], '30', 'dreißig = 30.', 'vocab'),
      q('Số 71 đọc là?', undefined, ['einundsiebzig', 'siebzigeins', 'einsundsiebzig'], 'einundsiebzig', 'Số 1 trong số ghép là "ein".', 'vocab'),
    ],
  },
  {
    id: 'a0-age', title: 'Tuổi', titleDe: 'Das Alter', icon: '🎂', minutes: 10, area: 'communication',
    description: 'Wie alt bist du? – Ich bin 25 Jahre alt.',
    objective: 'Hôm nay bạn sẽ hỏi và nói tuổi: "Wie alt bist du? – Ich bin 25 Jahre alt."',
    teaches: ['jahr'],
    patterns: ['Wie alt bist du?', 'Ich bin … Jahre alt.'],
    steps: [
      { type: 'concept', title: 'Hỏi tuổi', body: [
        'Hỏi tuổi: "Wie alt bist du?" – nghĩa đen "Bạn già như thế nào?" (alt = già, cũ).',
        'Trả lời: "Ich bin 25 Jahre alt." (das Jahr = năm, số nhiều die Jahre). Nói ngắn: "Ich bin 25."',
        'Chú ý: tiếng Đức nói tuổi bằng SEIN (là): Ich bin 25 Jahre alt – không dùng haben.',
      ] },
      { type: 'words', title: 'Từ mới', words: ['jahr'], examples: { jahr: ex('Das Kind ist ein Jahr alt.', 'Đứa trẻ một tuổi.') } },
      { type: 'examples', title: 'Hỏi và trả lời', items: [
        ex('Wie alt bist du? – Ich bin dreiundzwanzig Jahre alt.', 'Bạn bao nhiêu tuổi? – Tôi 23 tuổi.'),
        ex('Wie alt ist das Kind? – Es ist sieben.', 'Đứa trẻ bao nhiêu tuổi? – Nó 7 tuổi.'),
        ex('Mein Name ist Lan. Ich bin 30 Jahre alt.', 'Tên tôi là Lan. Tôi 30 tuổi.'),
        ex('Der Hund ist alt. Er ist zwölf Jahre alt.', 'Con chó già rồi. Nó 12 tuổi.'),
      ] },
    ],
    sentences: [ex('Ich bin 25 Jahre alt.', 'Tôi 25 tuổi.'), ex('Wie alt bist du?', 'Bạn bao nhiêu tuổi?'), ex('Wie alt ist er?', 'Anh ấy bao nhiêu tuổi?')],
    questions: [q('Chọn câu đúng', '"Tôi 20 tuổi."', ['Ich habe 20 Jahre.', 'Ich bin 20 Jahre alt.', 'Ich bin 20 Jahr.'], 'Ich bin 20 Jahre alt.', 'Tuổi: sein + … Jahre alt.')],
  },
  {
    id: 'a0-country', title: 'Quê quán và quốc tịch', titleDe: 'Herkunft', icon: '🌍', minutes: 12, area: 'communication',
    description: 'Woher kommst du? Wo wohnst du?',
    objective: 'Hôm nay bạn sẽ hỏi và trả lời: Bạn đến từ đâu? Bạn sống ở đâu? Bạn là người nước nào?',
    teaches: ['woher', 'wo', 'deutschland', 'vietnamese', 'vietnamesin', 'englisch'],
    patterns: ['Woher kommst du?', 'Wo wohnst du?', 'Ich bin Vietnamese / Vietnamesin.'],
    steps: [
      { type: 'concept', title: 'Từ đâu, ở đâu?', body: [
        '"woher" = từ đâu: Woher kommst du? – Ich komme aus Vietnam.',
        '"wo" = ở đâu: Wo wohnst du? – Ich wohne in Deutschland.',
        'Quốc tịch có dạng nam và nữ: Ich bin Vietnamese (nam) / Ich bin Vietnamesin (nữ). Dạng nữ thường thêm -in.',
        'Nói quốc tịch không dùng mạo từ: "Ich bin Vietnamesin", không nói "Ich bin eine Vietnamesin".',
      ] },
      { type: 'words', title: 'Từ để hỏi', words: ['woher', 'wo'], examples: { woher: ex('Woher kommst du?', 'Bạn đến từ đâu?'), wo: ex('Wo wohnst du?', 'Bạn sống ở đâu?') } },
      { type: 'words', title: 'Đất nước và quốc tịch', words: ['deutschland', 'vietnamese', 'vietnamesin', 'englisch'], examples: {
        deutschland: ex('Ich wohne in Deutschland.', 'Tôi sống ở Đức.'),
        vietnamese: ex('Ich bin Vietnamese.', 'Tôi là người Việt Nam (nam).'),
        vietnamesin: ex('Lan ist Vietnamesin.', 'Lan là người Việt Nam (nữ).'),
        englisch: ex('Sprichst du Englisch?', 'Bạn có nói tiếng Anh không?'),
      } },
      { type: 'examples', title: 'Hội thoại', items: [
        ex('Woher kommst du? – Ich komme aus Vietnam. Ich bin Vietnamesin.', 'Bạn đến từ đâu? – Tôi đến từ Việt Nam. Tôi là người Việt.'),
        ex('Wo wohnst du? – Ich wohne in Berlin, in Deutschland.', 'Bạn sống ở đâu? – Tôi sống ở Berlin, ở Đức.'),
        ex('Sprechen Sie Deutsch? – Ja, und ich spreche auch Vietnamesisch.', 'Ông/bà có nói tiếng Đức không? – Có, và tôi cũng nói tiếng Việt.', undefined, { auch: 'cũng' }),
      ] },
    ],
    sentences: [ex('Woher kommst du?', 'Bạn đến từ đâu?'), ex('Ich komme aus Vietnam.', 'Tôi đến từ Việt Nam.'), ex('Wo wohnst du?', 'Bạn sống ở đâu?'), ex('Ich wohne in Deutschland.', 'Tôi sống ở Đức.')],
    questions: [
      q('woher hay wo?', '___ kommst du? – Aus Vietnam.', ['Woher', 'Wo'], 'Woher', 'Hỏi quê quán → woher.'),
      q('woher hay wo?', '___ wohnst du? – In Berlin.', ['Woher', 'Wo'], 'Wo', 'Hỏi nơi ở → wo.'),
      q('Bạn là nữ người Việt. Câu nào đúng?', undefined, ['Ich bin Vietnamese.', 'Ich bin Vietnamesin.', 'Ich bin eine Vietnamesin.'], 'Ich bin Vietnamesin.', 'Nữ → Vietnamesin, không có mạo từ.'),
    ],
  },
  {
    id: 'a0-family', title: 'Gia đình', titleDe: 'Die Familie', icon: '👨‍👩‍👧', minutes: 15, area: 'vocabulary',
    description: 'Mutter, Vater, Bruder, Schwester – và mein / meine.',
    objective: 'Hôm nay bạn sẽ học các thành viên gia đình và cách nói "của tôi": mein Vater, meine Mutter.',
    teaches: ['mutter', 'vater', 'bruder', 'schwester', 'eltern', 'familie'],
    patterns: ['Das ist mein / meine …'],
    steps: [
      { type: 'concept', title: 'mein hay meine?', body: [
        '"mein" = của tôi. Giống "ein": danh từ giống đực và giống trung dùng "mein", giống cái và số nhiều dùng "meine".',
      ], table: { headers: ['Mạo từ', 'của tôi'], rows: [['der Vater', 'mein Vater'], ['die Mutter', 'meine Mutter'], ['das Kind', 'mein Kind'], ['die Eltern', 'meine Eltern']], audioCols: [0, 1] } },
      { type: 'words', title: 'Bố mẹ', words: ['mutter', 'vater', 'eltern'], examples: {
        mutter: ex('Das ist meine Mutter.', 'Đây là mẹ tôi.'),
        vater: ex('Mein Vater ist sechzig Jahre alt.', 'Bố tôi sáu mươi tuổi.'),
        eltern: ex('Meine Eltern wohnen in Vietnam.', 'Bố mẹ tôi sống ở Việt Nam.'),
      } },
      { type: 'words', title: 'Anh chị em và gia đình', words: ['bruder', 'schwester', 'familie'], examples: {
        bruder: ex('Mein Bruder wohnt in Berlin.', 'Anh trai tôi sống ở Berlin.'),
        schwester: ex('Meine Schwester lernt Deutsch.', 'Chị gái tôi học tiếng Đức.'),
        familie: ex('Meine Familie ist groß.', 'Gia đình tôi đông người.'),
      } },
    ],
    sentences: [ex('Das ist meine Mutter.', 'Đây là mẹ tôi.'), ex('Mein Vater kommt aus Vietnam.', 'Bố tôi đến từ Việt Nam.'), ex('Meine Familie ist klein.', 'Gia đình tôi ít người.')],
    questions: [
      q('mein hay meine?', 'Das ist ___ Schwester.', ['mein', 'meine'], 'meine', 'die Schwester → meine.'),
      q('mein hay meine?', 'Das ist ___ Bruder.', ['mein', 'meine'], 'mein', 'der Bruder → mein.'),
      q('mein hay meine?', '___ Eltern wohnen in Hanoi.', ['Mein', 'Meine'], 'Meine', 'Số nhiều → meine.'),
    ],
  },
  {
    id: 'a0-questions', title: 'Câu hỏi với W', titleDe: 'W-Fragen', icon: '❓', minutes: 12, area: 'grammar',
    description: 'wer, was, wo, woher, wie.',
    objective: 'Hôm nay bạn sẽ học đặt câu hỏi với từ để hỏi: Wer? Was? Wo? – và động từ "machen" (làm).',
    teaches: ['wer', 'was', 'machen'],
    patterns: ['Wer ist das?', 'Was ist das?', 'Was machst du?'],
    steps: [
      { type: 'concept', title: 'Từ để hỏi bắt đầu bằng W', body: [
        'Hầu hết từ để hỏi bắt đầu bằng W: wer (ai), was (cái gì), wo (ở đâu), woher (từ đâu), wie (thế nào).',
        'Câu hỏi W: Từ để hỏi (vị trí 1) + động từ (vị trí 2) + chủ ngữ: Was machst du?',
      ], table: { headers: ['Từ để hỏi', 'Nghĩa', 'Ví dụ'], rows: [['wer', 'ai', 'Wer ist das?'], ['was', 'cái gì', 'Was ist das?'], ['wo', 'ở đâu', 'Wo ist die Katze?'], ['woher', 'từ đâu', 'Woher kommst du?'], ['wie', 'thế nào', 'Wie heißt du?']], audioCols: [2] } },
      { type: 'words', title: 'Từ mới', words: ['wer', 'was', 'machen'], examples: {
        wer: ex('Wer ist das? – Das ist mein Bruder.', 'Đó là ai? – Đó là anh trai tôi.'),
        was: ex('Was ist das? – Das ist ein Buch.', 'Đây là cái gì? – Đây là một quyển sách.'),
        machen: ex('Was machst du? – Ich lerne Deutsch.', 'Bạn đang làm gì? – Tôi học tiếng Đức.'),
      } },
      { type: 'examples', title: 'Hỏi và trả lời', items: [ex('Wo ist die Katze? – Sie ist hier.', 'Con mèo ở đâu? – Nó ở đây.'), ex('Wer ist die Frau? – Das ist meine Mutter.', 'Người phụ nữ đó là ai? – Đó là mẹ tôi.')] },
    ],
    sentences: [ex('Wer ist das?', 'Đó là ai?'), ex('Was machst du?', 'Bạn làm gì?'), ex('Wo ist der Hund?', 'Con chó ở đâu?'), ex('Was ist das?', 'Đây là cái gì?')],
    questions: [
      q('Chọn từ để hỏi', '___ ist das? – Das ist Anna.', ['Wer', 'Was', 'Wo'], 'Wer', 'Hỏi người → wer.'),
      q('Chọn từ để hỏi', '___ ist das? – Das ist ein Tisch.', ['Wer', 'Was', 'Wo'], 'Was', 'Hỏi vật → was.'),
      q('Chọn từ để hỏi', '___ ist die Lampe? – Hier.', ['Wer', 'Was', 'Wo'], 'Wo', 'Hỏi nơi chốn → wo.'),
      q('Chọn câu hỏi đúng', '"Bạn làm gì?"', ['Was du machst?', 'Was machst du?', 'Du machst was?'], 'Was machst du?', 'Từ để hỏi + động từ + chủ ngữ.'),
    ],
  },
  {
    id: 'a0-food', title: 'Đồ ăn', titleDe: 'Essen', icon: '🍎', minutes: 12, area: 'vocabulary',
    description: 'essen, Brot, Apfel, Reis, Banane, Ei, Käse.',
    objective: 'Hôm nay bạn sẽ học động từ "essen" (ăn) và 6 món ăn quen thuộc.',
    teaches: ['essen', 'brot', 'apfel', 'reis', 'banane', 'ei', 'kaese'],
    patterns: ['Ich esse …'],
    steps: [
      { type: 'concept', title: 'Ăn gì?', body: [
        '"essen" = ăn. Chú ý: du isst, er isst (e đổi thành i, giống sprechen).',
        'Khi nói ăn một loại thức ăn nói chung, không cần mạo từ: Ich esse Reis. Ich esse Brot.',
        'Khi ăn MỘT cái: Ich esse eine Banane / ein Ei. (Với giống đực: einen Apfel – học kỹ ở A1.)',
      ] },
      { type: 'words', title: 'Động từ và bánh mì', words: ['essen', 'brot', 'reis'], examples: {
        essen: ex('Ich esse Reis.', 'Tôi ăn cơm.'),
        brot: ex('Das Brot ist gut.', 'Bánh mì ngon.'),
        reis: ex('In Vietnam essen wir Reis.', 'Ở Việt Nam chúng tôi ăn cơm.'),
      } },
      { type: 'words', title: 'Trái cây, trứng, phô mai', words: ['apfel', 'banane', 'ei', 'kaese'], examples: {
        apfel: ex('Der Apfel ist klein.', 'Quả táo nhỏ.'),
        banane: ex('Ich esse eine Banane.', 'Tôi ăn một quả chuối.'),
        ei: ex('Isst du ein Ei?', 'Bạn có ăn một quả trứng không?'),
        kaese: ex('Der Käse ist gut.', 'Phô mai ngon.'),
      } },
    ],
    sentences: [ex('Ich esse Brot.', 'Tôi ăn bánh mì.'), ex('Isst du Reis?', 'Bạn có ăn cơm không?'), ex('Der Apfel ist gut.', 'Quả táo ngon.'), ex('Er isst eine Banane.', 'Anh ấy ăn một quả chuối.')],
    questions: [q('Chia essen', 'Du ___ Brot.', ['esst', 'isst', 'essen'], 'isst', 'du → isst.'), q('Chia essen', 'Er ___ ein Ei.', ['isst', 'esst', 'esse'], 'isst', 'er → isst.')],
  },
  {
    id: 'a0-drinks', title: 'Đồ uống', titleDe: 'Getränke', icon: '☕', minutes: 12, area: 'vocabulary',
    description: 'trinken, Wasser, Kaffee, Tee, Milch, Saft, Bier.',
    objective: 'Hôm nay bạn sẽ học động từ "trinken" (uống), 6 loại đồ uống và tính từ "kalt" (lạnh).',
    teaches: ['trinken', 'wasser', 'kaffee', 'tee', 'milch', 'saft', 'bier', 'kalt'],
    patterns: ['Ich trinke …'],
    steps: [
      { type: 'concept', title: 'Uống gì?', body: [
        '"trinken" = uống – động từ có quy tắc: ich trinke, du trinkst, er trinkt.',
        'Đồ uống thường là giống đực: der Kaffee, der Tee, der Saft. Ngoại lệ: das Wasser, das Bier, die Milch.',
      ] },
      { type: 'words', title: 'Động từ và nước', words: ['trinken', 'wasser', 'kalt', 'milch'], examples: {
        trinken: ex('Ich trinke Wasser.', 'Tôi uống nước.'),
        wasser: ex('Das Wasser ist kalt.', 'Nước lạnh.'),
        kalt: ex('Der Kaffee ist kalt.', 'Cà phê nguội rồi.'),
        milch: ex('Die Milch ist kalt.', 'Sữa lạnh.'),
      } },
      { type: 'words', title: 'Cà phê, trà, nước ép, bia', words: ['kaffee', 'tee', 'saft', 'bier'], examples: {
        kaffee: ex('Trinkst du Kaffee?', 'Bạn có uống cà phê không?'),
        tee: ex('Der Tee ist gut.', 'Trà ngon.'),
        saft: ex('Das Kind trinkt Saft.', 'Đứa trẻ uống nước ép.'),
        bier: ex('Er trinkt Bier.', 'Anh ấy uống bia.'),
      } },
    ],
    sentences: [ex('Ich trinke Kaffee.', 'Tôi uống cà phê.'), ex('Trinkst du Tee?', 'Bạn có uống trà không?'), ex('Die Milch ist nicht kalt.', 'Sữa không lạnh.'), ex('Wir trinken Wasser.', 'Chúng tôi uống nước.')],
    questions: [q('Chia trinken', 'Er ___ Saft.', ['trinke', 'trinkst', 'trinkt'], 'trinkt', 'er → -t.')],
  },
  {
    id: 'a0-objects', title: 'Đồ dùng hằng ngày', titleDe: 'Alltagsgegenstände', icon: '📱', minutes: 12, area: 'vocabulary',
    description: 'Handy, Schlüssel, Uhr, Computer, Heft, Stift.',
    objective: 'Hôm nay bạn sẽ học 6 đồ vật bạn dùng mỗi ngày và dùng chúng với các mẫu câu đã biết.',
    teaches: ['handy', 'schluessel', 'uhr', 'computer', 'heft', 'stift'],
    steps: [
      { type: 'concept', title: 'Dùng lại mẫu câu cũ', body: ['Sáu đồ vật bạn dùng mỗi ngày. Hãy dùng các câu bạn đã biết: Das ist …, Wo ist …?, Ich habe …'] },
      { type: 'words', title: 'Đồ điện tử', words: ['handy', 'computer', 'uhr'], examples: {
        handy: ex('Das ist mein Handy.', 'Đây là điện thoại của tôi.'),
        computer: ex('Der Computer ist alt.', 'Máy tính cũ rồi.'),
        uhr: ex('Die Uhr ist neu.', 'Cái đồng hồ mới.'),
      } },
      { type: 'words', title: 'Chìa khóa, vở, bút', words: ['schluessel', 'heft', 'stift'], examples: {
        schluessel: ex('Wo ist der Schlüssel?', 'Chìa khóa ở đâu?'),
        heft: ex('Hast du ein Heft?', 'Bạn có quyển vở không?'),
        stift: ex('Der Stift ist hier.', 'Cây bút ở đây.'),
      } },
    ],
    sentences: [ex('Wo ist mein Handy?', 'Điện thoại của tôi đâu?'), ex('Das ist ein Computer.', 'Đây là một cái máy tính.'), ex('Die Uhr ist schön.', 'Cái đồng hồ đẹp.'), ex('Ich habe ein Heft.', 'Tôi có một quyển vở.')],
  },
  {
    id: 'a0-word-order', title: 'Trật tự từ: động từ ở vị trí 2', titleDe: 'Satzbau', icon: '🧩', minutes: 12, area: 'grammar',
    description: 'heute, morgen, jetzt – và quy tắc vị trí 2.',
    objective: 'Hôm nay bạn sẽ học bắt đầu câu bằng thời gian (heute, morgen, jetzt) mà động từ vẫn ở vị trí 2.',
    teaches: ['heute', 'morgen', 'jetzt'],
    patterns: ['Heute bin ich …', 'Morgen lerne ich …'],
    steps: [
      { type: 'concept', title: 'Vị trí 1 có thể là thời gian', body: [
        'Bạn đã biết: trong câu kể, động từ đứng ở vị trí 2.',
        'Vị trí 1 không nhất thiết là chủ ngữ. Có thể là thời gian, ví dụ "heute" (hôm nay). Khi đó chủ ngữ đứng NGAY SAU động từ: Heute bin ich müde.',
        'So sánh: "Ich bin heute müde." và "Heute bin ich müde." – cả hai đều đúng, động từ "bin" luôn ở vị trí 2.',
      ], table: { headers: ['Vị trí 1', 'Vị trí 2 (động từ)', 'Phần còn lại'], rows: [['Ich', 'bin', 'heute müde.'], ['Heute', 'bin', 'ich müde.'], ['Morgen', 'lerne', 'ich Deutsch.'], ['Jetzt', 'trinke', 'ich Kaffee.']], audioCols: [0, 1, 2] } },
      { type: 'words', title: 'Từ chỉ thời gian', words: ['heute', 'morgen', 'jetzt'], examples: {
        heute: ex('Heute bin ich müde.', 'Hôm nay tôi mệt.'),
        morgen: ex('Morgen lerne ich Deutsch.', 'Ngày mai tôi học tiếng Đức.'),
        jetzt: ex('Jetzt trinke ich Kaffee.', 'Bây giờ tôi uống cà phê.'),
      } },
      { type: 'tip', title: 'Chúc mừng!', body: 'Đây là bài cuối của A0. Bạn đã có nền móng: phát âm, mạo từ, động từ sein/haben, chia động từ, câu hỏi và trật tự từ. Bước tiếp theo là A1 – cuộc sống hằng ngày.' },
    ],
    sentences: [ex('Heute bin ich müde.', 'Hôm nay tôi mệt.'), ex('Morgen lerne ich Deutsch.', 'Ngày mai tôi học tiếng Đức.'), ex('Jetzt esse ich Brot.', 'Bây giờ tôi ăn bánh mì.')],
    questions: [
      q('Chọn câu đúng', '"Hôm nay tôi mệt."', ['Heute ich bin müde.', 'Heute bin ich müde.', 'Heute müde ich bin.'], 'Heute bin ich müde.', 'Động từ ở vị trí 2, chủ ngữ ngay sau.'),
      q('Chọn câu đúng', '"Ngày mai anh ấy học tiếng Đức."', ['Morgen lernt er Deutsch.', 'Morgen er lernt Deutsch.'], 'Morgen lernt er Deutsch.', 'Morgen (1) – lernt (2) – er.'),
    ],
  },
];

/** A0 lessons: numbered, linked in a chain (each unit needs the previous one). */
export const a0Lessons: Lesson[] = drafts.map((d, i) => ({
  ...d,
  level: 'A0',
  unit: i + 1,
  order: i + 1,
  prerequisites: d.prerequisites ?? (i > 0 ? [drafts[i - 1].id] : []),
}));
