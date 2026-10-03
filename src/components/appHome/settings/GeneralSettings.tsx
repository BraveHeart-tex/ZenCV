import {
  SettingsRow,
  SettingsSectionHeader,
} from '@/components/appHome/settings/SettingsShared';
import { AppColorModeToggle } from '../AppColorModeToggle';

export const GeneralSettings = () => {
  return (
    <div className='space-y-2'>
      <SettingsSectionHeader
        title='Appearance'
        description='Choose how ZenCV looks.'
      />
      <SettingsRow
        stackOnMobile
        label='Color theme'
        description='System follows your browser’s appearance preference.'
      >
        <AppColorModeToggle segmented />
      </SettingsRow>
    </div>
  );
};
