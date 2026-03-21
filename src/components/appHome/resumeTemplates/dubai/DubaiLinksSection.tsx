import { Link, Text, View } from '@react-pdf/renderer';
import { getLinksSectionEntries } from '../resumeTemplates.helpers';
import type { DubaiSectionProps } from './dubai.types';

export const DubaiLinksSection = ({ section, styles }: DubaiSectionProps) => {
  const sectionEntries = getLinksSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.sidebarSection}>
      <Text style={styles.sidebarSectionLabel}>{section.title}</Text>
      <View style={{ flexDirection: 'column', gap: 4 }}>
        {sectionEntries.map((entry) => (
          <Link key={entry.entryId} src={entry.link} style={styles.link}>
            {entry.label || entry.link}
          </Link>
        ))}
      </View>
    </View>
  );
};
