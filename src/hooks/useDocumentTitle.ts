import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · DeutschStart` : 'DeutschStart – Learn German from zero';
  }, [title]);
}
