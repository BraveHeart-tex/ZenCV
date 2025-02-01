import { Text, View } from '@react-pdf/renderer';
import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import {
  PDF_BODY_FONT_SIZE,
  pdfHtmlRenderers,
} from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import Html from 'react-pdf-html';
import {
  findValueInItemFields,
  getRenderableEntries,
} from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';

import { FIELD_NAMES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';

const LondonCustomSection = ({ section }: { section: TemplateDataSection }) => {
  const sectionEntries = getRenderableEntries(
    section.items.map((item) => {
      const fields = item.fields;
      return {
        entryId: crypto.randomUUID(),
        name: findValueInItemFields(fields, FIELD_NAMES.CUSTOM.ACTIVITY_NAME),
        city: findValueInItemFields(fields, FIELD_NAMES.CUSTOM.CITY),
        startDate: findValueInItemFields(fields, FIELD_NAMES.CUSTOM.START_DATE),
        endDate: findValueInItemFields(fields, FIELD_NAMES.CUSTOM.END_DATE),
        description: findValueInItemFields(
          fields,
          FIELD_NAMES.CUSTOM.DESCRIPTION,
        ),
      };
    }),
  );

  if (!sectionEntries.length) return null;

  return (
    <View
      style={{
        ...londonTemplateStyles.section,
        display: 'flex',
        flexDirection:
          sectionEntries.length === 1 &&
          sectionEntries.every((item) => !item.startDate && !item.endDate)
            ? 'row'
            : 'column',
        gap: 10,
      }}
    >
      <Text
        style={{
          ...londonTemplateStyles.sectionLabel,
          width: '23%',
        }}
      >
        {section?.title}
      </Text>
      <View
        style={{
          display: 'flex',
          gap: 10,
          width: '98%',
        }}
      >
        {sectionEntries.map((item) => (
          <View key={item.entryId}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                fontSize: PDF_BODY_FONT_SIZE,
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  width:
                    sectionEntries.length === 1 &&
                    sectionEntries.every(
                      (item) => !item.startDate && !item.endDate,
                    )
                      ? '0%'
                      : '33%',
                }}
              >
                {item.startDate}
                {item.endDate ? ` - ${item.endDate}` : ''}
              </Text>
              <View
                style={{
                  width: '96%',
                }}
              >
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'medium',
                      fontSize: 10.9,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Html
                    style={{
                      fontSize: PDF_BODY_FONT_SIZE,
                      marginTop: 5,
                    }}
                    renderers={pdfHtmlRenderers}
                  >
                    {item.description || ''}
                  </Html>
                </View>
              </View>
              <Text
                style={{
                  fontSize: PDF_BODY_FONT_SIZE,
                }}
              >
                {item.city}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default LondonCustomSection;
