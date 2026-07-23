import { Link, Text, View } from '@react-pdf/renderer';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import type { createTokyoStyles } from './tokyo.styles';

export const TokyoPersonalDetailsSection = ({
  personalDetails,
  styles,
}: {
  personalDetails: PdfTemplateData['personalDetails'];
  styles: ReturnType<typeof createTokyoStyles>;
}) => {
  const { firstName, lastName, jobTitle, address, city, phone, email, links } =
    personalDetails;

  const contactDetails = [
    { id: 'email', label: email },
    { id: 'phone', label: phone },
    {
      id: 'address',
      label: [address, city].filter(Boolean).join(', '),
    },
    ...links.map((link) => ({
      id: link.entryId,
      label: link.label,
      link: link.link,
    })),
  ].filter((contact) => contact.label);

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
          {contactDetails.map((contact) =>
            'link' in contact ? (
              <Link key={contact.id} src={contact.link} style={styles.link}>
                {contact.label}
              </Link>
            ) : (
              <Text key={contact.id} style={styles.sidebarText}>
                {contact.label}
              </Text>
            )
          )}
        </View>
      )}
    </View>
  );
};
