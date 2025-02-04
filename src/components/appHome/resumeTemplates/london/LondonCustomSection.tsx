import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getCustomSectionEntries } from '../resumeTemplates.helpers';
import { londonTemplateStyles } from './london.styles';
import { Text, View } from '@react-pdf/renderer';
import LondonSectionEntry from './LondonSectionEntry';

const LondonCustomSection = ({ section }: { section: TemplateDataSection }) => {
  const sectionEntries = getCustomSectionEntries(section);

  if (!sectionEntries.length) return null;

  return (
    <View style={londonTemplateStyles.section}>
      <Text style={londonTemplateStyles.sectionLabel}>{section.title}</Text>
      <View style={{ gap: 15 }}>
        {sectionEntries.map((entry) => (
          <LondonSectionEntry
            entry={entry}
            key={entry.entryId}
            titleKey="name"
            subtitleKey="city"
          />
        ))}
      </View>
    </View>
  );
};

export default LondonCustomSection;
