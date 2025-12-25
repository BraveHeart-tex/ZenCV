import type { ReactNode } from 'react';
import { ApplicationLayoutWithSidebar } from '@/components/appHome/ApplicationLayoutWithSidebar';

const SidebarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ApplicationLayoutWithSidebar>{children}</ApplicationLayoutWithSidebar>
  );
};

export default SidebarLayout;
