import {
  SettingsRow,
  SettingsSectionHeader,
} from '@/components/appHome/settings/SettingsShared';
import { AppColorModeToggle } from '../AppColorModeToggle';

export const GeneralSettings = ({ sectionId }: { sectionId?: string }) => {
  return (
    <section
      id={sectionId}
      tabIndex={sectionId ? -1 : undefined}
      className='space-y-5'
    >
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
    </section>
  );
};
