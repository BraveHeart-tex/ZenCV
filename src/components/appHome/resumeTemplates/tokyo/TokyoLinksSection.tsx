import { Link, Text, View } from '@react-pdf/renderer';
import { getLinksSectionEntries } from '../resumeTemplates.helpers';
import type { TokyoSectionProps } from './tokyo.types';

export const TokyoLinksSection = ({ section, styles }: TokyoSectionProps) => {
  const sectionEntries = getLinksSectionEntries(section);
  if (!sectionEntries.length) return null;

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
