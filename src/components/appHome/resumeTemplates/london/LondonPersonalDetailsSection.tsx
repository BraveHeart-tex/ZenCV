import { Link, Text, View } from '@react-pdf/renderer';
import { Fragment } from 'react';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { londonTemplateStyles } from './london.styles';

export const LondonPersonalDetailsSection = ({
  personalDetails,
}: {
  personalDetails: PdfTemplateData['personalDetails'];
}) => {
  const { firstName, lastName, jobTitle, address, city, phone, email, links } =
    personalDetails;
  const contactDetails: { id: string; label: string; link?: string }[] = [
    ...[
      { id: 'email', label: email },
      { id: 'phone', label: phone },
      { id: 'address', label: address },
      { id: 'city', label: city },
    ].filter((detail) => detail.label),
    ...links.map((link) => ({
      id: link.entryId,
      label: link.label,
      link: link.link,
    })),
  ];

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

      <Text
        style={{
          ...londonTemplateStyles.documentDescription,
          textAlign: 'center',
        }}
      >
        {contactDetails.map((detail, index) => (
          <Fragment key={detail.id}>
            {detail.link ? (
              <Link
                src={detail.link}
                style={{ color: 'black', textDecoration: 'underline' }}
              >
                {detail.label}
              </Link>
            ) : (
              detail.label
            )}
            {index < contactDetails.length - 1 ? ' • ' : null}
          </Fragment>
        ))}
      </Text>
    </View>
  );
};
