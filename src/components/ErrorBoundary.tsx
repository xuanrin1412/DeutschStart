import { Component, type ErrorInfo, type ReactNode } from 'react';
import { FullPageError } from './ui/States';

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('DeutschStart crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.error)
      return (
        <FullPageError
          message="Trang gặp sự cố ngoài ý muốn. Tiến độ của bạn vẫn được lưu an toàn."
          onRetry={() => {
            this.setState({ error: null });
            window.location.assign('/');
          }}
        />
      );
    return this.props.children;
  }
}
