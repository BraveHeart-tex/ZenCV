import { useUser } from '@clerk/react';
import { AuthenticationStatus } from '@/components/appHome/settings/AuthenticationStatus';
import { DataImportExport } from '@/components/appHome/settings/DataImportExport';
import { EditorPreferences } from '@/components/appHome/settings/EditorPreferences';
import { GeneralSettings } from '@/components/appHome/settings/GeneralSettings';
import { ModelCustomizationSettings } from '@/components/appHome/settings/ModelCustomizationSettings';
import { SettingsDangerZone } from '@/components/appHome/settings/SettingsDangerZone';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export function SettingsPage() {
  const { isSignedIn } = useUser();

  return (
    <SidebarInset>
      <header className='shrink-0 flex items-center h-16 gap-2 border-b px-4'>
        <SidebarTrigger />
        <Separator orientation='vertical' className='h-4 mx-1' />
        <span className='font-medium text-sm'>Settings</span>
      </header>

      <div className='flex flex-col w-full max-w-2xl gap-0 p-6 mx-auto'>
        <SettingsSection>
          <AuthenticationStatus />
        </SettingsSection>

        <SettingsDivider />

        <SettingsSection>
          <GeneralSettings />
        </SettingsSection>

        <SettingsDivider />

        <SettingsSection>
          <EditorPreferences />
        </SettingsSection>

        {isSignedIn && (
          <>
            <SettingsDivider />
            <SettingsSection>
              <ModelCustomizationSettings />
            </SettingsSection>
          </>
        )}

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
  <div className='py-4'>{children}</div>
);

const SettingsDivider = () => <Separator />;
