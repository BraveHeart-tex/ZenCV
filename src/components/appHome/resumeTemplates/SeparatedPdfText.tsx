import { ValueOf } from '@/lib/types/utils.types';
import { Styles, Text } from '@react-pdf/renderer';
import React from 'react';

interface SeparatedPDFTextProps {
  style: ValueOf<Styles>;
  fields: string[];
  separator?: string;
}

const SeparatedPDFText = ({
  style,
  fields,
  separator = ', ',
}: SeparatedPDFTextProps) => {
  const nonEmptyFields = fields.filter((field) => field.trim() !== '');

  return (
    <Text style={style}>
      {nonEmptyFields.map((field, index) => (
        <React.Fragment key={field}>
          {field}
          {index < nonEmptyFields.length - 1 && separator}
        </React.Fragment>
      ))}
    </Text>
  );
};

export default SeparatedPDFText;
