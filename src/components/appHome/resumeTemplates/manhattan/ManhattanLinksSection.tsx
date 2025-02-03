import { Text, View, Link } from '@react-pdf/renderer';
import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';
import { getLinksSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';

const ManhattanLinksSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getLinksSectionEntries(section);

  if (!sectionEntries.length) return null;

  return (
    <View style={manhattanTemplateStyles.section}>
      <Text style={manhattanTemplateStyles.sectionLabel}>{section.title}</Text>
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
            <Link href={entry.link} style={manhattanTemplateStyles.link}>
              {entry.label}
            </Link>
            <Text
              style={{
                color: 'black',
                fontSize: MANHATTAN_FONT_SIZE,
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

export default ManhattanLinksSection;
