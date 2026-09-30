import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ContentProvider } from '@/context/ContentContext';
import { ProgressProvider } from '@/context/ProgressContext';
import { ToastProvider } from '@/context/ToastContext';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Spinner } from '@/components/ui/States';

const HomePage = lazy(() => import('@/pages/HomePage'));
const CurriculumPage = lazy(() => import('@/pages/CurriculumPage'));
const LessonPage = lazy(() => import('@/pages/LessonPage'));
const AlphabetPage = lazy(() => import('@/pages/AlphabetPage'));
const VocabularyPage = lazy(() => import('@/pages/VocabularyPage'));
const TopicPage = lazy(() => import('@/pages/TopicPage'));
const WordPage = lazy(() => import('@/pages/WordPage'));
const FlashcardsPage = lazy(() => import('@/pages/FlashcardsPage'));
const ArticlesPage = lazy(() => import('@/pages/ArticlesPage'));
const GrammarPage = lazy(() => import('@/pages/GrammarPage'));
const GrammarLessonPage = lazy(() => import('@/pages/GrammarLessonPage'));
const ListeningPage = lazy(() => import('@/pages/ListeningPage'));
const PronunciationPage = lazy(() => import('@/pages/PronunciationPage'));
const ConversationsPage = lazy(() => import('@/pages/ConversationsPage'));
const ConversationPage = lazy(() => import('@/pages/ConversationPage'));
const ReadingPage = lazy(() => import('@/pages/ReadingPage'));
const ReadingTextPage = lazy(() => import('@/pages/ReadingTextPage'));
const ReviewPage = lazy(() => import('@/pages/ReviewPage'));
const QuizPage = lazy(() => import('@/pages/QuizPage'));
const MistakesPage = lazy(() => import('@/pages/MistakesPage'));
const ProgressPage = lazy(() => import('@/pages/ProgressPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const PageLoader = () => (
  <div className="page-loader">
    <Spinner label="Đang tải trang…" />
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <ContentProvider>
              <ProgressProvider>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route element={<Layout />}>
                      <Route index element={<HomePage />} />
                      <Route path="learn" element={<CurriculumPage />} />
                      <Route path="learn/:lessonId" element={<LessonPage />} />
                      <Route path="alphabet" element={<AlphabetPage />} />
                      <Route path="vocabulary" element={<VocabularyPage />} />
                      <Route path="vocabulary/topic/:topicId" element={<TopicPage />} />
                      <Route path="vocabulary/word/:wordId" element={<WordPage />} />
                      <Route path="flashcards" element={<FlashcardsPage />} />
                      <Route path="articles" element={<ArticlesPage />} />
                      <Route path="grammar" element={<GrammarPage />} />
                      <Route path="grammar/:lessonId" element={<GrammarLessonPage />} />
                      <Route path="listening" element={<ListeningPage />} />
                      <Route path="pronunciation" element={<PronunciationPage />} />
                      <Route path="conversations" element={<ConversationsPage />} />
                      <Route path="conversations/:convoId" element={<ConversationPage />} />
                      <Route path="reading" element={<ReadingPage />} />
                      <Route path="reading/:readingId" element={<ReadingTextPage />} />
                      <Route path="review" element={<ReviewPage />} />
                      <Route path="quiz" element={<QuizPage />} />
                      <Route path="mistakes" element={<MistakesPage />} />
                      <Route path="progress" element={<ProgressPage />} />
                      <Route path="search" element={<SearchPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="reset-password" element={<ResetPasswordPage />} />
                  </Routes>
                </Suspense>
              </ProgressProvider>
            </ContentProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
