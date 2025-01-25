'use client';
import AppSidebar from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getCookieValue } from '@/lib/helpers/documentBuilderHelpers';
import { Outlet } from 'react-router';

const ApplicationLayoutWithSidebar = () => {
  const defaultOpen = getCookieValue('sidebar:state') === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <Outlet />
    </SidebarProvider>
  );
};

export default ApplicationLayoutWithSidebar;
