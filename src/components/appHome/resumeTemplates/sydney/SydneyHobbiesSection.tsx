import { Text, View } from '@react-pdf/renderer';
import type { HobbiesSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import { getHobbiesSectionValue } from '../resumeTemplates.helpers';
import type { SydneySectionProps } from './sydney.types';

export const SydneyHobbiesSection = ({
  section,
  styles,
}: Omit<SydneySectionProps, 'section'> & {
  section: HobbiesSectionSnapshot;
}) => {
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
