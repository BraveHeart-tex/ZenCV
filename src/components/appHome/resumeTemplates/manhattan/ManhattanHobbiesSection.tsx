import { Text, View } from '@react-pdf/renderer';
import { getHobbiesSectionValue } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';

export const ManhattanHobbiesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const hobbies = getHobbiesSectionValue(section);

  if (!hobbies.length) return null;

  return (
    <View style={manhattanTemplateStyles.section}>
      <Text style={manhattanTemplateStyles.sectionLabel}>{section.title}</Text>
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
