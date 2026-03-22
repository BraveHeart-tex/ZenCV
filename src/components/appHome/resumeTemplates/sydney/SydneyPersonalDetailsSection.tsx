import { Text, View } from '@react-pdf/renderer';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import type { SydneyStyles } from './sydney.types';

export const SydneyPersonalDetailsSection = ({
  personalDetails,
  styles,
}: {
  personalDetails: PdfTemplateData['personalDetails'];
  styles: SydneyStyles;
}) => {
  const { firstName, lastName, jobTitle, address, city, phone, email } =
    personalDetails;

  const contactDetails = [
    email,
    phone,
    [address, city].filter(Boolean).join(', '),
  ].filter(Boolean);

  return (
    <View style={styles.header}>
      <Text style={styles.name}>
        {firstName} {lastName}
      </Text>
      {jobTitle ? <Text style={styles.jobTitle}>{jobTitle}</Text> : null}
      {contactDetails.length > 0 && (
        <View style={styles.contactRow}>
          {contactDetails.map((detail, index) => (
            <View
              key={detail}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              {index > 0 && <Text style={styles.contactSeparator}>·</Text>}
              <Text style={styles.contactItem}>{detail}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
