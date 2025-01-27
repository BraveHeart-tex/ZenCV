import { Text, View } from '@react-pdf/renderer';
import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import { PDF_BODY_FONT_SIZE } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { TemplateDataSection } from '@/lib/types';
import {
  findValueInItemFields,
  getRenderableEntries,
  getSectionMetadata,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import {
  CHECKED_METADATA_VALUE,
  FIELD_NAMES,
  SECTION_METADATA_KEYS,
} from '@/lib/constants';

const LondonReferencesSection = ({
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

  if (sectionEntries.length === 0) return null;

  return (
    <View
      style={{
        ...londonTemplateStyles.section,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text
        style={{
          ...londonTemplateStyles.sectionLabel,
          height: '100%',
          width: '25%',
        }}
      >
        {section?.title}
      </Text>
      <View
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          width: '75%',
        }}
      >
        {hideReferences ? (
          <Text
            style={{
              fontSize: 10.9,
            }}
          >
            References available upon request
          </Text>
        ) : (
          <>
            {sectionEntries.map(
              ({
                entryId,
                referentPhone,
                referentCompany,
                referentEmail,
                referentFullName,
              }) => (
                <View
                  key={entryId}
                  style={{
                    fontSize: PDF_BODY_FONT_SIZE,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10.9,
                    }}
                  >
                    {referentFullName}
                    {referentCompany ? ` from ${referentCompany}` : ''}
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                      gap: 4,
                    }}
                  >
                    <Text>{referentEmail}</Text>
                    <Text>
                      {referentEmail && referentPhone ? '- ' : ''}
                      {referentPhone}
                    </Text>
                  </View>
                </View>
              ),
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default LondonReferencesSection;
