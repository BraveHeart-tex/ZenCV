import { Text, View } from '@react-pdf/renderer';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { dubaiTemplateStyles } from './dubai.styles';

export const DubaiPersonalDetailsSection = ({
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
    <View>
      <Text style={dubaiTemplateStyles.sidebarName}>
        {firstName} {lastName}
      </Text>
      {jobTitle ? (
        <Text style={dubaiTemplateStyles.sidebarJobTitle}>
          {jobTitle.toUpperCase()}
        </Text>
      ) : null}
      {contactDetails.length > 0 && (
        <View style={dubaiTemplateStyles.sidebarSection}>
          <Text style={dubaiTemplateStyles.sidebarSectionLabel}>Contact</Text>
          {contactDetails.map((detail) => (
            <Text key={detail} style={dubaiTemplateStyles.sidebarText}>
              {detail}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};
