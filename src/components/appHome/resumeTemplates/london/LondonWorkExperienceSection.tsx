import { Text, View } from '@react-pdf/renderer';
import { londonTemplateStyles } from './london.styles';
import { getWorkExperienceSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import LondonSectionEntry from './LondonSectionEntry';

const LondonWorkExperienceSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getWorkExperienceSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={londonTemplateStyles.section}>
      <Text style={londonTemplateStyles.sectionLabel}>{section.title}</Text>
      <View style={{ gap: 15 }}>
        {sectionEntries.map((entry) => (
          <LondonSectionEntry
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

export default LondonWorkExperienceSection;
