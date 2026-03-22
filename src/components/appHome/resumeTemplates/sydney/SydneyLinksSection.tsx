import { Link, Text, View } from '@react-pdf/renderer';
import { getLinksSectionEntries } from '../resumeTemplates.helpers';
import type { SydneySectionProps } from './sydney.types';

export const SydneyLinksSection = ({ section, styles }: SydneySectionProps) => {
  const sectionEntries = getLinksSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{section.title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {sectionEntries.map((entry) => (
          <Link key={entry.entryId} src={entry.link} style={styles.link}>
            {entry.label || entry.link}
          </Link>
        ))}
      </View>
    </View>
  );
};
