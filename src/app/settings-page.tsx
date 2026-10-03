import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DataImportExport } from '@/components/appHome/settings/DataImportExport';
import { EditorPreferences } from '@/components/appHome/settings/EditorPreferences';
import { GeneralSettings } from '@/components/appHome/settings/GeneralSettings';
import { SettingsDangerZone } from '@/components/appHome/settings/SettingsDangerZone';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

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
    <SidebarInset>
      <header className='shrink-0 flex items-center h-16 gap-2 border-b px-4'>
        <SidebarTrigger className='size-11' />
        <Separator orientation='vertical' className='h-4 mx-1' />
        <span className='font-medium text-sm' aria-hidden='true'>
          Settings
        </span>
      </header>

      <div className='flex flex-col w-full max-w-2xl gap-0 px-4 py-6 sm:px-6 mx-auto'>
        <div className='pb-6 space-y-2'>
          <h1 className='text-2xl font-semibold tracking-tight'>Settings</h1>
          <p className='text-sm leading-6 text-muted-foreground'>
            Preferences apply to all resumes in this browser. Changes save
            automatically.
          </p>
        </div>
        <SettingsSection>
          <GeneralSettings />
        </SettingsSection>

        <SettingsDivider />

        <SettingsSection>
          <EditorPreferences />
        </SettingsSection>

        <SettingsDivider />

        <SettingsSection>
          <DataImportExport />
        </SettingsSection>

        <SettingsDivider />

        <SettingsSection>
          <SettingsDangerZone />
        </SettingsSection>
      </div>
    </SidebarInset>
  );
}

const SettingsSection = ({ children }: { children: React.ReactNode }) => (
  <div className='py-6'>{children}</div>
);

const SettingsDivider = () => <Separator />;
