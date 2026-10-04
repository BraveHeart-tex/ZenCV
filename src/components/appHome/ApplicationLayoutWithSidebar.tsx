import { Files, FileUser, Settings2 } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';
import { ApplicationPageHeader } from '@/components/appHome/ApplicationPageHeader';
import { AppSidebar } from '@/components/appHome/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const applicationPages = [
  { path: '/documents', title: 'Documents', icon: Files },
  { path: '/resume-templates', title: 'Resume Templates', icon: FileUser },
  { path: '/settings', title: 'Settings', icon: Settings2 },
] as const;

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
  const { pathname } = useLocation();
  const currentPage =
    applicationPages.find((page) => page.path === pathname) ??
    applicationPages[0];

  return (
    <SidebarProvider defaultOpen={getDefaultSidebarOpen()}>
      <AppSidebar />
      <SidebarInset className='min-w-0'>
        <ApplicationPageHeader
          title={currentPage.title}
          icon={currentPage.icon}
        />
        <div className='mx-auto flex w-full max-w-[var(--content-max-width)] flex-1 flex-col px-[var(--page-gutter)] py-8 sm:py-10 lg:py-12'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
