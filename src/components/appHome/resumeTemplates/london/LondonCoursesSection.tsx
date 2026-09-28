import { Text, View } from '@react-pdf/renderer';
import type { ResumeSnapshotSection } from '@/lib/builderDocument/resumeDocumentSnapshot';
import { getCoursesSectionEntries } from '../resumeTemplates.helpers';
import { LondonSectionEntry } from './LondonSectionEntry';
import { londonTemplateStyles } from './london.styles';

export const LondonCoursesSection = ({
  section,
}: {
  section: ResumeSnapshotSection;
}) => {
  const sectionEntries = getCoursesSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={londonTemplateStyles.section}>
      <Text style={londonTemplateStyles.sectionLabel}>{section.title}</Text>
      <View style={{ gap: 15 }}>
        {sectionEntries.map((entry) => (
          <LondonSectionEntry
            entry={entry}
            key={entry.entryId}
            titleKey='course'
            subtitleKey='institution'
          />
        ))}
      </View>
    </View>
  );
};
