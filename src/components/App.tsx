'use client';

import { BrowserRouter, Route, Routes } from 'react-router';
import LandingPage from '@/components/landingPage/LandingPage';
import DocumentsPage from '@/components/appHome/documents/DocumentsPage';
import ApplicationLayoutWithSidebar from '@/components/appHome/ApplicationLayoutWithSidebar';
import SettingsPage from '@/components/appHome/settings/SettingsPage';
import ResumeTemplatesPage from '@/components/appHome/resumeTemplates/ResumeTemplatesPage';
import DocumentBuilderPage from '@/components/documentBuilder/DocumentBuilderPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<LandingPage />} />
        <Route element={<ApplicationLayoutWithSidebar />}>
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/resume-templates" element={<ResumeTemplatesPage />} />
        </Route>
        <Route path={'/builder/:id'} element={<DocumentBuilderPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
