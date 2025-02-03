import { Text, View } from '@react-pdf/renderer';
import { manhattanTemplateStyles } from './manhattan.styles';
import { getWorkExperienceSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import ManhattanSectionEntry from './ManhattanSectionEntry';

const ManhattanWorkExperienceSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getWorkExperienceSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={manhattanTemplateStyles.section}>
      <Text style={manhattanTemplateStyles.sectionLabel}>{section.title}</Text>
      <View style={{ gap: 15 }}>
        {sectionEntries.map((entry) => (
          <ManhattanSectionEntry
            entry={entry}
            key={entry.entryId}
            subtitleKey="jobTitle"
            titleKey="employer"
          />
        ))}
      </View>
    </View>
  );
};

export default ManhattanWorkExperienceSection;
