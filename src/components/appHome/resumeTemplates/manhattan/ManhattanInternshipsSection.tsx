import { Text, View } from '@react-pdf/renderer';
import { getSemanticInternshipSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import type { InternshipSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import { ManhattanSectionEntry } from './ManhattanSectionEntry';
import { manhattanTemplateStyles } from './manhattan.styles';

export const ManhattanInternshipsSection = ({
  section,
}: {
  section: InternshipSectionSnapshot;
}) => {
  const sectionEntries = getSemanticInternshipSectionEntries(section);

  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={manhattanTemplateStyles.section}>
      <Text style={manhattanTemplateStyles.sectionLabel}>{section.title}</Text>
      <View style={{ gap: 15 }}>
        {sectionEntries.map((entry) => (
          <ManhattanSectionEntry
            entry={entry}
            key={entry.entryId}
            titleKey='employer'
            subtitleKey='jobTitle'
          />
        ))}
      </View>
    </View>
  );
};
