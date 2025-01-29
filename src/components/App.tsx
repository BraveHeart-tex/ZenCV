'use client';

import dynamic from 'next/dynamic';
import { BrowserRouter, Route, Routes } from 'react-router';

const LandingPage = dynamic(
  () => import('@/components/landingPage/LandingPage'),
);
const DocumentsPage = dynamic(
  () => import('@/components/appHome/documents/DocumentsPage'),
);
const ApplicationLayoutWithSidebar = dynamic(
  () => import('@/components/appHome/ApplicationLayoutWithSidebar'),
);
const SettingsPage = dynamic(
  () => import('@/components/appHome/settings/SettingsPage'),
);
const ResumeTemplatesPage = dynamic(
  () => import('@/components/appHome/resumeTemplates/ResumeTemplatesPage'),
);
const DocumentBuilderPage = dynamic(
  () => import('@/components/documentBuilder/DocumentBuilderPage'),
);

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
