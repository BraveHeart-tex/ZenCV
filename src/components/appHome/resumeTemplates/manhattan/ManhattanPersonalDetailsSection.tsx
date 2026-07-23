import { Link, Text, View } from '@react-pdf/renderer';
import { Fragment } from 'react';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { manhattanTemplateStyles } from './manhattan.styles';

export const ManhattanPersonalDetailsSection = ({
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
      <Text
        style={{
          ...manhattanTemplateStyles.documentDescription,
          marginBottom: 10,
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
            {index < contactDetails.length - 1 ? ' | ' : null}
          </Fragment>
        ))}
      </Text>
    </View>
  );
};
