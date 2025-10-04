'use client';

import { BrowserRouter, Route, Routes } from 'react-router';
import ApplicationLayoutWithSidebar from './appHome/ApplicationLayoutWithSidebar';
import DocumentsPage from './appHome/documents/DocumentsPage';
import ResumeTemplatesPage from './appHome/resumeTemplates/ResumeTemplatesPage';
import SettingsPage from './appHome/settings/SettingsPage';
import DocumentBuilderPage from './documentBuilder/DocumentBuilderPage';
import LandingPage from './landingPage/LandingPage';

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
