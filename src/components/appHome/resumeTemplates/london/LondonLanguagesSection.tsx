import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { getLanguagesSectionEntries } from '../resumeTemplates.helpers';
import { LONDON_FONT_SIZE, londonTemplateStyles } from './london.styles';
import { Text, View } from '@react-pdf/renderer';

const LondonLanguagesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getLanguagesSectionEntries(section);
  if (!sectionEntries.length) return null;

  return (
    <View style={londonTemplateStyles.section}>
      <Text style={londonTemplateStyles.sectionLabel}>{section.title}</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          rowGap: 8,
        }}
      >
        {sectionEntries.map((entry) => (
          <View
            key={entry.entryId}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '45%',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <View style={{ flex: 1, overflow: 'hidden' }}>
              <Text
                style={{
                  fontSize: LONDON_FONT_SIZE,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {entry.language}
              </Text>
            </View>
            <Text
              style={{
                fontSize: LONDON_FONT_SIZE,
                flexShrink: 0,
              }}
            >
              {entry.level}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
export default LondonLanguagesSection;
