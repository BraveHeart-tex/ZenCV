import {
  SettingsRow,
  SettingsSectionHeader,
} from '@/components/appHome/settings/SettingsShared';
import { AppColorModeToggle } from '../AppColorModeToggle';

export const GeneralSettings = () => {
  return (
    <div className='space-y-6'>
      <SettingsSectionHeader
        title='General'
        description='Manage your application preferences.'
      />
      <SettingsRow label='Theme' htmlFor='colorScheme'>
        <AppColorModeToggle />
      </SettingsRow>
    </div>
  );
};
