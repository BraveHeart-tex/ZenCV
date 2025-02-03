import { getWorkExperienceSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import { Text, View } from '@react-pdf/renderer';
import {
  PDF_BODY_FONT_SIZE,
  pdfHtmlRenderers,
} from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import Html from 'react-pdf-html';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';

const LondonWorkExperienceSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const sectionEntries = getWorkExperienceSectionEntries(section);

  if (!sectionEntries.length) return null;

  return (
    <View
      style={{
        ...londonTemplateStyles.section,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <Text
        style={{
          ...londonTemplateStyles.sectionLabel,
          width: '100%',
        }}
      >
        {section?.title}
      </Text>

      <View
        style={{
          display: 'flex',
          gap: 10,
        }}
      >
        {sectionEntries.map((entry) => (
          <View key={entry.entryId}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                fontSize: PDF_BODY_FONT_SIZE,
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  width: '30.5%',
                }}
              >
                {entry.startDate}
                {entry.endDate ? ` - ${entry.endDate}` : null}
              </Text>
              <View
                style={{
                  width: '82%',
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
                  {entry.jobTitle}
                  {entry.employer ? ` - ${entry.employer}` : null}
                </Text>
                <Html
                  style={{
                    fontSize: PDF_BODY_FONT_SIZE,
                    marginTop: 7,
                  }}
                  renderers={pdfHtmlRenderers}
                >
                  {entry.description || ''}
                </Html>
              </View>
              <Text
                style={{
                  width: '10%',
                  textAlign: 'right',
                }}
              >
                {entry.city}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default LondonWorkExperienceSection;
