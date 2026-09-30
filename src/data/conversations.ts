import type { Conversation, DialogueLine } from '@/types/models';

const L = (speaker: 'A' | 'B', de: string, vi: string): DialogueLine => ({ speaker, de, vi });

export const conversations: Conversation[] = [
  {
    id: 'cafe', title: 'Ở quán cà phê', titleDe: 'Im Café', icon: '☕', level: 'A1',
    context: 'Bạn gọi đồ uống ở một quán cà phê.', roles: { A: 'Bạn (khách)', B: 'Nhân viên' },
    lines: [
      L('A', 'Guten Morgen.', 'Chào buổi sáng.'),
      L('B', 'Guten Morgen. Was möchten Sie?', 'Chào buổi sáng. Anh/chị muốn dùng gì?'),
      L('A', 'Ich möchte einen Kaffee, bitte.', 'Cho tôi một ly cà phê.'),
      L('B', 'Mit Milch und Zucker?', 'Có sữa và đường không?'),
      L('A', 'Nur mit Milch, bitte.', 'Chỉ có sữa thôi.'),
      L('B', 'Das macht drei Euro fünfzig.', 'Tổng cộng ba euro năm mươi.'),
      L('A', 'Hier, bitte. Danke schön!', 'Đây ạ. Cảm ơn nhiều!'),
    ],
    keyPhrases: [{ de: 'Ich möchte …', vi: 'Tôi muốn …' }, { de: 'Das macht …', vi: 'Tổng cộng là …' }],
  },
  {
    id: 'introduce', title: 'Giới thiệu bản thân', titleDe: 'Sich vorstellen', icon: '🙋', level: 'A1',
    context: 'Buổi học tiếng Đức đầu tiên, bạn làm quen với một bạn cùng lớp.', roles: { A: 'Bạn', B: 'Anna' },
    lines: [
      L('B', 'Hallo! Ich bin Anna. Wie heißt du?', 'Chào! Mình là Anna. Bạn tên là gì?'),
      L('A', 'Hallo Anna! Ich heiße Minh.', 'Chào Anna! Mình tên là Minh.'),
      L('B', 'Woher kommst du, Minh?', 'Bạn đến từ đâu, Minh?'),
      L('A', 'Ich komme aus Vietnam, aus Hanoi.', 'Mình đến từ Việt Nam, từ Hà Nội.'),
      L('B', 'Toll! Und was machst du hier?', 'Tuyệt! Thế bạn làm gì ở đây?'),
      L('A', 'Ich lerne Deutsch. Ich möchte in Deutschland arbeiten.', 'Mình học tiếng Đức. Mình muốn làm việc ở Đức.'),
      L('B', 'Freut mich!', 'Rất vui được làm quen!'),
    ],
  },
  {
    id: 'supermarket', title: 'Ở siêu thị', titleDe: 'Im Supermarkt', icon: '🛒', level: 'A1',
    context: 'Bạn hỏi nhân viên siêu thị nơi để sữa.', roles: { A: 'Bạn', B: 'Nhân viên' },
    lines: [
      L('A', 'Entschuldigung, wo ist die Milch?', 'Xin lỗi, sữa ở đâu ạ?'),
      L('B', 'Die Milch ist dort hinten, links.', 'Sữa ở phía sau kia, bên trái.'),
      L('A', 'Danke! Und haben Sie auch Reis?', 'Cảm ơn! Và ở đây có gạo không ạ?'),
      L('B', 'Ja, im Gang drei.', 'Có, ở lối số ba.'),
      L('A', 'Vielen Dank!', 'Cảm ơn nhiều!'),
    ],
  },
  {
    id: 'station', title: 'Ở nhà ga', titleDe: 'Am Bahnhof', icon: '🚉', level: 'A1',
    context: 'Bạn mua vé tàu đi Hamburg.', roles: { A: 'Bạn', B: 'Nhân viên' },
    lines: [
      L('A', 'Guten Tag. Eine Fahrkarte nach Hamburg, bitte.', 'Xin chào. Cho tôi một vé đi Hamburg.'),
      L('B', 'Hin und zurück?', 'Khứ hồi ạ?'),
      L('A', 'Nein, nur hin.', 'Không, chỉ một chiều thôi.'),
      L('B', 'Das kostet neunundzwanzig Euro.', 'Vé giá hai mươi chín euro.'),
      L('A', 'Von welchem Gleis fährt der Zug?', 'Tàu chạy từ đường ray số mấy?'),
      L('B', 'Von Gleis sieben.', 'Từ đường ray số bảy.'),
    ],
  },
  {
    id: 'restaurant', title: 'Ở nhà hàng', titleDe: 'Im Restaurant', icon: '🍽️', level: 'A1',
    context: 'Bạn gọi món và thanh toán ở nhà hàng.', roles: { A: 'Bạn', B: 'Phục vụ' },
    lines: [
      L('B', 'Guten Abend. Haben Sie reserviert?', 'Chào buổi tối. Anh/chị đã đặt bàn chưa?'),
      L('A', 'Nein. Haben Sie einen Tisch für zwei Personen?', 'Chưa. Có bàn cho hai người không?'),
      L('B', 'Ja, bitte hier. Was möchten Sie trinken?', 'Có, mời ngồi đây. Anh/chị muốn uống gì?'),
      L('A', 'Zwei Wasser, bitte. Und ich nehme die Suppe.', 'Hai chai nước. Và tôi lấy món súp.'),
      L('A', 'Die Rechnung, bitte.', 'Cho tôi hóa đơn.'),
      L('B', 'Zusammen oder getrennt?', 'Trả chung hay riêng ạ?'),
      L('A', 'Zusammen, bitte.', 'Trả chung.'),
    ],
  },
  {
    id: 'directions', title: 'Hỏi đường', titleDe: 'Nach dem Weg fragen', icon: '🧭', level: 'A1',
    context: 'Bạn bị lạc và hỏi đường đến nhà ga.', roles: { A: 'Bạn', B: 'Người đi đường' },
    lines: [
      L('A', 'Entschuldigung, wie komme ich zum Bahnhof?', 'Xin lỗi, tôi đi đến nhà ga thế nào?'),
      L('B', 'Gehen Sie geradeaus und dann rechts.', 'Anh/chị đi thẳng rồi rẽ phải.'),
      L('A', 'Ist es weit?', 'Có xa không?'),
      L('B', 'Nein, nur fünf Minuten zu Fuß.', 'Không, chỉ năm phút đi bộ.'),
      L('A', 'Vielen Dank!', 'Cảm ơn nhiều!'),
      L('B', 'Gern geschehen.', 'Không có gì.'),
    ],
  },
  {
    id: 'work', title: 'Ở nơi làm việc', titleDe: 'Bei der Arbeit', icon: '💼', level: 'A2',
    context: 'Ngày đầu tiên đi làm, bạn gặp quản lý.', roles: { A: 'Bạn', B: 'Quản lý' },
    lines: [
      L('B', 'Herzlich willkommen! Sind Sie Frau Nguyen?', 'Chào mừng! Chị là chị Nguyễn phải không?'),
      L('A', 'Ja, genau. Heute ist mein erster Tag.', 'Vâng, đúng rồi. Hôm nay là ngày đầu tiên của tôi.'),
      L('B', 'Ihr Arbeitsplatz ist hier. Die Arbeit beginnt um acht Uhr.', 'Chỗ làm của chị ở đây. Công việc bắt đầu lúc tám giờ.'),
      L('A', 'Und wann ist die Mittagspause?', 'Vậy khi nào nghỉ trưa ạ?'),
      L('B', 'Von zwölf bis halb eins.', 'Từ mười hai giờ đến mười hai rưỡi.'),
    ],
  },
  {
    id: 'apartment', title: 'Thuê căn hộ', titleDe: 'Eine Wohnung mieten', icon: '🏢', level: 'A2',
    context: 'Bạn gọi điện hỏi về một căn hộ cho thuê.', roles: { A: 'Bạn', B: 'Chủ nhà' },
    lines: [
      L('A', 'Guten Tag, ich interessiere mich für die Wohnung.', 'Xin chào, tôi quan tâm đến căn hộ.'),
      L('B', 'Gern. Die Wohnung hat zwei Zimmer, Küche und Bad.', 'Vâng. Căn hộ có hai phòng, bếp và phòng tắm.'),
      L('A', 'Wie hoch ist die Miete?', 'Tiền thuê là bao nhiêu?'),
      L('B', 'Siebenhundert Euro warm.', 'Bảy trăm euro đã bao gồm chi phí sưởi.'),
      L('A', 'Kann ich die Wohnung besichtigen?', 'Tôi có thể đến xem căn hộ không?'),
      L('B', 'Ja, am Samstag um zehn Uhr.', 'Được, vào thứ Bảy lúc mười giờ.'),
    ],
  },
  {
    id: 'doctor', title: 'Đi khám bác sĩ', titleDe: 'Beim Arzt', icon: '🩺', level: 'A2',
    context: 'Bạn bị đau đầu và đi khám.', roles: { A: 'Bạn', B: 'Bác sĩ' },
    lines: [
      L('B', 'Guten Tag. Was fehlt Ihnen?', 'Xin chào. Anh/chị bị làm sao?'),
      L('A', 'Ich habe Kopfschmerzen und Fieber.', 'Tôi bị đau đầu và sốt.'),
      L('B', 'Seit wann?', 'Từ khi nào?'),
      L('A', 'Seit zwei Tagen.', 'Từ hai ngày nay.'),
      L('B', 'Trinken Sie viel Wasser und bleiben Sie zu Hause.', 'Hãy uống nhiều nước và ở nhà nghỉ ngơi.'),
      L('A', 'Brauche ich eine Krankschreibung?', 'Tôi có cần giấy nghỉ ốm không?'),
      L('B', 'Ja, für drei Tage.', 'Có, trong ba ngày.'),
    ],
  },
  {
    id: 'colleague', title: 'Nói chuyện với đồng nghiệp', titleDe: 'Mit einem Kollegen sprechen', icon: '🤝', level: 'A2',
    context: 'Giờ nghỉ trưa, bạn nói chuyện với một đồng nghiệp người Đức.', roles: { A: 'Bạn', B: 'Jonas' },
    lines: [
      L('B', 'Hallo! Wie war dein Wochenende?', 'Chào! Cuối tuần của bạn thế nào?'),
      L('A', 'Sehr schön, danke! Ich war in Potsdam.', 'Rất vui, cảm ơn! Mình đã đi Potsdam.'),
      L('B', 'Oh, toll! Gehen wir zusammen Mittag essen?', 'Ồ, tuyệt! Mình đi ăn trưa cùng nhau nhé?'),
      L('A', 'Gerne! Wohin gehen wir?', 'Vui lòng! Mình đi đâu?'),
      L('B', 'In die Kantine. Heute gibt es Pizza.', 'Đến căng tin. Hôm nay có pizza.'),
    ],
  },
];
