'use client';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { observer } from 'mobx-react-lite';
import GeneralSettings from './GeneralSettings';
import EditorPreferences from './EditorPreferences';
import SettingsDangerZone from './SettingsDangerZone';
import DataImportExport from './DataImportExport';
import AuthenticationStatus from './AuthenticationStatus';
import ModelCustomizationSettings from './ModelCustomizationSettings';

const SettingsPage = observer(() => {
  return (
    <SidebarInset>
      <header className="shrink-0 flex items-center h-16 gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4 mr-2" />
          <span className="font-medium">Settings</span>
        </div>
      </header>
      <div className="flex flex-col flex-1 w-full max-w-2xl gap-8 p-6 mx-auto">
        <AuthenticationStatus />
        <Separator />
        <GeneralSettings />
        <Separator />
        <EditorPreferences />
        <Separator />
        <ModelCustomizationSettings />
        <Separator />
        <DataImportExport />
        <Separator />
        <SettingsDangerZone />
      </div>
    </SidebarInset>
  );
});

export default SettingsPage;
