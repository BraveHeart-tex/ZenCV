import { Text, View } from '@react-pdf/renderer';
import { CHECKED_METADATA_VALUE } from '@/lib/constants';
import { SECTION_METADATA_KEYS } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import {
  getReferencesSectionEntries,
  getSectionMetadata,
} from '../resumeTemplates.helpers';
import { TOKYO_FONT_SIZE, tokyoTemplateStyles } from './tokyo.styles';

export const TokyoReferencesSection = ({
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
    <View style={tokyoTemplateStyles.mainSection}>
      <Text style={tokyoTemplateStyles.mainSectionLabel}>{section.title}</Text>
      <View style={{ marginTop: 6, gap: 8 }}>
        {hideReferences ? (
          <Text style={{ fontSize: TOKYO_FONT_SIZE, color: '#2d2d2d' }}>
            References available upon request
          </Text>
        ) : (
          sectionEntries.map((entry) => (
            <View key={entry.entryId} style={{ gap: 2 }}>
              <Text style={tokyoTemplateStyles.entryTitle}>
                {entry.referentFullName}
                {entry.referentCompany ? ` · ${entry.referentCompany}` : ''}
              </Text>
              <Text style={tokyoTemplateStyles.mainMuted}>
                {entry.referentEmail}
                {entry.referentEmail && entry.referentPhone ? '  ·  ' : ''}
                {entry.referentPhone}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};
