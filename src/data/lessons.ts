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

/* ---------- Level 1 – A1 phrases ---------- */

const family: Phrase[] = [
  { de: 'die Eltern', vi: 'bố mẹ', emoji: '👫' },
  { de: 'die Geschwister', vi: 'anh chị em ruột', emoji: '👧👦' },
  { de: 'der Sohn', vi: 'con trai', emoji: '👦' },
  { de: 'die Tochter', vi: 'con gái', emoji: '👧' },
  { de: 'die Großeltern', vi: 'ông bà', emoji: '👴👵' },
  { de: 'der Mann / die Frau', vi: 'chồng / vợ', emoji: '💑', note: 'mein Mann = chồng tôi, meine Frau = vợ tôi.' },
  { de: 'Ich bin verheiratet.', vi: 'Tôi đã kết hôn.', emoji: '💍' },
  { de: 'Ich bin ledig.', vi: 'Tôi còn độc thân.' },
  { de: 'Hast du Kinder?', vi: 'Bạn có con không?' },
  { de: 'Ich habe einen Sohn und eine Tochter.', vi: 'Tôi có một con trai và một con gái.' },
];

const clock: Phrase[] = [
  { de: 'Wie spät ist es?', vi: 'Mấy giờ rồi?', emoji: '⌚' },
  { de: 'Es ist acht Uhr.', vi: '8 giờ.', emoji: '🕗' },
  { de: 'Es ist Viertel nach acht.', vi: '8 giờ 15.', emoji: '🕗', note: 'nach = hơn (sau).' },
  { de: 'Es ist halb neun.', vi: '8 giờ 30.', emoji: '🕣', note: 'Chú ý: "halb neun" = còn nửa tiếng nữa đến 9 giờ = 8:30!' },
  { de: 'Es ist Viertel vor neun.', vi: '8 giờ 45 (9 giờ kém 15).', emoji: '🕘', note: 'vor = kém (trước).' },
  { de: 'Es ist zehn nach drei.', vi: '3 giờ 10.', emoji: '🕒' },
  { de: 'Um wie viel Uhr?', vi: 'Lúc mấy giờ?' },
  { de: 'Um 14 Uhr.', vi: 'Lúc 14 giờ.', note: 'Lịch tàu, giờ làm việc thường dùng 24 giờ: vierzehn Uhr.' },
  { de: 'Wann hast du Zeit?', vi: 'Khi nào bạn rảnh?' },
];

const daily: Phrase[] = [
  { de: 'Ich stehe um sechs Uhr auf.', vi: 'Tôi thức dậy lúc 6 giờ.', emoji: '⏰' },
  { de: 'Ich dusche.', vi: 'Tôi tắm (vòi sen).', emoji: '🚿' },
  { de: 'Ich frühstücke.', vi: 'Tôi ăn sáng.', emoji: '🥐' },
  { de: 'Ich fahre zur Arbeit.', vi: 'Tôi đi làm.', emoji: '🚌' },
  { de: 'Ich esse zu Mittag.', vi: 'Tôi ăn trưa.', emoji: '🍱' },
  { de: 'Ich kaufe ein.', vi: 'Tôi đi mua sắm.', emoji: '🛒' },
  { de: 'Ich koche das Abendessen.', vi: 'Tôi nấu bữa tối.', emoji: '🍳' },
  { de: 'Ich sehe fern.', vi: 'Tôi xem TV.', emoji: '📺' },
  { de: 'Ich gehe um elf Uhr ins Bett.', vi: 'Tôi đi ngủ lúc 11 giờ.', emoji: '🛏️' },
];

const food: Phrase[] = [
  { de: 'das Frühstück', vi: 'bữa sáng', emoji: '🥐' },
  { de: 'das Mittagessen', vi: 'bữa trưa', emoji: '🍝' },
  { de: 'das Abendessen', vi: 'bữa tối', emoji: '🍲' },
  { de: 'Ich habe Hunger.', vi: 'Tôi đói.', emoji: '😋' },
  { de: 'Ich habe Durst.', vi: 'Tôi khát.', emoji: '🥤' },
  { de: 'Ich esse gern Reis.', vi: 'Tôi thích ăn cơm.', emoji: '🍚' },
  { de: 'Ich trinke keinen Alkohol.', vi: 'Tôi không uống rượu bia.' },
  { de: 'Ich esse kein Fleisch.', vi: 'Tôi không ăn thịt.', emoji: '🥦' },
  { de: 'Das schmeckt gut!', vi: 'Món này ngon!', emoji: '😍' },
  { de: 'Guten Appetit!', vi: 'Chúc ngon miệng!', emoji: '🍽️' },
];

