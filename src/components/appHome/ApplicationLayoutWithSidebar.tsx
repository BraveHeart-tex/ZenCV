import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/appHome/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const getDefaultSidebarOpen = () => {
  try {
    return (
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('sidebar:state='))
        ?.split('=')[1] === 'true'
    );
  } catch {
    return true;
  }
};

export const ApplicationLayoutWithSidebar = () => {
  return (
    <SidebarProvider defaultOpen={getDefaultSidebarOpen()}>
      <AppSidebar />
      <Outlet />
    </SidebarProvider>
  );
};
