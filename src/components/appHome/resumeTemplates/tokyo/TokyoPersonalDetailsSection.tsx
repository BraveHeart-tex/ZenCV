import { Text, View } from '@react-pdf/renderer';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import type { createTokyoStyles } from './tokyo.styles';

export const TokyoPersonalDetailsSection = ({
  personalDetails,
  styles,
}: {
  personalDetails: PdfTemplateData['personalDetails'];
  styles: ReturnType<typeof createTokyoStyles>;
}) => {
  const { firstName, lastName, jobTitle, address, city, phone, email } =
    personalDetails;

  const contactDetails = [
    { label: email },
    { label: phone },
    { label: [address, city].filter(Boolean).join(', ') },
  ].filter((c) => c.label);

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
          {contactDetails.map((c) => (
            <Text key={c.label} style={styles.sidebarText}>
              {c.label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};