const cafe: Phrase[] = [
  { de: 'Ist hier noch frei?', vi: 'Chỗ này còn trống không?', emoji: '🪑' },
  { de: 'Die Speisekarte, bitte.', vi: 'Cho tôi xem thực đơn.', emoji: '📋' },
  { de: 'Was möchten Sie?', vi: 'Ông/bà muốn dùng gì?' },
  { de: 'Ich hätte gern einen Kaffee.', vi: 'Cho tôi một ly cà phê.', emoji: '☕', note: '"Ich hätte gern…" rất lịch sự khi gọi món.' },
  { de: 'Ich nehme die Suppe.', vi: 'Tôi chọn món súp.', emoji: '🍜' },
  { de: 'Noch etwas?', vi: 'Còn gì nữa không?' },
  { de: 'Die Rechnung, bitte.', vi: 'Cho tôi hóa đơn.', emoji: '🧾' },
  { de: 'Zusammen oder getrennt?', vi: 'Trả chung hay riêng?', note: 'Ở Đức mỗi người thường tự trả phần mình (getrennt).' },
  { de: 'Stimmt so.', vi: 'Không cần thối lại.', note: 'Tiền tip ở Đức thường khoảng 5–10%.' },
];

const shopping: Phrase[] = [
  { de: 'Was kostet das?', vi: 'Cái này giá bao nhiêu?', emoji: '🏷️' },
  { de: 'Das kostet 2,50 Euro.', vi: 'Cái này giá 2,50 euro.', emoji: '💶', note: 'Đọc: zwei Euro fünfzig.' },
  { de: 'Ich suche Milch.', vi: 'Tôi đang tìm sữa.', emoji: '🥛' },
  { de: 'Haben Sie Brot?', vi: 'Ông/bà có bánh mì không?', emoji: '🍞' },
  { de: 'ein Kilo Tomaten', vi: 'một ký cà chua', emoji: '🍅' },
  { de: 'eine Flasche Wasser', vi: 'một chai nước', emoji: '💧' },
  { de: 'Das ist zu teuer.', vi: 'Cái này đắt quá.', emoji: '💸' },
  { de: 'Kann ich mit Karte zahlen?', vi: 'Tôi trả bằng thẻ được không?', emoji: '💳' },
  { de: 'Brauchen Sie eine Tüte?', vi: 'Ông/bà có cần túi không?', emoji: '🛍️' },
];

const home: Phrase[] = [
  { de: 'das Zimmer', vi: 'căn phòng', emoji: '🚪' },
  { de: 'das Wohnzimmer', vi: 'phòng khách', emoji: '🛋️' },
  { de: 'das Schlafzimmer', vi: 'phòng ngủ', emoji: '🛏️' },
  { de: 'die Küche', vi: 'nhà bếp', emoji: '🍳' },
  { de: 'das Bad', vi: 'phòng tắm', emoji: '🛁' },
  { de: 'der Balkon', vi: 'ban công', emoji: '🌿' },
  { de: 'Die Wohnung hat drei Zimmer.', vi: 'Căn hộ có ba phòng.' },
  { de: 'Die Miete ist 800 Euro warm.', vi: 'Tiền thuê là 800 euro (đã gồm sưởi, nước).', note: 'warm = đã gồm chi phí phụ; kalt = chưa gồm.' },
  { de: 'Die Wohnung ist hell und ruhig.', vi: 'Căn hộ sáng sủa và yên tĩnh.' },
];

