import { Text, View } from '@react-pdf/renderer';
import { CHECKED_METADATA_VALUE } from '@/lib/constants';
import { SECTION_METADATA_KEYS } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import {
  getReferencesSectionEntries,
  getSectionMetadata,
} from '../resumeTemplates.helpers';
import { LONDON_FONT_SIZE, londonTemplateStyles } from './london.styles';

export const LondonReferencesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getReferencesSectionEntries(section);

  const hideReferences =
    getSectionMetadata(
      section,
      SECTION_METADATA_KEYS.REFERENCES.HIDE_REFERENCES
    ) === CHECKED_METADATA_VALUE;

  if (!sectionEntries.length) return null;

  return (
    <View style={londonTemplateStyles.section}>
      <Text style={londonTemplateStyles.sectionLabel}>{section.title}</Text>
      <View style={{ gap: 10 }}>
        {hideReferences ? (
          <Text
            style={{
              fontSize: LONDON_FONT_SIZE,
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
                  fontSize: LONDON_FONT_SIZE,
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
                    fontSize: LONDON_FONT_SIZE,
                  }}
                >
                  {entry.referentEmail}
                  {entry.referentEmail && entry.referentPhone ? ' | ' : ''}
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
