import * as Sentry from '@sentry/react';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ApplicationLayoutWithSidebar } from '@/components/appHome/ApplicationLayoutWithSidebar';
import { DocumentBuilderResetter } from '@/components/documentBuilder/DocumentBuilderResetter';
import { RouteErrorFallback } from '@/components/ErrorBoundary';
import { LandingPage } from '@/components/landingPage/LandingPage';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';

const DocumentsPage = lazy(() =>
  import('@/components/appHome/documents/DocumentsPage').then((m) => ({
    default: m.DocumentsPage,
  }))
);
const BuilderPage = lazy(() =>
  import('./builder-page').then((m) => ({ default: m.BuilderPage }))
);
const ResumeTemplatesPage = lazy(() =>
  import('./resume-templates-page').then((m) => ({
    default: m.ResumeTemplatesPage,
  }))
);
const SettingsPage = lazy(() =>
  import('./settings-page').then((m) => ({ default: m.SettingsPage }))
);

export function App() {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <Suspense fallback={null}>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route
            element={
              <Sentry.ErrorBoundary fallback={RouteErrorFallback}>
                <ApplicationLayoutWithSidebar />
              </Sentry.ErrorBoundary>
            }
          >
            <Route path='/documents' element={<DocumentsPage />} />
            <Route path='/resume-templates' element={<ResumeTemplatesPage />} />
            <Route path='/settings' element={<SettingsPage />} />
          </Route>
          <Route
            path='/builder/:id'
            element={
              <Sentry.ErrorBoundary fallback={RouteErrorFallback}>
                <DocumentBuilderResetter />
                <BuilderPage />
              </Sentry.ErrorBoundary>
            }
          />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Suspense>
      <Toaster />
      <ConfirmDialog />
    </ThemeProvider>
  );
}