const city: Phrase[] = [
  { de: 'Entschuldigung, wo ist der Bahnhof?', vi: 'Xin lỗi, nhà ga ở đâu?', emoji: '🙋' },
  { de: 'Gehen Sie geradeaus.', vi: 'Ông/bà đi thẳng.', emoji: '⬆️' },
  { de: 'Gehen Sie nach links.', vi: 'Ông/bà rẽ trái.', emoji: '⬅️' },
  { de: 'Gehen Sie nach rechts.', vi: 'Ông/bà rẽ phải.', emoji: '➡️' },
  { de: 'Die Post ist neben der Bank.', vi: 'Bưu điện ở cạnh ngân hàng.', emoji: '🏤' },
  { de: 'Ist das weit?', vi: 'Có xa không?' },
  { de: 'Nein, nur fünf Minuten zu Fuß.', vi: 'Không, chỉ đi bộ 5 phút.', emoji: '🚶' },
  { de: 'Die erste Straße links.', vi: 'Con đường thứ nhất bên trái.' },
  { de: 'Ich kenne mich hier nicht aus.', vi: 'Tôi không rành khu này.' },
];

const transport: Phrase[] = [
  { de: 'Eine Fahrkarte nach München, bitte.', vi: 'Cho tôi một vé đi München.', emoji: '🎫' },
  { de: 'Einfach oder hin und zurück?', vi: 'Một chiều hay khứ hồi?' },
  { de: 'Von welchem Gleis fährt der Zug?', vi: 'Tàu chạy từ đường ray số mấy?', emoji: '🚉' },
  { de: 'Der Zug hat Verspätung.', vi: 'Tàu bị trễ.', emoji: '⏳' },
  { de: 'Wo muss ich umsteigen?', vi: 'Tôi phải đổi tàu ở đâu?', emoji: '🔄' },
  { de: 'Ich fahre mit dem Bus.', vi: 'Tôi đi bằng xe buýt.', emoji: '🚌' },
  { de: 'Ich fahre mit dem Fahrrad.', vi: 'Tôi đi bằng xe đạp.', emoji: '🚲' },
  { de: 'Ich gehe zu Fuß.', vi: 'Tôi đi bộ.', emoji: '🚶' },
  { de: 'Die nächste Haltestelle ist …', vi: 'Trạm dừng tiếp theo là …', emoji: '🚏' },
];

const freetime: Phrase[] = [
  { de: 'Was machst du in deiner Freizeit?', vi: 'Lúc rảnh bạn làm gì?' },
  { de: 'Ich lese gern.', vi: 'Tôi thích đọc sách.', emoji: '📚' },
  { de: 'Ich spiele gern Fußball.', vi: 'Tôi thích chơi bóng đá.', emoji: '⚽' },
  { de: 'Ich höre gern Musik.', vi: 'Tôi thích nghe nhạc.', emoji: '🎧' },
  { de: 'Ich gehe gern schwimmen.', vi: 'Tôi thích đi bơi.', emoji: '🏊' },
  { de: 'Hast du am Samstag Zeit?', vi: 'Thứ Bảy bạn có rảnh không?', emoji: '📅' },
  { de: 'Wollen wir ins Kino gehen?', vi: 'Chúng mình đi xem phim nhé?', emoji: '🎬' },
  { de: 'Gute Idee!', vi: 'Ý hay đấy!', emoji: '👍' },
  { de: 'Leider habe ich keine Zeit.', vi: 'Tiếc là tôi không có thời gian.', emoji: '😕' },
];

const work: Phrase[] = [
  { de: 'Was sind Sie von Beruf?', vi: 'Ông/bà làm nghề gì?' },
  { de: 'Ich bin Ingenieur.', vi: 'Tôi là kỹ sư.', emoji: '👷', note: 'Nói nghề không cần "ein": Ich bin Lehrer.' },
  { de: 'Ich arbeite als Koch.', vi: 'Tôi làm đầu bếp.', emoji: '👨‍🍳' },
  { de: 'Ich arbeite bei Siemens.', vi: 'Tôi làm việc ở (công ty) Siemens.', emoji: '🏢' },
  { de: 'Ich arbeite Vollzeit.', vi: 'Tôi làm toàn thời gian.' },
  { de: 'Ich arbeite Teilzeit.', vi: 'Tôi làm bán thời gian.' },
  { de: 'Ich mache eine Ausbildung.', vi: 'Tôi đang học nghề.', emoji: '🛠️', note: 'Ausbildung = chương trình học nghề kép rất phổ biến ở Đức.' },
  { de: 'Ich suche Arbeit.', vi: 'Tôi đang tìm việc.', emoji: '🔍' },
  { de: 'Ich habe heute frei.', vi: 'Hôm nay tôi được nghỉ.', emoji: '😌' },
];

