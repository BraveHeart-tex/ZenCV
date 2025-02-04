import { londonTemplateStyles } from './london.styles';
import { Text, View } from '@react-pdf/renderer';
import { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import SeparatedPDFText from '../SeparatedPdfText';

const LondonPersonalDetailsSection = ({
  personalDetails,
}: {
  personalDetails: PdfTemplateData['personalDetails'];
}) => {
  const { firstName, lastName, jobTitle, address, city, phone, email } =
    personalDetails;
  const contactDetails = [email, phone, address, city].filter(Boolean);

  return (
    <View
      style={{
        ...londonTemplateStyles.section,
        marginBottom: 0,
      }}
    >
      <Text
        style={{
          ...londonTemplateStyles.documentTitle,
          marginBottom: 0,
          textAlign: 'center',
        }}
      >
        {firstName} {lastName} {jobTitle}
      </Text>

      <SeparatedPDFText
        separator=" • "
        fields={contactDetails}
        style={{
          ...londonTemplateStyles.documentDescription,
          textAlign: 'center',
        }}
      />
    </View>
  );
};

export default LondonPersonalDetailsSection;
