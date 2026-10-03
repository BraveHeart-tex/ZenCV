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
        <selectedOption.icon className='h-[1.2rem] w-[1.2rem]' />
        {selectedOption.label}
        <span className='sr-only'>Select color theme</span>
      </div>
    );

    if (shouldShowSidebarButton) {
      return (
        <SidebarMenuButton variant='outline' className='justify-start w-full'>
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
        className='inline-flex rounded-lg border border-border bg-muted/40 p-1'
      >
        {themeOptions.map((option) => (
          <Button
            key={option.value}
            type='button'
            variant='ghost'
            aria-pressed={theme === option.value}
            onClick={() => setTheme(option.value)}
            className={`min-h-11 gap-1.5 px-3 text-sm motion-safe:transition-colors ${theme === option.value ? 'bg-foreground text-background hover:bg-foreground/90 hover:text-background' : ''}`}
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
