import { Link, Text, View } from '@react-pdf/renderer';
import { Fragment } from 'react';
import type { PdfTemplateData } from '@/lib/types/documentBuilder.types';
import { jakeStyles } from './jake.styles';

export const JakePersonalDetailsSection = ({
  personalDetails,
}: {
  personalDetails: PdfTemplateData['personalDetails'];
}) => {
  const { firstName, lastName, jobTitle, address, city, phone, email, links } =
    personalDetails;
  const location = [address, city].filter(Boolean).join(', ');
  const contacts = [
    ...(phone ? [{ id: 'phone', label: phone, src: `tel:${phone}` }] : []),
    ...(email ? [{ id: 'email', label: email, src: `mailto:${email}` }] : []),
    ...links.map((link) => ({
      id: `link-${link.entryId}`,
      label: link.label,
      src: link.link,
    })),
  ];

  return (
    <View style={jakeStyles.header} wrap={false}>
      <Text style={jakeStyles.name}>
        {[firstName, lastName].filter(Boolean).join(' ')}
      </Text>
      {jobTitle && <Text style={jakeStyles.jobTitle}>{jobTitle}</Text>}
      {location && <Text style={jakeStyles.address}>{location}</Text>}
      {contacts.length > 0 && (
        <Text style={jakeStyles.contacts}>
          {contacts.map((contact, index) => (
            <Fragment key={contact.id}>
              {index > 0 && <Text>{'\u00a0\u00a0|\u00a0\u00a0'}</Text>}
              <Link
                src={contact.src}
                style={
                  contact.id === 'phone' ? jakeStyles.phone : jakeStyles.link
                }
              >
                {contact.label}
              </Link>
            </Fragment>
          ))}
        </Text>
      )}
    </View>
  );
};
