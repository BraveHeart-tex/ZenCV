import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import { PDF_BODY_FONT_SIZE } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { TemplateDataSection } from '@/lib/types/documentBuilder.types';

const LondonHobbiesSection = ({
  section,
}: {
  section: TemplateDataSection;
}) => {
  const hobbies = section.items
    .map((item) => item.fields.map((field) => field.value))
    .join('');

  if (!hobbies) return;

  return (
    <View
      style={{
        ...londonTemplateStyles.section,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text
        style={{
          ...londonTemplateStyles.sectionLabel,
          height: '100%',
          width: '25%',
        }}
      >
        {section?.title}
      </Text>
      <Text
        style={{
          width: '75%',
          fontSize: PDF_BODY_FONT_SIZE,
        }}
      >
        {hobbies}
      </Text>
    </View>
  );
};
export default LondonHobbiesSection;
