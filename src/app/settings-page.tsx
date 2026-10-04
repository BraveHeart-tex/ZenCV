import { Sliders, SunMoon, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DataImportExport } from '@/components/appHome/settings/DataImportExport';
import { EditorPreferences } from '@/components/appHome/settings/EditorPreferences';
import { GeneralSettings } from '@/components/appHome/settings/GeneralSettings';
import { SettingsDangerZone } from '@/components/appHome/settings/SettingsDangerZone';
import { cn } from '@/lib/utils/stringUtils';

const settingsNavigationItems = [
  {
    id: 'appearance',
    href: '#appearance',
    label: 'Appearance',
    icon: SunMoon,
  },
  {
    id: 'editing',
    href: '#editing',
    label: 'Editing',
    icon: Sliders,
  },
  {
    id: 'data',
    href: '#data',
    label: 'Backups and transfer',
    icon: Upload,
  },
  {
    id: 'reset',
    href: '#reset',
    label: 'Reset local data',
    icon: Trash2,
  },
] as const;

type SettingsSectionId = (typeof settingsNavigationItems)[number]['id'];

const ACTIVE_SECTION_OFFSET = 220;

export function SettingsPage() {
  const { hash } = useLocation();
  const [activeSectionId, setActiveSectionId] = useState<SettingsSectionId>(
    () =>
      settingsNavigationItems.find((item) => item.href === hash)?.id ??
      settingsNavigationItems[0].id
  );

  useEffect(() => {
    if (hash === '#data') {
      const section = document.getElementById('data');
      section?.scrollIntoView({ block: 'start' });
      section?.focus({ preventScroll: true });
    }
  }, [hash]);

  useEffect(() => {
    const updateActiveSection = () => {
      let nextActiveSectionId: SettingsSectionId =
        settingsNavigationItems[0].id;

      for (const item of settingsNavigationItems) {
        const section = document.getElementById(item.id);
        if (
          section &&
          section.getBoundingClientRect().top <= ACTIVE_SECTION_OFFSET
        ) {
          nextActiveSectionId = item.id;
        }
      }

      const isAtPageEnd =
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2;

      const lastSection =
        settingsNavigationItems[settingsNavigationItems.length - 1];
      if (isAtPageEnd && lastSection) {
        nextActiveSectionId = lastSection.id;
      }

      setActiveSectionId(nextActiveSectionId);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  return (
    <div className='ml-0 mr-auto w-full max-w-5xl'>
      <p className='mb-7 max-w-[38rem] border-b border-border/70 pb-6 text-sm leading-6 text-muted-foreground'>
        Preferences apply to all resumes in this browser. Changes save
        automatically.
      </p>
      <div className='grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[11rem_minmax(0,42rem)] xl:gap-14'>
        <SettingsNavigation
          activeSectionId={activeSectionId}
          onSectionSelect={setActiveSectionId}
        />
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

const SettingsNavigation = ({
  activeSectionId,
  onSectionSelect,
}: {
  activeSectionId: SettingsSectionId;
  onSectionSelect: (sectionId: SettingsSectionId) => void;
}) => (
  <nav
    aria-label='Settings sections'
    className='flex min-w-0 flex-wrap gap-1 border-y border-border/70 xl:sticky xl:top-24 xl:flex-nowrap xl:flex-col xl:gap-1 xl:self-start xl:border-y-0'
  >
    {settingsNavigationItems.map(({ id, href, label, icon: Icon }) => {
      const isActive = id === activeSectionId;

      return (
        <a
          key={href}
          href={href}
          onClick={() => onSectionSelect(id)}
          aria-current={isActive ? 'location' : undefined}
          className={cn(
            'inline-flex min-h-11 min-w-max items-center gap-2 border-b-2 border-transparent px-2 text-sm font-medium text-muted-foreground transition-colors duration-[var(--duration-quick)] hover:bg-muted/50 hover:text-foreground focus-visible:text-foreground xl:min-h-12 xl:w-full xl:gap-2.5 xl:rounded-md xl:border-b-2 xl:border-l-0 xl:px-3 xl:py-3 xl:hover:bg-muted/40 motion-reduce:transition-none',
            isActive &&
              'border-b-editorial-accent bg-muted/40 text-foreground xl:border-b-editorial-accent xl:bg-muted/50'
          )}
        >
          <Icon
            aria-hidden='true'
            className={cn(
              'hidden size-4 shrink-0 sm:inline',
              isActive && 'text-editorial-accent'
            )}
            strokeWidth={1.75}
          />
          <span>{label}</span>
        </a>
      );
    })}
  </nav>
);
