import { Text } from '@react-pdf/renderer';
import React from 'react';

interface SeparatedPDFTextProps {
  style: Record<string, unknown>;
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
