import { Link, Text, View } from '@react-pdf/renderer';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getLinksSectionEntries } from '../resumeTemplates.helpers';
import { sydneyTemplateStyles } from './sydney.styles';

export const SydneyLinksSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getLinksSectionEntries(section);
  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={sydneyTemplateStyles.section}>
      <Text style={sydneyTemplateStyles.sectionLabel}>{section.title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {sectionEntries.map((entry) => (
          <Link
            key={entry.entryId}
            src={entry.link}
            style={sydneyTemplateStyles.link}
          >
            {entry.label || entry.link}
          </Link>
        ))}
      </View>
    </View>
  );
};
