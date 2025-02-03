import { Text, View } from '@react-pdf/renderer';
import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import {
  getReferencesSectionEntries,
  getSectionMetadata,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { CHECKED_METADATA_VALUE } from '@/lib/constants';
import { SECTION_METADATA_KEYS } from '@/lib/stores/documentBuilder/documentBuilder.constants';

const ManhattanReferencesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getReferencesSectionEntries(section);

  const hideReferences =
    getSectionMetadata(
      section,
      SECTION_METADATA_KEYS.REFERENCES.HIDE_REFERENCES,
    ) === CHECKED_METADATA_VALUE;

  if (!sectionEntries.length) return null;

  return (
    <View style={manhattanTemplateStyles.section}>
      <Text style={manhattanTemplateStyles.sectionLabel}>{section.title}</Text>
      <View style={{ gap: 10 }}>
        {hideReferences ? (
          <Text
            style={{
              fontSize: MANHATTAN_FONT_SIZE,
            }}
          >
            References available upon request
          </Text>
        ) : (
          sectionEntries.map((entry) => (
            <View
              key={entry.entryId}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Text
                style={{
                  fontSize: MANHATTAN_FONT_SIZE,
                  fontWeight: 'bold',
                }}
              >
                {entry.referentFullName}
                {entry.referentCompany ? ` from ${entry.referentCompany}` : ''}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: MANHATTAN_FONT_SIZE,
                  }}
                >
                  {entry.referentEmail}
                  {entry.referentEmail && entry.referentPhone ? ' - ' : ''}
                  {entry.referentPhone}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default ManhattanReferencesSection;
