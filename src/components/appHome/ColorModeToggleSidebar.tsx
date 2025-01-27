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

const ColorModeToggleSidebar = () => {
  const { theme, setTheme } = useTheme();

  const renderTriggerContent = () => {
    const selectedOption = themeOptions.find(
      (themeOption) => themeOption.value === theme,
    );

    if (!selectedOption) return;

    return (
      <div className="flex items-center gap-2">
        <selectedOption.icon className="h-[1.2rem] w-[1.2rem]" />
        {selectedOption.label}
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton variant="outline" className="justify-start w-full">
          {renderTriggerContent()}
          <span className="sr-only">Select color theme</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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

export default ColorModeToggleSidebar;
