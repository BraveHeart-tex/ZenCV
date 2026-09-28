import { Text, View } from '@react-pdf/renderer';
import type { InternshipSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import { getSemanticInternshipSectionEntries } from '../resumeTemplates.helpers';
import { TokyoSectionEntry } from './TokyoSectionEntry';
import type { TokyoSectionProps } from './tokyo.types';

export const TokyoInternshipsSection = ({
  section,
  styles,
}: Omit<TokyoSectionProps, 'section'> & {
  section: InternshipSectionSnapshot;
}) => {
  const sectionEntries = getSemanticInternshipSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.mainSection}>
      <Text style={styles.mainSectionLabel}>{section.title}</Text>
      <View style={{ marginTop: 6 }}>
        {sectionEntries.map((entry) => (
          <TokyoSectionEntry
            entry={entry}
            key={entry.entryId}
            titleKey='employer'
            subtitleKey='jobTitle'
            styles={styles}
          />
        ))}
      </View>
    </View>
  );
};
