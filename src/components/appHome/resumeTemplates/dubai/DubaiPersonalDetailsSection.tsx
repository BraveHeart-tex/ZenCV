import { Text, View } from '@react-pdf/renderer';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import type { DubaiStyles } from './dubai.types';

export const DubaiPersonalDetailsSection = ({
  personalDetails,
  styles,
}: {
  personalDetails: PdfTemplateData['personalDetails'];
  styles: DubaiStyles;
}) => {
  const { firstName, lastName, jobTitle, address, city, phone, email } =
    personalDetails;

  const contactDetails = [
    email,
    phone,
    [address, city].filter(Boolean).join(', '),
  ].filter(Boolean);

  return (
    <View>
      <Text style={styles.sidebarName}>
        {firstName} {lastName}
      </Text>
      {jobTitle ? (
        <Text style={styles.sidebarJobTitle}>{jobTitle.toUpperCase()}</Text>
      ) : null}
      {contactDetails.length > 0 && (
        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarSectionLabel}>Contact</Text>
          {contactDetails.map((detail) => (
            <Text key={detail} style={styles.sidebarText}>
              {detail}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};
