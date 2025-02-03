import { Text, View } from '@react-pdf/renderer';
import { manhattanTemplateStyles } from './manhattan.styles';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';
import { FIELD_NAMES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  findValueInItemFields,
  getRenderableEntries,
  getSectionMetadata,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { CHECKED_METADATA_VALUE } from '@/lib/constants';
import { SECTION_METADATA_KEYS } from '@/lib/stores/documentBuilder/documentBuilder.constants';

const ManhattanReferencesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        referentPhone: findValueInItemFields(
          fields,
          FIELD_NAMES.REFERENCES.PHONE,
        ),
        referentCompany: findValueInItemFields(
          fields,
          FIELD_NAMES.REFERENCES.COMPANY,
        ),
        referentEmail: findValueInItemFields(
          fields,
          FIELD_NAMES.REFERENCES.REFERENT_EMAIL,
        ),
        referentFullName: findValueInItemFields(
          fields,
          FIELD_NAMES.REFERENCES.REFERENT_FULL_NAME,
        ),
      };
    }),
  );

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
              fontSize: 11,
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
                  fontSize: 11,
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
                    fontSize: 11,
                    color: '#666666',
                  }}
                >
                  {entry.referentEmail}
                  {entry.referentEmail && entry.referentPhone ? ' • ' : ''}
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
