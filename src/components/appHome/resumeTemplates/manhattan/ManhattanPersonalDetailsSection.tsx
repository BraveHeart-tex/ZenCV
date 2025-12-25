import { Text, View } from '@react-pdf/renderer';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { SeparatedPDFText } from '../SeparatedPdfText';
import { manhattanTemplateStyles } from './manhattan.styles';

export const ManhattanPersonalDetailsSection = ({
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
        ...manhattanTemplateStyles.section,
        marginBottom: 0,
      }}
    >
      <Text
        style={{
          ...manhattanTemplateStyles.documentTitle,
          marginBottom: 0,
        }}
      >
        {firstName} {lastName}
      </Text>

      {jobTitle && (
        <Text
          style={{
            ...manhattanTemplateStyles.documentDescription,
            fontSize: 14,
            marginBottom: 0,
          }}
        >
          {jobTitle}
        </Text>
      )}
      <SeparatedPDFText
        separator=' | '
        fields={contactDetails}
        style={{
          ...manhattanTemplateStyles.documentDescription,
          marginBottom: 10,
        }}
      />
    </View>
  );
};
