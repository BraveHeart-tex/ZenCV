import { Document, Page, Text, View } from '@react-pdf/renderer';
import CommaSeperatedPdfText from '@/components/appHome/resumeTemplates/london/CommaSeperatedPdfText';
import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import TwoColumnLayout from '@/components/appHome/resumeTemplates/london/TwoColumnLayout';
import { observer } from 'mobx-react-lite';
import { PdfTemplateData } from '@/lib/types';
import Html from 'react-pdf-html';
import {
  PDF_BODY_FONT_SIZE,
  pdfHtmlRenderers,
} from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { removeHTMLTags } from '@/lib/utils/stringUtils';

const LondonTemplate = observer(
  ({ templateData }: { templateData: PdfTemplateData }) => {
    const { personalDetails, summarySection } = templateData;
    const {
      firstName,
      lastName,
      jobTitle,
      address,
      city,
      postalCode,
      placeOfBirth,
      phone,
      email,
      dateOfBirth,
      driversLicense,
    } = personalDetails;
    const { summary } = summarySection;

    return (
      <Document>
        <Page size="A4" style={londonTemplateStyles.page}>
          <Text style={londonTemplateStyles.documentTitle}>
            {firstName} {lastName}
            {jobTitle
              ? `${firstName || lastName ? ',' : ''} ${jobTitle}`
              : null}
          </Text>
          <CommaSeperatedPdfText
            style={londonTemplateStyles.documentDescription}
            fields={[address, city, postalCode, placeOfBirth, phone, email]}
          />
          <TwoColumnLayout
            items={[
              {
                label: 'Date of birth',
                value: dateOfBirth,
              },
              {
                label: 'Driving License',
                value: driversLicense,
              },
              {
                label: 'Place of birth',
                value: placeOfBirth,
              },
            ]}
          />
          {removeHTMLTags(summary)?.length ? (
            <View style={londonTemplateStyles.section}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Text
                  style={{
                    ...londonTemplateStyles.sectionLabel,
                    height: '100%',
                  }}
                >
                  {summarySection?.sectionName}
                </Text>
                <View
                  style={{
                    width: '75%',
                  }}
                >
                  <Html
                    style={{
                      fontSize: PDF_BODY_FONT_SIZE,
                    }}
                    renderers={pdfHtmlRenderers}
                  >
                    {summary}
                  </Html>
                </View>
              </View>
            </View>
          ) : null}
        </Page>
      </Document>
    );
  },
);

export default LondonTemplate;
