import { Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getHobbiesSectionValue } from '../resumeTemplates.helpers';
import { sydneyTemplateStyles } from './sydney.styles';

export const SydneyHobbiesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const hobbies = getHobbiesSectionValue(section);
  if (!hobbies.length) return null;

  return (
    <View style={sydneyTemplateStyles.section}>
      <Text style={sydneyTemplateStyles.sectionLabel}>{section.title}</Text>
      <Text style={sydneyTemplateStyles.mainText}>{hobbies}</Text>
    </View>
  );
};
