'use client';

import { BrowserRouter, Route, Routes } from 'react-router';
import LandingPage from '@/components/LandingPage';
import DocumentsPage from '@/components/DocumentsPage';
import ApplicationLayoutWithSidebar from '@/components/ApplicationLayoutWithSidebar';
import SettingsPage from '@/components/SettingsPage';
import ResumeTemplatesPage from '@/components/ResumeTemplatesPage';
import DocumentBuilderPage from '@/components/DocumentBuilderPage';
import { useEffect, useState } from 'react';

const App = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
