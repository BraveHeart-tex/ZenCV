import { Text, View } from '@react-pdf/renderer';
import { getReferencesSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import type { ReferencesSectionSnapshot } from '@/lib/builderDocument/resumeDocumentSnapshot';
import {
  MANHATTAN_FONT_SIZE,
  manhattanTemplateStyles,
} from './manhattan.styles';

export const ManhattanReferencesSection = ({
  section,
}: {
  section: ReferencesSectionSnapshot;
}) => {
  const sectionEntries = getReferencesSectionEntries(section);

  const hideReferences = section.hideReferences;

  if (!sectionEntries.length) {
    return null;
  }

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
