import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/appHome/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export const ApplicationLayoutWithSidebar = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
};
