import { LucideComputer, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { Button } from '../ui/button';

const themeOptions = [
  {
    label: 'Light',
    value: 'light',
    icon: Sun,
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: Moon,
  },
  {
    label: 'System',
    value: 'system',
    icon: LucideComputer,
  },
];

interface SidebarColorModeToggleProps {
  shouldShowSidebarButton?: boolean;
  segmented?: boolean;
}

export const AppColorModeToggle = ({
  shouldShowSidebarButton,
  segmented = false,
}: SidebarColorModeToggleProps) => {
  const { theme, setTheme } = useTheme();

  const renderTriggerContent = () => {
    const selectedOption = themeOptions.find(
      (themeOption) => themeOption.value === theme
    );

    if (!selectedOption) {
      return;
    }

    const content = (
      <div className='flex items-center gap-2'>
        <selectedOption.icon aria-hidden='true' className='size-4' />
        <span className='group-data-[collapsible=icon]:hidden'>Appearance</span>
        <span className='sr-only'>
          Current theme: {selectedOption.label}. Select color theme.
        </span>
      </div>
    );

    if (shouldShowSidebarButton) {
      return (
        <SidebarMenuButton
          variant='outline'
          tooltip='Appearance'
          className='h-10 w-full justify-start rounded-md border-transparent bg-transparent px-3 text-sidebar-foreground/75 shadow-none transition-colors duration-[var(--duration-quick)] ease-[var(--ease-out-quart)] hover:bg-sidebar-accent hover:text-sidebar-foreground group-data-[collapsible=icon]:justify-center motion-reduce:transition-none'
        >
          {content}
        </SidebarMenuButton>
      );
    }

    return (
      <Button variant={'outline'} className='justify-start w-full'>
        {content}
      </Button>
    );
  };

  if (segmented) {
    return (
      <fieldset
        aria-label='Color theme'
        className='inline-flex w-full max-w-96 rounded-md border border-border bg-muted/50 p-1 sm:w-auto'
      >
        {themeOptions.map((option) => (
          <Button
            key={option.value}
            type='button'
            variant={theme === option.value ? 'default' : 'ghost'}
            aria-pressed={theme === option.value}
            onClick={() => setTheme(option.value)}
            className='min-h-10 min-w-0 flex-1 gap-1.5 rounded-sm px-2 text-xs sm:min-w-20 sm:px-3 sm:text-sm'
          >
            <option.icon aria-hidden='true' className='size-4' />
            {option.label}
          </Button>
        ))}
      </fieldset>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderTriggerContent()}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {themeOptions.map((option) => (
          <DropdownMenuItem
            onClick={() => setTheme(option.value)}
            key={option.value}
            className='flex items-center gap-2'
          >
            {<option.icon className='h-[1.2rem] w-[1.2rem]' />}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
