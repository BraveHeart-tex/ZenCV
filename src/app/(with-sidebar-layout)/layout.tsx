import ApplicationLayoutWithSidebar from '@/components/appHome/ApplicationLayoutWithSidebar';
import { ReactNode } from 'react';

const SidebarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ApplicationLayoutWithSidebar>{children}</ApplicationLayoutWithSidebar>
  );
};

export default SidebarLayout;
