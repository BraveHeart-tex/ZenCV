import { Text, View } from '@react-pdf/renderer';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { sydneyTemplateStyles } from './sydney.styles';

export const SydneyPersonalDetailsSection = ({
  personalDetails,
}: {
  personalDetails: PdfTemplateData['personalDetails'];
}) => {
  const { firstName, lastName, jobTitle, address, city, phone, email } =
    personalDetails;

  const contactDetails = [
    email,
    phone,
    [address, city].filter(Boolean).join(', '),
  ].filter(Boolean);

  return (
    <View style={sydneyTemplateStyles.header}>
      <Text style={sydneyTemplateStyles.name}>
        {firstName} {lastName}
      </Text>
      {jobTitle ? (
        <Text style={sydneyTemplateStyles.jobTitle}>{jobTitle}</Text>
      ) : null}
      {contactDetails.length > 0 && (
        <View style={sydneyTemplateStyles.contactRow}>
          {contactDetails.map((detail, index) => (
            <View
              key={detail}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              {index > 0 && (
                <Text style={sydneyTemplateStyles.contactSeparator}>·</Text>
              )}
              <Text style={sydneyTemplateStyles.contactItem}>{detail}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
