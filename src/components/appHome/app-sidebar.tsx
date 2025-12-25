import { Cog, Files, FileUser } from 'lucide-react';
import Link from 'next/link';
import ClientOnly from '@/components/misc/ClientOnly';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { APP_NAME } from '@/lib/appConfig';
import { Icons } from '../misc/icons';
import AppColorModeToggle from './AppColorModeToggle';
import CreateDocumentDialog from './documents/CreateDocumentDialog';

const appLinks = [
  {
    title: 'Documents',
    url: '/documents',
    icon: Files,
  },
  {
    title: 'Resume Templates',
    url: '/resume-templates',
    icon: FileUser,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Cog,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip={APP_NAME}>
              <Link href="/" prefetch={true}>
                <div className="aspect-square size-8 bg-primary text-primary-foreground flex items-center justify-center rounded-lg">
                  <Icons.logo />
                </div>
                <span className="font-semibold leading-none">{APP_NAME}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Shortcuts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <CreateDocumentDialog triggerVariant="sidebar" />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url} prefetch={true}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ClientOnly>
              <AppColorModeToggle shouldShowSidebarButton />
            </ClientOnly>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
