import { Text, View } from '@react-pdf/renderer';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { tokyoTemplateStyles } from './tokyo.styles';

export const TokyoPersonalDetailsSection = ({
  personalDetails,
}: {
  personalDetails: PdfTemplateData['personalDetails'];
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
      <Text style={tokyoTemplateStyles.sidebarName}>
        {firstName} {lastName}
      </Text>
      {jobTitle ? (
        <Text style={tokyoTemplateStyles.sidebarJobTitle}>
          {jobTitle.toUpperCase()}
        </Text>
      ) : null}

      {contactDetails.length > 0 && (
        <View style={tokyoTemplateStyles.sidebarSection}>
          <Text style={tokyoTemplateStyles.sidebarSectionLabel}>Contact</Text>
          {contactDetails.map((c) => (
            <Text key={c.label} style={tokyoTemplateStyles.sidebarText}>
              {c.label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};
