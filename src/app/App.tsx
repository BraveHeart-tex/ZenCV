import { Navigate, Route, Routes } from 'react-router-dom';
import { ApplicationLayoutWithSidebar } from '@/components/appHome/ApplicationLayoutWithSidebar';
import { DocumentsPage } from '@/components/appHome/documents/DocumentsPage';
import { DocumentBuilderResetter } from '@/components/documentBuilder/DocumentBuilderResetter';
import { LandingPage } from '@/components/landingPage/LandingPage';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import BuilderPage from './builder-page';
import ResumeTemplatesPage from './resume-templates-page';
import SettingsPage from './settings-page';

export function App() {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route element={<ApplicationLayoutWithSidebar />}>
          <Route path='/documents' element={<DocumentsPage />} />
          <Route path='/resume-templates' element={<ResumeTemplatesPage />} />
          <Route path='/settings' element={<SettingsPage />} />
        </Route>
        <Route
          path='/builder/:id'
          element={
            <>
              <DocumentBuilderResetter />
              <BuilderPage />
            </>
          }
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
      <ConfirmDialog />
    </ThemeProvider>
  );
}
