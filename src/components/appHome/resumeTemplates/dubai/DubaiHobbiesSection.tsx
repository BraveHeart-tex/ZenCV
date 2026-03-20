import { Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getHobbiesSectionValue } from '../resumeTemplates.helpers';
import { dubaiTemplateStyles } from './dubai.styles';

export const DubaiHobbiesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const hobbies = getHobbiesSectionValue(section);
  if (!hobbies.length) return null;

  return (
    <View style={dubaiTemplateStyles.sidebarSection}>
      <Text style={dubaiTemplateStyles.sidebarSectionLabel}>
        {section.title}
      </Text>
      <Text style={dubaiTemplateStyles.sidebarText}>{hobbies}</Text>
    </View>
  );
};
