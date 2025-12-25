import { AuthenticationStatus } from '@/components/appHome/settings/AuthenticationStatus';
import { DataImportExport } from '@/components/appHome/settings/DataImportExport';
import { EditorPreferences } from '@/components/appHome/settings/EditorPreferences';
import { GeneralSettings } from '@/components/appHome/settings/GeneralSettings';
import { ModelCustomizationSettings } from '@/components/appHome/settings/ModelCustomizationSettings';
import { SettingsDangerZone } from '@/components/appHome/settings/SettingsDangerZone';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const SettingsPage = () => {
  return (
    <SidebarInset>
      <header className='shrink-0 flex items-center h-16 gap-2 border-b'>
        <div className='flex items-center gap-2 px-3'>
          <SidebarTrigger />
          <Separator orientation='vertical' className='h-4 mr-2' />
          <span className='font-medium'>Settings</span>
        </div>
      </header>
      <div className='flex flex-col flex-1 w-full max-w-2xl gap-8 p-6 mx-auto'>
        <AuthenticationStatus />
        <Separator />
        <GeneralSettings />
        <Separator />
        <EditorPreferences />
        <Separator />
        <ModelCustomizationSettings />
        <DataImportExport />
        <Separator />
        <SettingsDangerZone />
      </div>
    </SidebarInset>
  );
};

export default SettingsPage;
