import type { ReadingQuestion, ReadingText } from '@/types/models';

const RF = ['Richtig', 'Falsch'];

/** Helper: Richtig/Falsch question. */
const rf = (id: string, statement: string, correct: boolean, explanation: string): ReadingQuestion => ({
  id, statement, options: RF, answer: correct ? 'Richtig' : 'Falsch', explanation,
});

/** Helper: multiple-choice question. */
const mc = (id: string, statement: string, options: string[], answer: string, explanation: string): ReadingQuestion => ({
  id, statement, options, answer, explanation,
});

export const readings: ReadingText[] = [
  {
    id: 'invitation', title: 'Thư mời sinh nhật', titleDe: 'Eine Einladung', icon: '🎂', level: 'A1', kind: 'E-Mail',
    context: 'Bạn nhận được email của Anna. Đọc và chọn Richtig (đúng) hoặc Falsch (sai).',
    text: [
      'Liebe Mai,',
      'am Samstag habe ich Geburtstag und ich mache eine kleine Party. Die Party beginnt um 19 Uhr bei mir zu Hause in der Gartenstraße 8.',
      'Kannst du kommen? Du musst nichts mitbringen, aber du kannst gern deinen Freund Tom mitbringen.',
      'Bitte antworte bis Donnerstag.',
      'Viele Grüße\nAnna',
    ],
    textVi: [
      'Mai thân mến,',
      'Thứ Bảy này là sinh nhật mình và mình tổ chức một bữa tiệc nhỏ. Tiệc bắt đầu lúc 19 giờ tại nhà mình ở số 8 phố Gartenstraße.',
      'Bạn đến được không? Bạn không cần mang gì cả, nhưng bạn có thể dẫn bạn trai Tom theo.',
      'Hãy trả lời mình trước thứ Năm nhé.',
      'Thân ái\nAnna',
    ],
    glossary: [
      { de: 'der Geburtstag', vi: 'sinh nhật' },
      { de: 'mitbringen', vi: 'mang theo, dẫn theo' },
      { de: 'antworten', vi: 'trả lời' },
      { de: 'bis Donnerstag', vi: 'trước / đến thứ Năm' },
    ],
    questions: [
      rf('inv1', 'Anna hat am Sonntag Geburtstag.', false, 'Bài đọc: "am Samstag habe ich Geburtstag" – thứ Bảy, không phải Chủ nhật.'),
      rf('inv2', 'Die Party ist bei Anna zu Hause.', true, 'Bài đọc: "bei mir zu Hause in der Gartenstraße 8".'),
      rf('inv3', 'Mai soll Essen mitbringen.', false, 'Bài đọc: "Du musst nichts mitbringen" – không cần mang gì.'),
      rf('inv4', 'Mai soll bis Donnerstag antworten.', true, 'Bài đọc: "Bitte antworte bis Donnerstag."'),
    ],
  },
  {
    id: 'sms-cancel', title: 'Tin nhắn hủy hẹn', titleDe: 'Eine SMS von Tom', icon: '📱', level: 'A1', kind: 'SMS',
    context: 'Tom gửi tin nhắn cho Minh. Đọc và chọn Richtig hoặc Falsch.',
    text: [
      'Hallo Minh, tut mir leid, ich kann heute nicht ins Kino kommen. Ich bin krank und habe Fieber.',
      'Können wir am Freitag gehen? Der Film läuft noch bis Sonntag.',
      'Ruf mich bitte an!\nTom',
    ],
    textVi: [
      'Chào Minh, xin lỗi nhé, hôm nay mình không đi xem phim được. Mình bị ốm và bị sốt.',
      'Thứ Sáu mình đi được không? Phim còn chiếu đến Chủ nhật.',
      'Gọi cho mình nhé!\nTom',
    ],
    glossary: [
      { de: 'Tut mir leid.', vi: 'Xin lỗi / Tôi rất tiếc.' },
      { de: 'das Fieber', vi: 'sốt' },
      { de: 'Der Film läuft …', vi: 'Phim đang chiếu …' },
      { de: 'anrufen', vi: 'gọi điện' },
    ],
    questions: [
      rf('sms1', 'Tom geht heute ins Kino.', false, 'Bài đọc: "ich kann heute nicht ins Kino kommen".'),
      rf('sms2', 'Tom ist krank.', true, 'Bài đọc: "Ich bin krank und habe Fieber."'),
      rf('sms3', 'Den Film gibt es nur noch heute.', false, 'Bài đọc: "Der Film läuft noch bis Sonntag" – còn chiếu đến Chủ nhật.'),
      rf('sms4', 'Minh soll Tom anrufen.', true, 'Bài đọc: "Ruf mich bitte an!"'),
    ],
  },
  {
    id: 'practice-hours', title: 'Giờ khám bệnh', titleDe: 'Sprechzeiten', icon: '🩺', level: 'A1', kind: 'Schild',
    context: 'Bạn đọc tấm biển ở cửa phòng khám. Chọn câu trả lời đúng.',
    text: [
      'Praxis Dr. Sommer – Allgemeinmedizin',
      'Sprechzeiten:\nMontag bis Freitag: 8 bis 12 Uhr\nMontag und Donnerstag: 15 bis 18 Uhr',
      'Mittwochnachmittag geschlossen.',
      'Termine bitte nur per Telefon: 030 123456',
    ],
    textVi: [
      'Phòng khám bác sĩ Sommer – Đa khoa',
      'Giờ khám:\nThứ Hai đến thứ Sáu: 8 đến 12 giờ\nThứ Hai và thứ Năm: 15 đến 18 giờ',
      'Chiều thứ Tư đóng cửa.',
      'Đặt lịch hẹn chỉ qua điện thoại: 030 123456',
    ],
    glossary: [
      { de: 'die Sprechzeiten', vi: 'giờ khám / giờ tiếp khách' },
      { de: 'die Allgemeinmedizin', vi: 'đa khoa' },
      { de: 'geschlossen', vi: 'đóng cửa' },
      { de: 'per Telefon', vi: 'qua điện thoại' },
    ],
    questions: [
      mc('ph1', 'Kann man am Dienstag um 16 Uhr zum Arzt gehen?', ['Ja', 'Nein'], 'Nein', 'Buổi chiều chỉ khám thứ Hai và thứ Năm (15–18 giờ).'),
      mc('ph2', 'Wann ist die Praxis am Freitag geöffnet?', ['von 8 bis 12 Uhr', 'von 15 bis 18 Uhr', 'den ganzen Tag'], 'von 8 bis 12 Uhr', 'Thứ Sáu chỉ có giờ khám buổi sáng: 8–12 giờ.'),
      mc('ph3', 'Wie bekommt man einen Termin?', ['per Telefon', 'per E-Mail', 'ohne Anmeldung'], 'per Telefon', 'Bài đọc: "Termine bitte nur per Telefon".'),
    ],
  },
  {
    id: 'flat-ads', title: 'Rao thuê căn hộ', titleDe: 'Wohnungsanzeigen', icon: '🏠', level: 'A1', kind: 'Anzeige',
    context: 'Bạn đang tìm căn hộ. Đọc hai tin rao và trả lời câu hỏi.',
    text: [
      'A) 2-Zimmer-Wohnung im Zentrum, 55 m², Balkon, 3. Stock, kein Aufzug. Miete: 750 Euro warm. Frei ab 1. Mai.',
      'B) Schöne 3-Zimmer-Wohnung am Stadtrand, 80 m², mit Garten, sehr ruhig. Miete: 980 Euro warm. Haustiere sind erlaubt. Ab sofort frei.',
    ],
    textVi: [
      'A) Căn hộ 2 phòng ở trung tâm, 55 m², có ban công, tầng 3, không có thang máy. Tiền thuê: 750 euro đã gồm sưởi. Trống từ ngày 1 tháng 5.',
      'B) Căn hộ 3 phòng đẹp ở ngoại ô, 80 m², có vườn, rất yên tĩnh. Tiền thuê: 980 euro đã gồm sưởi. Được nuôi thú cưng. Trống ngay bây giờ.',
    ],
    glossary: [
      { de: 'der Stadtrand', vi: 'ngoại ô' },
      { de: 'warm', vi: '(tiền thuê) đã gồm sưởi và chi phí phụ' },
      { de: 'Haustiere erlaubt', vi: 'được nuôi thú cưng' },
      { de: 'ab sofort', vi: 'ngay từ bây giờ' },
    ],
    questions: [
      mc('fa1', 'Sie haben einen Hund. Welche Wohnung passt?', ['Wohnung A', 'Wohnung B'], 'Wohnung B', 'Căn B: "Haustiere sind erlaubt" – được nuôi thú cưng.'),
      mc('fa2', 'Sie möchten im Zentrum wohnen. Welche Wohnung passt?', ['Wohnung A', 'Wohnung B'], 'Wohnung A', 'Căn A ở "im Zentrum", căn B ở ngoại ô.'),
      rf('fa3', 'Wohnung A hat einen Aufzug.', false, 'Căn A: "kein Aufzug" – không có thang máy.'),
      rf('fa4', 'Wohnung B ist ab sofort frei.', true, 'Căn B: "Ab sofort frei."'),
    ],
  },
  {
    id: 'department-store', title: 'Sơ đồ trung tâm thương mại', titleDe: 'Im Kaufhaus', icon: '🏬', level: 'A1', kind: 'Wegweiser',
    context: 'Bạn đang ở trung tâm thương mại. Đọc bảng chỉ dẫn và chọn tầng đúng.',
    text: [
      'Kaufhaus Stern – Wegweiser',
      'Untergeschoss: Lebensmittel, Getränke',
      'Erdgeschoss: Information, Kosmetik, Taschen',
      '1. Stock: Damenmode, Schuhe',
      '2. Stock: Herrenmode, Kindermode',
      '3. Stock: Elektronik, Handys, Computer',
      '4. Stock: Restaurant, Toiletten',
    ],
    textVi: [
      'Trung tâm thương mại Stern – Bảng chỉ dẫn',
      'Tầng hầm: thực phẩm, đồ uống',
      'Tầng trệt: quầy thông tin, mỹ phẩm, túi xách',
      'Tầng 1: thời trang nữ, giày dép',
      'Tầng 2: thời trang nam, thời trang trẻ em',
      'Tầng 3: đồ điện tử, điện thoại, máy tính',
      'Tầng 4: nhà hàng, nhà vệ sinh',
    ],
    glossary: [
      { de: 'das Untergeschoss', vi: 'tầng hầm' },
      { de: 'das Erdgeschoss', vi: 'tầng trệt' },
      { de: 'der Stock', vi: 'tầng (lầu)' },
      { de: 'die Damenmode / Herrenmode', vi: 'thời trang nữ / nam' },
    ],
    questions: [
      mc('ds1', 'Sie brauchen ein neues Handy. Wohin gehen Sie?', ['Erdgeschoss', '2. Stock', '3. Stock'], '3. Stock', 'Điện thoại (Handys) ở tầng 3.'),
      mc('ds2', 'Sie möchten Milch kaufen. Wohin gehen Sie?', ['Untergeschoss', '1. Stock', '4. Stock'], 'Untergeschoss', 'Thực phẩm (Lebensmittel) ở tầng hầm.'),
      mc('ds3', 'Sie suchen eine Hose für Ihren Mann. Wohin gehen Sie?', ['1. Stock', '2. Stock', 'Erdgeschoss'], '2. Stock', 'Thời trang nam (Herrenmode) ở tầng 2.'),
      mc('ds4', 'Sie möchten zu Mittag essen. Wohin gehen Sie?', ['Erdgeschoss', '3. Stock', '4. Stock'], '4. Stock', 'Nhà hàng (Restaurant) ở tầng 4.'),
    ],
  },
  {
    id: 'course-ad', title: 'Quảng cáo khóa học', titleDe: 'Deutschkurs an der VHS', icon: '📚', level: 'A1', kind: 'Anzeige',
    context: 'Bạn đọc quảng cáo khóa tiếng Đức ở trung tâm giáo dục (Volkshochschule – VHS). Chọn Richtig hoặc Falsch.',
    text: [
      'Volkshochschule Köln – Deutsch für Anfänger (A1)',
      'Wann? Montag und Mittwoch, 18 bis 20 Uhr',
      'Wo? Raum 12, Neumarkt 3',
      'Beginn: 6. März – Kosten: 120 Euro für 10 Termine',
      'Anmeldung im Internet oder im Büro (Montag bis Freitag, 9 bis 13 Uhr)',
    ],
    textVi: [
      'Trung tâm giáo dục Köln – Tiếng Đức cho người mới bắt đầu (A1)',
      'Khi nào? Thứ Hai và thứ Tư, 18 đến 20 giờ',
      'Ở đâu? Phòng 12, Neumarkt số 3',
      'Khai giảng: 6 tháng 3 – Học phí: 120 euro cho 10 buổi',
      'Đăng ký trên mạng hoặc tại văn phòng (thứ Hai đến thứ Sáu, 9 đến 13 giờ)',
    ],
    glossary: [
      { de: 'der Anfänger', vi: 'người mới bắt đầu' },
      { de: 'der Beginn', vi: 'sự bắt đầu, ngày khai giảng' },
      { de: 'die Kosten', vi: 'chi phí' },
      { de: 'die Anmeldung', vi: 'việc đăng ký' },
    ],
    questions: [
      rf('ca1', 'Der Kurs ist am Vormittag.', false, 'Lớp học từ 18 đến 20 giờ – buổi tối, không phải buổi sáng.'),
      rf('ca2', 'Der Kurs kostet 120 Euro.', true, 'Bài đọc: "Kosten: 120 Euro für 10 Termine".'),
      rf('ca3', 'Man kann sich im Internet anmelden.', true, 'Bài đọc: "Anmeldung im Internet oder im Büro".'),
      rf('ca4', 'Der Kurs ist dreimal pro Woche.', false, 'Chỉ hai buổi một tuần: thứ Hai và thứ Tư.'),
    ],
  },
  {
    id: 'departures', title: 'Bảng giờ tàu', titleDe: 'Abfahrt', icon: '🚉', level: 'A1', kind: 'Fahrplan',
    context: 'Bạn đang ở ga Frankfurt và đọc bảng giờ tàu khởi hành.',
    text: [
      'Abfahrt – Frankfurt Hauptbahnhof',
      '9:12 Uhr – ICE nach Berlin – Gleis 7',
      '9:20 Uhr – RE nach Mainz – Gleis 12 – heute circa 15 Minuten später',
      '9:35 Uhr – S8 zum Flughafen – Gleis 102',
      '9:48 Uhr – IC nach Köln – Gleis 9',
    ],
    textVi: [
      'Giờ khởi hành – Ga chính Frankfurt',
      '9:12 – Tàu ICE đi Berlin – Đường ray 7',
      '9:20 – Tàu RE đi Mainz – Đường ray 12 – hôm nay trễ khoảng 15 phút',
      '9:35 – Tàu S8 ra sân bay – Đường ray 102',
      '9:48 – Tàu IC đi Köln – Đường ray 9',
    ],
    glossary: [
      { de: 'der Hauptbahnhof', vi: 'ga chính' },
      { de: 'das Gleis', vi: 'đường ray (số sân ga)' },
      { de: 'später', vi: 'muộn hơn' },
      { de: 'circa', vi: 'khoảng' },
    ],
    questions: [
      rf('dp1', 'Der Zug nach Berlin fährt von Gleis 7.', true, 'Dòng 2: "ICE nach Berlin – Gleis 7".'),
      rf('dp2', 'Der Zug nach Mainz hat heute Verspätung.', true, '"heute circa 15 Minuten später" – hôm nay trễ khoảng 15 phút.'),
      rf('dp3', 'Zum Flughafen fährt man mit dem ICE.', false, 'Ra sân bay đi tàu S8, không phải ICE.'),
      mc('dp4', 'Wann fährt der Zug nach Köln?', ['um 9:12 Uhr', 'um 9:35 Uhr', 'um 9:48 Uhr'], 'um 9:48 Uhr', 'Dòng cuối: "9:48 Uhr – IC nach Köln".'),
    ],
  },
  {
    id: 'teacher-mail', title: 'Email xin nghỉ học', titleDe: 'E-Mail an die Lehrerin', icon: '✉️', level: 'A1', kind: 'E-Mail',
    context: 'Chị Hoa viết email cho cô giáo. Đọc và chọn Richtig hoặc Falsch.',
    text: [
      'Sehr geehrte Frau Wagner,',
      'leider kann ich morgen nicht zum Kurs kommen. Mein Sohn ist krank und ich muss mit ihm zum Arzt gehen.',
      'Können Sie mir bitte die Hausaufgaben schicken? Am Donnerstag bin ich wieder da.',
      'Mit freundlichen Grüßen\nHoa Tran',
    ],
    textVi: [
      'Kính gửi cô Wagner,',
      'Tiếc là ngày mai em không thể đến lớp. Con trai em bị ốm và em phải đưa cháu đi khám bác sĩ.',
      'Cô có thể gửi cho em bài tập về nhà được không ạ? Thứ Năm em sẽ đi học lại.',
      'Trân trọng\nHoa Trần',
    ],
    glossary: [
      { de: 'Sehr geehrte Frau …', vi: 'Kính gửi bà/cô … (thư trang trọng)' },
      { de: 'leider', vi: 'tiếc là' },
      { de: 'die Hausaufgaben', vi: 'bài tập về nhà' },
      { de: 'Mit freundlichen Grüßen', vi: 'Trân trọng' },
    ],
    questions: [
      rf('tm1', 'Hoa ist krank.', false, 'Người bị ốm là con trai chị Hoa: "Mein Sohn ist krank".'),
      rf('tm2', 'Hoa geht mit ihrem Sohn zum Arzt.', true, 'Bài đọc: "ich muss mit ihm zum Arzt gehen".'),
      rf('tm3', 'Hoa möchte die Hausaufgaben bekommen.', true, 'Bài đọc: "Können Sie mir bitte die Hausaufgaben schicken?"'),
      rf('tm4', 'Hoa kommt am Mittwoch wieder zum Kurs.', false, 'Bài đọc: "Am Donnerstag bin ich wieder da" – thứ Năm.'),
    ],
  },
  {
    id: 'my-day', title: 'Một ngày của Lan', titleDe: 'Lans Tag', icon: '☀️', level: 'A1', kind: 'Text',
    context: 'Lan kể về một ngày của mình ở Đức. Đọc và chọn Richtig hoặc Falsch.',
    text: [
      'Ich heiße Lan und ich wohne seit zwei Jahren in Leipzig. Ich arbeite als Krankenpflegerin in einem Krankenhaus.',
      'Ich stehe jeden Tag um halb sechs auf, denn die Arbeit beginnt um sieben Uhr. Ich fahre mit der Straßenbahn zur Arbeit.',
      'Um 15 Uhr habe ich Feierabend. Am Nachmittag gehe ich einkaufen oder ich lerne Deutsch.',
      'Am Abend koche ich oft vietnamesisch und telefoniere mit meiner Familie in Vietnam.',
    ],
    textVi: [
      'Tôi tên là Lan và tôi sống ở Leipzig được hai năm. Tôi làm điều dưỡng ở một bệnh viện.',
      'Hằng ngày tôi dậy lúc năm giờ rưỡi, vì công việc bắt đầu lúc bảy giờ. Tôi đi tàu điện đến chỗ làm.',
      'Lúc 15 giờ tôi tan làm. Buổi chiều tôi đi mua sắm hoặc học tiếng Đức.',
      'Buổi tối tôi thường nấu món Việt và gọi điện cho gia đình ở Việt Nam.',
    ],
    glossary: [
      { de: 'seit zwei Jahren', vi: 'được hai năm (từ hai năm nay)' },
      { de: 'die Krankenpflegerin', vi: 'nữ điều dưỡng' },
      { de: 'halb sechs', vi: '5 giờ 30' },
      { de: 'der Feierabend', vi: 'giờ tan làm' },
    ],
    questions: [
      rf('md1', 'Lan wohnt seit zwei Jahren in Leipzig.', true, 'Câu đầu: "ich wohne seit zwei Jahren in Leipzig".'),
      rf('md2', 'Lan steht um 6:30 Uhr auf.', false, '"halb sechs" = 5:30, không phải 6:30!'),
      rf('md3', 'Lan fährt mit dem Bus zur Arbeit.', false, 'Lan đi tàu điện: "mit der Straßenbahn".'),
      rf('md4', 'Am Abend telefoniert Lan mit ihrer Familie.', true, 'Câu cuối: "telefoniere mit meiner Familie in Vietnam".'),
    ],
  },
  {
    id: 'signs', title: 'Biển báo và thông báo', titleDe: 'Schilder', icon: '🪧', level: 'A1', kind: 'Schilder',
    context: 'Bạn thấy bốn tấm biển trong thành phố. Đọc và chọn Richtig hoặc Falsch.',
    text: [
      'Schild 1: Bitte nicht rauchen!',
      'Schild 2: Heute wegen Krankheit geschlossen. Ab Montag sind wir wieder für Sie da.',
      'Schild 3: Aufzug außer Betrieb. Bitte benutzen Sie die Treppe.',
      'Schild 4: Sonderangebot! Alle T-Shirts nur 5 Euro.',
    ],
    textVi: [
      'Biển 1: Xin đừng hút thuốc!',
      'Biển 2: Hôm nay đóng cửa vì ốm. Từ thứ Hai chúng tôi lại phục vụ quý khách.',
      'Biển 3: Thang máy hỏng. Xin vui lòng đi cầu thang bộ.',
      'Biển 4: Khuyến mãi đặc biệt! Tất cả áo phông chỉ 5 euro.',
    ],
    glossary: [
      { de: 'wegen Krankheit', vi: 'vì ốm' },
      { de: 'außer Betrieb', vi: 'không hoạt động, hỏng' },
      { de: 'benutzen', vi: 'sử dụng' },
      { de: 'das Sonderangebot', vi: 'hàng khuyến mãi đặc biệt' },
    ],
    questions: [
      rf('sg1', 'Schild 1: Hier darf man rauchen.', false, '"Bitte nicht rauchen!" – không được hút thuốc.'),
      rf('sg2', 'Schild 2: Das Geschäft ist heute geöffnet.', false, '"Heute … geschlossen" – hôm nay đóng cửa.'),
      rf('sg3', 'Schild 3: Man muss die Treppe nehmen.', true, 'Thang máy hỏng, phải đi cầu thang bộ.'),
      rf('sg4', 'Schild 4: Ein T-Shirt kostet 5 Euro.', true, '"Alle T-Shirts nur 5 Euro."'),
    ],
  },
];
