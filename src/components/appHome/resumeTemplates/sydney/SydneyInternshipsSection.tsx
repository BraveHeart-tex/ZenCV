import { Text, View } from '@react-pdf/renderer';
import type { InternshipSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import { getSemanticInternshipSectionEntries } from '../resumeTemplates.helpers';
import { SydneySectionEntry } from './SydneySectionEntry';
import type { SydneySectionProps } from './sydney.types';

export const SydneyInternshipsSection = ({
  section,
  styles,
}: Omit<SydneySectionProps, 'section'> & {
  section: InternshipSectionSnapshot;
}) => {
  const sectionEntries = getSemanticInternshipSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{section.title}</Text>
      {sectionEntries.map((entry) => (
        <SydneySectionEntry
          entry={entry}
          key={entry.entryId}
          titleKey='employer'
          subtitleKey='jobTitle'
          styles={styles}
        />
      ))}
    </View>
  );
};
