import { Text } from '@react-pdf/renderer';
import React from 'react';

interface CommaSeparatedPDFTextProps {
  style: Record<string, unknown>;
  fields: string[];
}

const CommaSeparatedPDFText = ({
  style,
  fields,
}: CommaSeparatedPDFTextProps) => {
  const nonEmptyFields = fields.filter((field) => field.trim() !== '');

  return (
    <Text style={style}>
      {nonEmptyFields.map((field, index) => (
        <React.Fragment key={field}>
          {field}
          {index < nonEmptyFields.length - 1 && ', '}
        </React.Fragment>
      ))}
    </Text>
  );
};

export default CommaSeparatedPDFText;
