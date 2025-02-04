import { Text, View, Link } from '@react-pdf/renderer';
import { LONDON_FONT_SIZE, londonTemplateStyles } from './london.styles';
import { getLinksSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';

const LondonLinksSection = ({ section }: { section: TemplateDataSection }) => {
  const sectionEntries = getLinksSectionEntries(section);

  if (!sectionEntries.length) return null;

  return (
    <View style={londonTemplateStyles.section}>
      <Text style={londonTemplateStyles.sectionLabel}>{section.title}</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {sectionEntries.map((entry, index) => (
          <View
            key={entry.entryId}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Link href={entry.link} style={londonTemplateStyles.link}>
              {entry.label}
            </Link>
            <Text
              style={{
                color: '#666666',
                fontSize: LONDON_FONT_SIZE,
              }}
            >
              {index < sectionEntries.length - 1 && ' | '}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default LondonLinksSection;
