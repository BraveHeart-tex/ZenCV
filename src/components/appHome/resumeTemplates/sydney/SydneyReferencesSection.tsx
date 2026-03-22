import { Text, View } from '@react-pdf/renderer';
import { CHECKED_METADATA_VALUE } from '@/lib/constants';
import { SECTION_METADATA_KEYS } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  getReferencesSectionEntries,
  getSectionMetadata,
} from '../resumeTemplates.helpers';
import { SYDNEY_FONT_SIZE } from './sydney.styles';
import type { SydneySectionProps } from './sydney.types';

export const SydneyReferencesSection = ({
  section,
  styles,
}: SydneySectionProps) => {
  const sectionEntries = getReferencesSectionEntries(section);
  const hideReferences =
    getSectionMetadata(
      section,
      SECTION_METADATA_KEYS.REFERENCES.HIDE_REFERENCES
    ) === CHECKED_METADATA_VALUE;

  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{section.title}</Text>
      {hideReferences ? (
        <Text style={{ fontSize: SYDNEY_FONT_SIZE, color: '#333333' }}>
          References available upon request
        </Text>
      ) : (
        <View style={{ gap: 8 }}>
          {sectionEntries.map((entry) => (
            <View key={entry.entryId} style={{ gap: 1 }}>
              <Text style={styles.entryTitle}>
                {entry.referentFullName}
                {entry.referentCompany ? ` · ${entry.referentCompany}` : ''}
              </Text>
              <Text style={styles.mainMuted}>
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
