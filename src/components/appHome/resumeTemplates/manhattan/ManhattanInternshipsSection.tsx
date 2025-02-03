import { Text, View } from '@react-pdf/renderer';
import { manhattanTemplateStyles } from './manhattan.styles';
import { getInternshipsSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import ManhattanSectionEntry from './ManhattanSectionEntry';

const ManhattanInternshipsSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getInternshipsSectionEntries(section);

  if (!sectionEntries.length) return null;

  return (
    <View style={manhattanTemplateStyles.section}>
      <Text style={manhattanTemplateStyles.sectionLabel}>{section.title}</Text>
      <View style={{ gap: 15 }}>
        {sectionEntries.map((entry) => (
          <ManhattanSectionEntry
            entry={entry}
            key={entry.entryId}
            titleKey="employer"
            subtitleKey="jobTitle"
          />
        ))}
      </View>
    </View>
  );
};

export default ManhattanInternshipsSection;
