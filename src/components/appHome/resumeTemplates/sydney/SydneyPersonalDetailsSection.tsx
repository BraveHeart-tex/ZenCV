import { Link, Text, View } from '@react-pdf/renderer';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import type { SydneyStyles } from './sydney.types';

export const SydneyPersonalDetailsSection = ({
  personalDetails,
  styles,
}: {
  personalDetails: PdfTemplateData['personalDetails'];
  styles: SydneyStyles;
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
    <View style={styles.header}>
      <Text style={styles.name}>
        {firstName} {lastName}
      </Text>
      {jobTitle ? <Text style={styles.jobTitle}>{jobTitle}</Text> : null}
      {contactDetails.length > 0 && (
        <View style={styles.contactRow}>
          {contactDetails.map((detail, index) => (
            <View
              key={detail.id}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              {index > 0 && <Text style={styles.contactSeparator}>·</Text>}
              {'link' in detail ? (
                <Link src={detail.link} style={styles.contactItem}>
                  {detail.label}
                </Link>
              ) : (
                <Text style={styles.contactItem}>{detail.label}</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
