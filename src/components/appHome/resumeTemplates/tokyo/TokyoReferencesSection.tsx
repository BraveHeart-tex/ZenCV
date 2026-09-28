import { Text, View } from '@react-pdf/renderer';
import type { ReferencesSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import { getReferencesSectionEntries } from '../resumeTemplates.helpers';
import { TOKYO_FONT_SIZE } from './tokyo.styles';
import type { TokyoSectionProps } from './tokyo.types';

export const TokyoReferencesSection = ({
  section,
  styles,
}: Omit<TokyoSectionProps, 'section'> & {
  section: ReferencesSectionSnapshot;
}) => {
  const sectionEntries = getReferencesSectionEntries(section);
  const hideReferences = section.hideReferences;

  if (!sectionEntries.length) {
    return null;
  }

  return (
    <View style={styles.mainSection}>
      <Text style={styles.mainSectionLabel}>{section.title}</Text>
      <View style={{ marginTop: 6, gap: 8 }}>
        {hideReferences ? (
          <Text style={{ fontSize: TOKYO_FONT_SIZE, color: '#2d2d2d' }}>
            References available upon request
          </Text>
        ) : (
          sectionEntries.map((entry) => (
            <View key={entry.entryId} style={{ gap: 2 }}>
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
          ))
        )}
      </View>
    </View>
  );
};
