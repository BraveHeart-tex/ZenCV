import { Text, View } from '@react-pdf/renderer';
import { getHobbiesSectionValue } from '../resumeTemplates.helpers';
import type { SydneySectionProps } from './sydney.types';

export const SydneyHobbiesSection = ({
  section,
  styles,
}: SydneySectionProps) => {
  const hobbies = getHobbiesSectionValue(section);
  if (!hobbies.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{section.title}</Text>
      <Text style={styles.mainText}>{hobbies}</Text>
    </View>
  );
};
