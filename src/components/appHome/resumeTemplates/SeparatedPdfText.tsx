import { type Styles, Text } from '@react-pdf/renderer';
import React from 'react';
import type { ValueOf } from '@/lib/types/utils.types';

interface SeparatedPDFTextProps {
  style: ValueOf<Styles>;
  fields: string[];
  separator?: string;
}

export const SeparatedPDFText = ({
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
