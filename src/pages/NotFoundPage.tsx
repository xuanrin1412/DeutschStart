import { EmptyState } from '@/components/ui/States';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Không tìm thấy trang');
  return (
    <EmptyState icon="🧭" title="Entschuldigung! Không tìm thấy trang này." action={{ label: 'Về trang chủ', to: '/' }}>
      Trang bạn tìm có thể đã được chuyển đi.
    </EmptyState>
  );
}