const health: Phrase[] = [
  { de: 'Ich bin krank.', vi: 'Tôi bị ốm.', emoji: '🤒' },
  { de: 'Ich habe Kopfschmerzen.', vi: 'Tôi bị đau đầu.', emoji: '🤕' },
  { de: 'Ich habe Bauchschmerzen.', vi: 'Tôi bị đau bụng.' },
  { de: 'Ich habe Fieber.', vi: 'Tôi bị sốt.', emoji: '🌡️' },
  { de: 'Mein Hals tut weh.', vi: 'Tôi bị đau họng.' },
  { de: 'Ich brauche einen Termin.', vi: 'Tôi cần một cuộc hẹn.', emoji: '📅' },
  { de: 'Haben Sie Ihre Versichertenkarte?', vi: 'Ông/bà có thẻ bảo hiểm không?', emoji: '💳' },
  { de: 'Gute Besserung!', vi: 'Chúc mau khỏe!', emoji: '💐' },
  { de: 'Ich bin heute krankgeschrieben.', vi: 'Hôm nay tôi có giấy nghỉ ốm.', note: 'Ở Đức, nghỉ ốm quá 3 ngày cần giấy bác sĩ (có công ty yêu cầu ngay từ ngày đầu).' },
];

const weather: Phrase[] = [
  { de: 'Wie ist das Wetter?', vi: 'Thời tiết thế nào?' },
  { de: 'Die Sonne scheint.', vi: 'Trời nắng.', emoji: '☀️' },
  { de: 'Es regnet.', vi: 'Trời mưa.', emoji: '🌧️' },
  { de: 'Es schneit.', vi: 'Trời có tuyết.', emoji: '❄️' },
  { de: 'Es ist windig.', vi: 'Trời có gió.', emoji: '💨' },
  { de: 'Es ist heiß.', vi: 'Trời nóng.', emoji: '🥵' },
  { de: 'Es ist kalt.', vi: 'Trời lạnh.', emoji: '🥶' },
  { de: 'Ich ziehe eine Jacke an.', vi: 'Tôi mặc áo khoác vào.', emoji: '🧥' },
  { de: 'Die Hose ist zu groß.', vi: 'Cái quần rộng quá.', emoji: '👖' },
  { de: 'Kann ich das anprobieren?', vi: 'Tôi thử cái này được không?', emoji: '🪞' },
];

const forms: Phrase[] = [
  { de: 'der Vorname', vi: 'tên', note: 'Người Việt: tên gọi (Lan, Minh…) là Vorname.' },
  { de: 'der Nachname', vi: 'họ', note: 'Nguyễn, Trần, Lê… là Nachname.' },
  { de: 'das Geburtsdatum', vi: 'ngày sinh', emoji: '🎂' },
  { de: 'der Geburtsort', vi: 'nơi sinh' },
  { de: 'die Adresse', vi: 'địa chỉ', emoji: '🏠' },
  { de: 'die Staatsangehörigkeit', vi: 'quốc tịch', emoji: '🛂' },
  { de: 'der Familienstand', vi: 'tình trạng hôn nhân', emoji: '💍' },
  { de: 'die Unterschrift', vi: 'chữ ký', emoji: '✍️' },
  { de: 'Wie schreibt man das?', vi: 'Cái đó viết thế nào?' },
  { de: 'Können Sie das bitte buchstabieren?', vi: 'Ông/bà đánh vần giúp tôi được không?' },
];

const messages: Phrase[] = [
  { de: 'Liebe Anna, …', vi: 'Anna thân mến, … (viết cho nữ)', note: 'Viết cho nam: Lieber Tom, …' },
  { de: 'Sehr geehrte Damen und Herren, …', vi: 'Kính gửi quý ông bà, … (thư trang trọng)' },
  { de: 'Vielen Dank für deine Nachricht.', vi: 'Cảm ơn tin nhắn của bạn.' },
  { de: 'Leider kann ich morgen nicht kommen.', vi: 'Tiếc là ngày mai tôi không đến được.' },
  { de: 'Ich bin krank.', vi: 'Tôi bị ốm.' },
  { de: 'Hast du am Sonntag Zeit?', vi: 'Chủ nhật bạn có rảnh không?' },
  { de: 'Bitte ruf mich an.', vi: 'Hãy gọi cho tôi nhé.' },
  { de: 'Viele Grüße', vi: 'Thân ái (kết thư thân mật)' },
  { de: 'Mit freundlichen Grüßen', vi: 'Trân trọng (kết thư trang trọng)' },
];

