import { manhattanTemplateStyles } from './manhattan.styles';
import { Text, View } from '@react-pdf/renderer';
import { PdfTemplateData } from '@/lib/types/documentBuilder.types';

const ManhattanPersonalDetailsSection = ({
  personalDetails,
}: {
  personalDetails: PdfTemplateData['personalDetails'];
}) => {
  const {
    firstName,
    lastName,
    jobTitle,
    address,
    city,
    postalCode,
    placeOfBirth,
    phone,
    email,
    dateOfBirth,
    driversLicense,
  } = personalDetails;

  const contactDetails = [email, phone, address, city, postalCode].filter(
    Boolean,
  );

  const personalInfo = [
    dateOfBirth && { label: 'Date of Birth', value: dateOfBirth },
    placeOfBirth && { label: 'Place of Birth', value: placeOfBirth },
    driversLicense && { label: 'Driving License', value: driversLicense },
  ].filter(Boolean);

  return (
    <View style={manhattanTemplateStyles.section}>
      <Text style={manhattanTemplateStyles.documentTitle}>
        {firstName} {lastName}
      </Text>
      {jobTitle && (
        <Text
          style={{
            ...manhattanTemplateStyles.documentDescription,
            fontSize: 14,
            marginBottom: 8,
          }}
        >
          {jobTitle}
        </Text>
      )}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 15,
        }}
      >
        {contactDetails.map((detail, index) => (
          <Text
            key={detail}
            style={{
              ...manhattanTemplateStyles.documentDescription,
              marginBottom: 0,
            }}
          >
            {detail}
            {index < contactDetails.length - 1 ? ' • ' : ''}
          </Text>
        ))}
      </View>
      {personalInfo.length > 0 && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          {personalInfo.map(
            (info) =>
              info && (
                <View
                  key={info.label}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 5,
                  }}
                >
                  <Text
                    style={{
                      ...manhattanTemplateStyles.documentDescription,
                      marginBottom: 0,
                      fontWeight: 'bold',
                    }}
                  >
                    {info.label}:
                  </Text>
                  <Text
                    style={{
                      ...manhattanTemplateStyles.documentDescription,
                      marginBottom: 0,
                    }}
                  >
                    {info.value}
                  </Text>
                </View>
              ),
          )}
        </View>
      )}
    </View>
  );
};

export default ManhattanPersonalDetailsSection;
