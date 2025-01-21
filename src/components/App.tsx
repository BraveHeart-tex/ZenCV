'use client';

import { BrowserRouter, Route, Routes } from 'react-router';
import LandingPage from '@/components/LandingPage';
import DocumentsPage from '@/components/DocumentsPage';
import ApplicationLayoutWithSidebar from '@/components/ApplicationLayoutWithSidebar';
import SettingsPage from '@/components/SettingsPage';
import ResumeTemplatesPage from '@/components/ResumeTemplatesPage';
import DocumentBuilderPage from '@/components/DocumentBuilderPage';

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