const weekend: Phrase[] = [
  { de: 'Was hast du am Wochenende gemacht?', vi: 'Cuối tuần bạn đã làm gì?' },
  { de: 'Ich habe meine Freunde getroffen.', vi: 'Tôi đã gặp bạn bè.', emoji: '👯' },
  { de: 'Ich habe viel geschlafen.', vi: 'Tôi đã ngủ nhiều.', emoji: '😴' },
  { de: 'Ich habe Deutsch gelernt.', vi: 'Tôi đã học tiếng Đức.', emoji: '📖' },
  { de: 'Wir sind nach Hamburg gefahren.', vi: 'Chúng tôi đã đi Hamburg.', emoji: '🚆' },
  { de: 'Ich war im Kino.', vi: 'Tôi đã đi xem phim.', emoji: '🎬' },
  { de: 'Das Wetter war schön.', vi: 'Thời tiết đã rất đẹp.', emoji: '🌤️' },
  { de: 'Es hat Spaß gemacht.', vi: 'Rất vui.', emoji: '😄' },
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

  /* ---------- Level 1 – A1: everyday life ---------- */
  {
    id: 'a1-family', level: 'A1', order: 13, title: 'Gia đình tôi', titleDe: 'Meine Familie', icon: '👨‍👩‍👧', minutes: 12,
    description: 'Giới thiệu các thành viên trong gia đình, tình trạng hôn nhân và con cái.',
    steps: [
      { type: 'intro', title: 'Nói về gia đình', body: 'Gia đình là chủ đề đầu tiên trong mọi lớp A1 và trong phần thi nói (Sprechen). Bạn sẽ dùng mạo từ sở hữu mein/meine: mein Vater, meine Mutter.', why: 'Trong kỳ thi A1, bạn phải tự giới thiệu và trả lời câu hỏi về gia đình.' },
      { type: 'phrases', title: 'Thành viên gia đình', items: family },
      { type: 'tip', title: 'mein hay meine?', body: 'der/das → mein (mein Bruder, mein Kind). die và số nhiều → meine (meine Schwester, meine Eltern). Xem thêm bài ngữ pháp "Mạo từ sở hữu".' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-meine-schwester', 's-habe-geschwister'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-time', level: 'A1', order: 14, title: 'Giờ giấc', titleDe: 'Die Uhrzeit', icon: '🕐', minutes: 12,
    description: 'Hỏi và nói giờ – cả cách nói thông thường và cách nói chính thức.',
    steps: [
      { type: 'intro', title: 'Mấy giờ rồi?', body: 'Có hai cách nói giờ. Chính thức (lịch tàu, TV, công việc): 8:30 = acht Uhr dreißig. Thông thường (nói chuyện hằng ngày): 8:30 = halb neun.', why: 'Hẹn giờ, đọc lịch tàu, giờ mở cửa – giờ giấc có ở khắp nơi trong phần thi Nghe và Đọc.' },
      { type: 'phrases', title: 'Nói giờ', items: clock },
      { type: 'tip', title: 'Bẫy "halb"', body: '"halb neun" KHÔNG phải 9:30 mà là 8:30 – "còn nửa tiếng nữa là 9 giờ". Đây là lỗi người Việt hay mắc nhất!' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-kurs-beginnt', 's-zug'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-daily', level: 'A1', order: 15, title: 'Một ngày của tôi', titleDe: 'Mein Tag', icon: '☀️', minutes: 12,
    description: 'Kể về thói quen hằng ngày với động từ tách: aufstehen, einkaufen, fernsehen.',
    steps: [
      { type: 'intro', title: 'Từ sáng đến tối', body: 'Khi kể về một ngày của mình, bạn sẽ dùng rất nhiều động từ tách (aufstehen, einkaufen, fernsehen) và giờ giấc (um sieben Uhr).' },
      { type: 'phrases', title: 'Thói quen hằng ngày', items: daily },
      { type: 'tip', title: 'Nối câu cho tự nhiên', body: 'Dùng "zuerst" (đầu tiên), "dann" (sau đó), "danach" (sau đó), "am Abend" (buổi tối). Nhớ: sau các từ này động từ vẫn ở vị trí 2 – "Dann frühstücke ich."' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-stehe-auf', 's-fruehstuecke'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-food', level: 'A1', order: 16, title: 'Ăn uống', titleDe: 'Essen und Trinken', icon: '🍽️', minutes: 10,
    description: 'Bữa ăn, đói và khát, nói món mình thích và không ăn được.',
    steps: [
      { type: 'intro', title: 'Người Đức ăn gì?', body: 'Bữa sáng thường có bánh mì (Brötchen), bơ, mứt, phô mai. Bữa trưa là bữa chính ở nhiều gia đình. Bữa tối thường nhẹ: "Abendbrot" – bánh mì ăn kèm.' },
      { type: 'phrases', title: 'Câu về ăn uống', items: food },
      { type: 'tip', title: 'kein hay nicht?', body: 'Ich esse kein Fleisch (danh từ không mạo từ → kein). Ich esse nicht gern Fisch (phủ định "gern" → nicht).' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-esse-gern'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-cafe', level: 'A1', order: 17, title: 'Gọi món', titleDe: 'Im Café bestellen', icon: '☕', minutes: 10,
    description: 'Gọi đồ uống, món ăn và thanh toán ở quán cà phê, nhà hàng.',
    steps: [
      { type: 'intro', title: 'Ở quán', body: 'Ở Đức, bạn thường tự chọn bàn. Nhân viên sẽ đến hỏi "Was möchten Sie?". Khi thanh toán, bạn gọi nhân viên đến bàn – không ra quầy.' },
      { type: 'phrases', title: 'Gọi món và thanh toán', items: cafe },
      { type: 'tip', title: 'Lịch sự hơn với "hätte gern"', body: '"Ich will einen Kaffee" nghe hơi cộc. Hãy nói "Ich möchte…" hoặc "Ich hätte gern…".' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-moechte-tee', 's-moechte-zahlen'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-shopping', level: 'A1', order: 18, title: 'Mua sắm', titleDe: 'Einkaufen', icon: '🛒', minutes: 12,
    description: 'Hỏi giá, tìm hàng, số lượng và cách thanh toán.',
    steps: [
      { type: 'intro', title: 'Đi siêu thị', body: 'Siêu thị ở Đức đóng cửa vào Chủ nhật! Hãy mang túi riêng – túi ở quầy thu ngân phải trả tiền. Nhiều loại chai, lon có tiền cọc (Pfand) – trả vỏ ở máy trong siêu thị để lấy lại tiền.', why: 'Giá tiền và số lượng xuất hiện rất nhiều trong phần thi Nghe A1.' },
      { type: 'phrases', title: 'Câu khi mua sắm', items: shopping },
      { type: 'tip', title: 'Đọc giá tiền', body: '3,99 € = drei Euro neunundneunzig. 0,50 € = fünfzig Cent. Dấu phẩy thay cho dấu chấm thập phân.' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-was-kostet', 's-suche-jacke'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-home', level: 'A1', order: 19, title: 'Nhà ở', titleDe: 'Wohnen', icon: '🏠', minutes: 12,
    description: 'Các phòng trong nhà, mô tả căn hộ và tiền thuê nhà.',
    steps: [
      { type: 'intro', title: 'Căn hộ của tôi', body: 'Ở Đức, "3-Zimmer-Wohnung" nghĩa là 3 phòng KHÔNG tính bếp và phòng tắm. Tin rao thuê nhà là bài đọc rất hay gặp trong kỳ thi A1.' },
      { type: 'phrases', title: 'Phòng và mô tả', items: home },
      { type: 'tip', title: 'Tính từ mô tả nhà', body: 'groß ↔ klein, hell (sáng) ↔ dunkel (tối), ruhig (yên tĩnh) ↔ laut (ồn), billig (rẻ) ↔ teuer (đắt), neu ↔ alt.' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-wohnung-hat', 's-kueche-ist'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-city', level: 'A1', order: 20, title: 'Hỏi đường', titleDe: 'In der Stadt', icon: '🏙️', minutes: 10,
    description: 'Hỏi và chỉ đường: geradeaus, links, rechts, neben…',
    steps: [
      { type: 'intro', title: 'Lạc đường?', body: 'Bắt đầu bằng "Entschuldigung, …" rồi hỏi "Wo ist …?" hoặc "Wie komme ich zum/zur …?". Người chỉ đường thường dùng câu mệnh lệnh: "Gehen Sie …".' },
      { type: 'phrases', title: 'Hỏi và chỉ đường', items: city },
      { type: 'tip', title: 'zum hay zur?', body: 'Wie komme ich zum Bahnhof (der)? – zur Post (die)? – zum Rathaus (das)? der/das → zum, die → zur.' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-wo-ist-bank', 's-geradeaus'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-transport', level: 'A1', order: 21, title: 'Đi lại', titleDe: 'Unterwegs', icon: '🚆', minutes: 12,
    description: 'Mua vé, hỏi giờ tàu, đổi tàu và các phương tiện giao thông.',
    steps: [
      { type: 'intro', title: 'Tàu, xe buýt, xe đạp', body: 'Thông báo ở nhà ga (Durchsagen) là dạng bài quen thuộc trong phần thi Nghe A1: số đường ray (Gleis), giờ tàu, tàu trễ (Verspätung).' },
      { type: 'phrases', title: 'Ở nhà ga và trên đường', items: transport },
      { type: 'tip', title: 'mit + Dativ', body: 'Phương tiện luôn đi với "mit" + Dativ: mit dem Bus, mit dem Zug, mit der U-Bahn, mit dem Auto. Nhưng: zu Fuß (đi bộ).' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-mit-bus', 's-wann-faehrt'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-freetime', level: 'A1', order: 22, title: 'Thời gian rảnh', titleDe: 'Freizeit und Hobbys', icon: '⚽', minutes: 12,
    description: 'Sở thích, rủ bạn đi chơi, nhận lời và từ chối.',
    steps: [
      { type: 'intro', title: 'Sở thích của bạn', body: 'Dùng "gern" để nói điều mình thích làm. Để rủ ai đó: "Wollen wir …?" hoặc "Hast du Lust, … ?"' },
      { type: 'phrases', title: 'Sở thích và hẹn hò', items: freetime },
      { type: 'tip', title: 'Từ chối lịch sự', body: '"Leider habe ich keine Zeit" + lý do: "Ich muss arbeiten." Rồi đề nghị lúc khác: "Vielleicht am Sonntag?"' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-spiele-gern', 's-hast-du-zeit'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-work', level: 'A1', order: 23, title: 'Nghề nghiệp', titleDe: 'Beruf und Arbeit', icon: '💼', minutes: 12,
    description: 'Nói nghề nghiệp, nơi làm việc và thời gian làm việc.',
    steps: [
      { type: 'intro', title: 'Bạn làm nghề gì?', body: 'Nghề nghiệp có dạng nam và nữ: der Lehrer / die Lehrerin, der Koch / die Köchin. Dạng nữ thường thêm "-in".' },
      { type: 'phrases', title: 'Công việc', items: work },
      { type: 'tip', title: 'Không cần "ein"', body: 'Nói nghề nghiệp KHÔNG dùng mạo từ: Ich bin Ärztin. (không nói "Ich bin eine Ärztin").' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-arbeite-als', 's-er-ist'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-health', level: 'A1', order: 24, title: 'Sức khỏe', titleDe: 'Gesundheit', icon: '🩺', minutes: 12,
    description: 'Nói triệu chứng, đặt lịch khám bác sĩ và báo ốm.',
    steps: [
      { type: 'intro', title: 'Đi khám bác sĩ', body: 'Ở Đức, bạn thường phải gọi điện đặt lịch (Termin) trước. Mang theo thẻ bảo hiểm y tế (Versichertenkarte).', why: 'Biết nói "tôi bị đau ở đâu" là kỹ năng sống còn khi ở Đức.' },
      { type: 'phrases', title: 'Triệu chứng và bác sĩ', items: health },
      { type: 'tip', title: 'Kopfschmerzen', body: '… + Schmerzen = đau …: Kopfschmerzen (đau đầu), Bauchschmerzen (đau bụng), Rückenschmerzen (đau lưng), Zahnschmerzen (đau răng).' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-kopfschmerzen', 's-zum-arzt'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-weather', level: 'A1', order: 25, title: 'Thời tiết và quần áo', titleDe: 'Wetter und Kleidung', icon: '🌦️', minutes: 10,
    description: 'Nói về thời tiết, mặc gì và thử quần áo khi mua sắm.',
    steps: [
      { type: 'intro', title: 'Trời hôm nay thế nào?', body: 'Thời tiết ở Đức thay đổi nhanh – người Đức nói chuyện về thời tiết rất nhiều! Câu thời tiết luôn dùng "es": Es regnet. Es ist kalt.' },
      { type: 'phrases', title: 'Thời tiết và quần áo', items: weather },
      { type: 'tip', title: 'Bốn mùa', body: 'der Frühling (xuân), der Sommer (hè), der Herbst (thu), der Winter (đông). Đều là "der" và dùng "im": im Winter.' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-regnet', 's-ziehe-an'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-forms', level: 'A1', order: 26, title: 'Điền biểu mẫu', titleDe: 'Formulare ausfüllen', icon: '📝', minutes: 12,
    description: 'Họ, tên, ngày sinh, địa chỉ, quốc tịch – điền đơn và đánh vần.',
    steps: [
      { type: 'intro', title: 'Thủ tục giấy tờ', body: 'Đăng ký cư trú, mở tài khoản ngân hàng, đăng ký khóa học – đều cần điền đơn (Formular).', why: 'Phần thi Viết A1 (Schreiben Teil 1) là điền thông tin vào một biểu mẫu!' },
      { type: 'phrases', title: 'Từ trên biểu mẫu', items: forms },
      { type: 'tip', title: 'Viết ngày tháng kiểu Đức', body: 'Ngày.Tháng.Năm với dấu chấm: 05.03.1998. Địa chỉ: tên đường + số nhà, rồi mã bưu chính + thành phố: Goethestraße 12, 10115 Berlin.' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-mein-name', 's-adresse'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-messages', level: 'A1', order: 27, title: 'Viết tin nhắn ngắn', titleDe: 'Eine Nachricht schreiben', icon: '✉️', minutes: 12,
    description: 'Mở đầu, kết thúc thư; xin lỗi, mời, hủy hẹn.',
    steps: [
      { type: 'intro', title: 'Thư và tin nhắn', body: 'Phần thi Viết A1 (Schreiben Teil 2) yêu cầu viết khoảng 30 từ: mời, cảm ơn, xin nghỉ, hỏi thông tin. Bài viết phải có lời chào, 3 ý và lời kết.' },
      { type: 'phrases', title: 'Câu mẫu cho thư', items: messages },
      { type: 'tip', title: 'Thân mật hay trang trọng?', body: 'Bạn bè: Liebe/Lieber … – du – Viele Grüße. Công ty, cơ quan: Sehr geehrte Damen und Herren – Sie – Mit freundlichen Grüßen.' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-kann-nicht', 's-rufe-an'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
  {
    id: 'a1-weekend', level: 'A1', order: 28, title: 'Kể về cuối tuần', titleDe: 'Mein Wochenende', icon: '📅', minutes: 12,
    description: 'Kể chuyện đã xảy ra bằng Perfekt và war/hatte.',
    steps: [
      { type: 'intro', title: 'Cuối tuần vừa rồi', body: 'Thứ Hai, đồng nghiệp và bạn học sẽ hỏi: "Wie war dein Wochenende?". Hãy trả lời bằng Perfekt (habe … gemacht) và war/hatte.' },
      { type: 'phrases', title: 'Kể chuyện quá khứ', items: weekend },
      { type: 'tip', title: 'haben hay sein?', body: 'Di chuyển (fahren, gehen, fliegen, kommen) → sein. Hầu hết các động từ khác → haben. Xem bài ngữ pháp "Quá khứ: thì Perfekt".' },
      { type: 'builder', title: 'Ghép câu', sentenceIds: ['s-habe-gespielt', 's-sind-gefahren', 's-war-kino'] },
      { type: 'quiz', title: 'Kiểm tra nhanh', count: 6 },
    ],
  },
];
