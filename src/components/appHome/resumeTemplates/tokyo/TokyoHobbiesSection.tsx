import { Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getHobbiesSectionValue } from '../resumeTemplates.helpers';
import { tokyoTemplateStyles } from './tokyo.styles';

export const TokyoHobbiesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const hobbies = getHobbiesSectionValue(section);
  if (!hobbies.length) return null;

  return (
    <View style={tokyoTemplateStyles.sidebarSection}>
      <Text style={tokyoTemplateStyles.sidebarSectionLabel}>
        {section.title}
      </Text>
      <Text style={tokyoTemplateStyles.sidebarText}>{hobbies}</Text>
    </View>
  );
};
