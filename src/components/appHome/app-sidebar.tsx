import { Files, FileUser, Settings2 } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/useMobile';
import { APP_NAME } from '@/lib/appConfig';
import { Icons } from '../misc/icons';
import { AppColorModeToggle } from './AppColorModeToggle';
import { CreateDocumentDialog } from './documents/CreateDocumentDialog';

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
    icon: Settings2,
  },
];

export const AppSidebar = () => {
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible='icon' className='border-sidebar-border/70'>
      <SidebarHeader className='px-4 py-5 group-data-[collapsible=icon]:px-2'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              asChild
              tooltip={APP_NAME}
              className='gap-3 rounded-md px-2 hover:bg-transparent group-data-[collapsible=icon]:justify-center'
            >
              <Link to='/' aria-label={APP_NAME}>
                <div className='flex aspect-square size-8 items-center justify-center rounded-sm bg-sidebar-primary text-sidebar-primary-foreground'>
                  <Icons.logo />
                </div>
                <span className='font-semibold leading-none group-data-[collapsible=icon]:hidden'>
                  {APP_NAME}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='gap-5 px-3 py-4 group-data-[collapsible=icon]:px-2'>
        <SidebarGroup className='p-0'>
          <SidebarGroupContent>
            <SidebarMenu className='gap-1.5'>
              <SidebarMenuItem>
                <CreateDocumentDialog triggerVariant='sidebar' />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <nav aria-label='Application navigation'>
          <SidebarGroup className='p-0'>
            <SidebarGroupContent>
              <SidebarMenu className='gap-1.5'>
                {appLinks.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.url === pathname}
                      tooltip={item.title}
                      aria-label={item.title}
                      className='h-10 rounded-md px-3 font-medium text-sidebar-foreground/75 transition-colors duration-[var(--duration-quick)] ease-[var(--ease-out-quart)] data-[active=true]:font-semibold data-[active=true]:text-sidebar-foreground data-[active=true]:[&_svg]:text-editorial-accent group-data-[collapsible=icon]:justify-center motion-reduce:transition-none'
                    >
                      <SidebarLink
                        item={item}
                        isActive={item.url === pathname}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>
      </SidebarContent>
      <SidebarFooter className='border-t border-sidebar-border/70 px-3 py-3 group-data-[collapsible=icon]:px-2'>
        <SidebarMenu>
          <SidebarMenuItem>
            <AppColorModeToggle shouldShowSidebarButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export const SidebarLink = ({
  item,
  isActive,
  ...props
}: {
  item: (typeof appLinks)[number];
  isActive: boolean;
} & Omit<ComponentProps<typeof Link>, 'to' | 'onClick' | 'aria-current'>) => {
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  return (
    <Link
      {...props}
      to={item.url}
      aria-current={isActive ? 'page' : undefined}
      onClick={
        isMobile
          ? () => {
              setOpenMobile(false);
            }
          : undefined
      }
    >
      <item.icon />
      <span className='group-data-[collapsible=icon]:hidden'>{item.title}</span>
    </Link>
  );
};
