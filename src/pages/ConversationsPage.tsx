import { Link } from 'react-router-dom';
import { useContent } from '@/context/ContentContext';
import { PageHeader } from '@/components/common/PageHeader';

export default function ConversationsPage() {
  const { conversations } = useContent();
  return (
    <div className="stack-lg">
      <PageHeader
        icon="💬"
        title="Hội thoại"
        subtitle="Những tình huống thực tế bạn sẽ gặp ở Đức – nghe từng câu, xem bản dịch và luyện nói theo vai."
        why="Học câu trong ngữ cảnh giúp bạn biết khi nào nói gì, không chỉ nói gì."
      />
      <div className="grid grid-3">
        {conversations.map((c) => (
          <Link key={c.id} to={`/conversations/${c.id}`} className="card card-hover convo-card">
            <span className="topic-icon" aria-hidden="true">
              {c.icon}
            </span>
            <div>
              <p className="eyebrow">
                {c.level} · {c.lines.length} câu
              </p>
              <h2 className="h4">{c.title}</h2>
              <p className="muted small" lang="de">
                {c.titleDe}
              </p>
              <p className="small">{c.context}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
