import { Text, View } from '@react-pdf/renderer';
import { CHECKED_METADATA_VALUE } from '@/lib/constants';
import { SECTION_METADATA_KEYS } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import {
  getReferencesSectionEntries,
  getSectionMetadata,
} from '../resumeTemplates.helpers';
import { SYDNEY_FONT_SIZE, sydneyTemplateStyles } from './sydney.styles';

export const SydneyReferencesSection = ({
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
    <View style={sydneyTemplateStyles.section}>
      <Text style={sydneyTemplateStyles.sectionLabel}>{section.title}</Text>
      {hideReferences ? (
        <Text style={{ fontSize: SYDNEY_FONT_SIZE, color: '#333333' }}>
          References available upon request
        </Text>
      ) : (
        <View style={{ gap: 8 }}>
          {sectionEntries.map((entry) => (
            <View key={entry.entryId} style={{ gap: 1 }}>
              <Text style={sydneyTemplateStyles.entryTitle}>
                {entry.referentFullName}
                {entry.referentCompany ? ` · ${entry.referentCompany}` : ''}
              </Text>
              <Text style={sydneyTemplateStyles.mainMuted}>
                {entry.referentEmail}
                {entry.referentEmail && entry.referentPhone ? '  ·  ' : ''}
                {entry.referentPhone}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
