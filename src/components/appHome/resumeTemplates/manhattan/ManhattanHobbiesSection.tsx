import { Text, View } from '@react-pdf/renderer';
import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';
import { getHobbiesSectionValue } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';

const ManhattanHobbiesSection = ({
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

export default ManhattanHobbiesSection;
