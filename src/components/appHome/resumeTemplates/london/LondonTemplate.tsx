import { Document, Page, Text } from '@react-pdf/renderer';
import CommaSeperatedPdfText from '@/components/appHome/resumeTemplates/london/CommaSeperatedPdfText';
import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import TwoColumnLayout from '@/components/appHome/resumeTemplates/london/TwoColumnLayout';
import { observer } from 'mobx-react-lite';
import { PdfTemplateData } from '@/lib/types';

const LondonTemplate = observer(
  ({ templateData }: { templateData: PdfTemplateData }) => {
    const { personalDetails } = templateData;
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
        </Page>
      </Document>
    );
  },
);

export default LondonTemplate;
