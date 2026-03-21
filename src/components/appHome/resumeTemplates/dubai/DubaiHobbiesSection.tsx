import { Text, View } from '@react-pdf/renderer';
import { getHobbiesSectionValue } from '../resumeTemplates.helpers';
import type { DubaiSectionProps } from './dubai.types';

export const DubaiHobbiesSection = ({ section, styles }: DubaiSectionProps) => {
  const hobbies = getHobbiesSectionValue(section);
  if (!hobbies.length) {
    return null;
  }

  return (
    <View style={styles.sidebarSection}>
      <Text style={styles.sidebarSectionLabel}>{section.title}</Text>
      <Text style={styles.sidebarText}>{hobbies}</Text>
    </View>
  );
};
