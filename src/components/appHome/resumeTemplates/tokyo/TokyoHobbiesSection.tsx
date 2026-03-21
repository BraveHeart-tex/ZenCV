import { Text, View } from '@react-pdf/renderer';
import { getHobbiesSectionValue } from '../resumeTemplates.helpers';
import type { TokyoSectionProps } from './tokyo.types';

export const TokyoHobbiesSection = ({ section, styles }: TokyoSectionProps) => {
  const hobbies = getHobbiesSectionValue(section);
  if (!hobbies.length) return null;

  return (
    <View style={styles.sidebarSection}>
      <Text style={styles.sidebarSectionLabel}>{section.title}</Text>
      <Text style={styles.sidebarText}>{hobbies}</Text>
    </View>
  );
};
