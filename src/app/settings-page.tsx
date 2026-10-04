import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DataImportExport } from '@/components/appHome/settings/DataImportExport';
import { EditorPreferences } from '@/components/appHome/settings/EditorPreferences';
import { GeneralSettings } from '@/components/appHome/settings/GeneralSettings';
import { SettingsDangerZone } from '@/components/appHome/settings/SettingsDangerZone';
import { Separator } from '@/components/ui/separator';

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
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-0'>
      <p className='pb-6 text-sm leading-6 text-muted-foreground'>
        Preferences apply to all resumes in this browser. Changes save
        automatically.
      </p>
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
  );
}

const SettingsSection = ({ children }: { children: React.ReactNode }) => (
  <div className='py-6'>{children}</div>
);

const SettingsDivider = () => <Separator />;
