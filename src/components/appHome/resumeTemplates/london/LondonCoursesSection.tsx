import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getCoursesSectionEntries } from '../resumeTemplates.helpers';
import { londonTemplateStyles } from './london.styles';
import { Text, View } from '@react-pdf/renderer';
import LondonSectionEntry from './LondonSectionEntry';

const LondonCoursesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getCoursesSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={londonTemplateStyles.section}>
      <Text style={londonTemplateStyles.sectionLabel}>{section.title}</Text>
      <View style={{ gap: 15 }}>
        {sectionEntries.map((entry) => (
          <LondonSectionEntry
            entry={entry}
            key={entry.entryId}
            titleKey="course"
            subtitleKey="institution"
          />
        ))}
      </View>
    </View>
  );
};
export default LondonCoursesSection;
