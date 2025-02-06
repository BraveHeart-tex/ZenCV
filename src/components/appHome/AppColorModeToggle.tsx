'use client';
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
}

const AppColorModeToggle = ({
  shouldShowSidebarButton,
}: SidebarColorModeToggleProps) => {
  const { theme, setTheme } = useTheme();

  const renderTriggerContent = () => {
    const selectedOption = themeOptions.find(
      (themeOption) => themeOption.value === theme,
    );

    if (!selectedOption) return;

    const content = (
      <div className="flex items-center gap-2">
        <selectedOption.icon className="h-[1.2rem] w-[1.2rem]" />
        {selectedOption.label}
        <span className="sr-only">Select color theme</span>
      </div>
    );

    if (shouldShowSidebarButton) {
      return (
        <SidebarMenuButton variant="outline" className="justify-start w-full">
          {content}
        </SidebarMenuButton>
      );
    }

    return (
      <Button variant={'outline'} className="justify-start w-full">
        {content}
      </Button>
    );
  };

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
            className="flex items-center gap-2"
          >
            {<option.icon className="h-[1.2rem] w-[1.2rem]" />}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppColorModeToggle;
