import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import CommaSeperatedPdfText from '@/components/appHome/resumeTemplates/london/CommaSeperatedPdfText';
import TwoColumnLayout from '@/components/appHome/resumeTemplates/london/TwoColumnLayout';
import { Text } from '@react-pdf/renderer';

import { PdfTemplateData } from '@/lib/types/documentBuilder.types';

const LondonPersonalDetailsSection = ({
  personalDetails,
}: {
  personalDetails: PdfTemplateData['personalDetails'];
}) => {
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
    <>
      <Text style={londonTemplateStyles.documentTitle}>
        {firstName} {lastName}
        {jobTitle ? `${firstName || lastName ? ',' : ''} ${jobTitle}` : null}
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
    </>
  );
};

export default LondonPersonalDetailsSection;
