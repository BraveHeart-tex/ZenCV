import { Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { MANHATTAN_FONT_SIZE } from '../manhattan/manhattan.styles';
import { getHobbiesSectionValue } from '../resumeTemplates.helpers';
import { londonTemplateStyles } from './london.styles';

export const LondonHobbiesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const hobbies = getHobbiesSectionValue(section);
  if (!hobbies.length) return null;

  return (
    <View style={londonTemplateStyles.section}>
      <Text style={londonTemplateStyles.sectionLabel}>{section.title}</Text>
      <View>
        <Text
          style={{
            fontSize: MANHATTAN_FONT_SIZE,
          }}
        >
          {hobbies}
        </Text>
      </View>
    </View>
  );
};
