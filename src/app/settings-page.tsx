import { Sliders, SunMoon, Trash2, Upload } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DataImportExport } from '@/components/appHome/settings/DataImportExport';
import { EditorPreferences } from '@/components/appHome/settings/EditorPreferences';
import { GeneralSettings } from '@/components/appHome/settings/GeneralSettings';
import { SettingsDangerZone } from '@/components/appHome/settings/SettingsDangerZone';

const settingsNavigationItems = [
  {
    href: '#appearance',
    label: 'Appearance',
    compactLabel: 'Appearance',
    icon: SunMoon,
  },
  {
    href: '#editing',
    label: 'Editing',
    compactLabel: 'Editing',
    icon: Sliders,
  },
  {
    href: '#data',
    label: 'Backups & transfer',
    compactLabel: 'Backups',
    icon: Upload,
  },
  {
    href: '#reset',
    label: 'Reset data',
    compactLabel: 'Reset',
    icon: Trash2,
  },
] as const;

export function SettingsPage() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash === '#data') {
      const section = document.getElementById('data');
      section?.scrollIntoView({ block: 'start' });
      section?.focus({ preventScroll: true });
    }
  }, [hash]);
  return (
    <div className='mx-auto w-full max-w-5xl'>
      <p className='mb-7 max-w-[38rem] border-b border-border/70 pb-6 text-sm leading-6 text-muted-foreground'>
        Preferences apply to all resumes in this browser. Changes save
        automatically.
      </p>
      <div className='grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[11rem_minmax(0,42rem)] xl:gap-14'>
        <SettingsNavigation />
        <div className='min-w-0 w-full max-w-[42rem] [&>section+section]:border-t [&>section+section]:border-border/70 [&>section]:scroll-mt-24 [&>section]:py-8 [&>section:first-child]:pt-0 [&>section:last-child]:border-t-destructive/30'>
          <GeneralSettings sectionId='appearance' />
          <EditorPreferences sectionId='editing' />
          <DataImportExport />
          <SettingsDangerZone />
        </div>
      </div>
    </div>
  );
}

const SettingsNavigation = () => (
  <nav
    aria-label='Settings sections'
    className='flex min-w-0 gap-1 overflow-x-auto border-y border-border/70 xl:sticky xl:top-24 xl:flex-col xl:gap-0 xl:self-start xl:overflow-visible xl:border-y-0 xl:border-t'
  >
    {settingsNavigationItems.map(
      ({ href, label, compactLabel, icon: Icon }) => (
        <a
          key={href}
          href={href}
          className='inline-flex min-h-11 min-w-max items-center gap-2 border-b-2 border-transparent px-2 text-sm font-medium text-muted-foreground transition-colors duration-[var(--duration-quick)] hover:bg-muted/50 hover:text-foreground focus-visible:text-foreground xl:min-h-12 xl:w-full xl:gap-2.5 xl:border-b xl:px-0 xl:py-3 xl:hover:bg-transparent motion-reduce:transition-none'
        >
          <Icon
            aria-hidden='true'
            className='hidden size-4 shrink-0 sm:inline'
            strokeWidth={1.75}
          />
          <span className='xl:hidden'>{compactLabel}</span>
          <span className='hidden xl:inline'>{label}</span>
        </a>
      )
    )}
  </nav>
);
