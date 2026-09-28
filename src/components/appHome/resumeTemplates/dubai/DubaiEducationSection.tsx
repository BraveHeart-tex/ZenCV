import { Text, View } from '@react-pdf/renderer';
import { getEducationSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import type { ResumeSnapshotSection } from '@/lib/builderDocument/resumeDocumentSnapshot';
import { DubaiSectionEntry } from './DubaiSectionEntry';
import type { DubaiSectionProps } from './dubai.types';

export const DubaiEducationSection = ({
  section,
  styles,
}: Omit<DubaiSectionProps, 'section'> & { section: ResumeSnapshotSection }) => {
  const sectionEntries = getEducationSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.mainSection}>
      <Text style={styles.mainSectionLabel}>{section.title}</Text>
      {sectionEntries.map((entry) => (
        <DubaiSectionEntry
          entry={entry}
          key={entry.entryId}
          titleKey='school'
          subtitleKey='degree'
          styles={styles}
        />
      ))}
    </View>
  );
};
