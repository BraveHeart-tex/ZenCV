import { MONTHS } from '@/lib/constants';

export const getMonthFromFieldValue = (fieldValue: string) => {
  return fieldValue.split(' ')[0];
};

export const getYearFromFieldValue = (fieldValue: string) => {
  return Number.parseInt(fieldValue.split(' ')[1] as string);
};

export const CURRENT_MONTH = MONTHS[new Date().getMonth()] ?? '';
export const CURRENT_YEAR = new Date().getFullYear();

export const isValidDateFormat = (input: string): boolean => {
  // Regular expression for MM/YYYY
  const mmYyyyRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;

  // Regular expression for YYYY
  const yyyyRegex = /^\d{4}$/;

  // Regular expression for full month with a comma and year (e.g., January, YYYY)
  const fullMonthCommaYyyyRegex =
    /^(January|February|March|April|May|June|July|August|September|October|November|December),\s\d{4}$/;

  // Regular expression for full month without a comma (e.g., January YYYY)
  const fullMonthYyyyRegex =
    /^(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{4}$/;

  // Regular expression for abbreviated month with a comma and year (e.g., Jan, YYYY)
  const shortMonthCommaYyyyRegex =
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec),\s\d{4}$/;

  // Regular expression for abbreviated month without a comma (e.g., Jul YYYY)
  const shortMonthYyyyRegex =
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}$/;

  // Check if the input matches any of the formats
  return (
    mmYyyyRegex.test(input) ||
    yyyyRegex.test(input) ||
    fullMonthCommaYyyyRegex.test(input) ||
    fullMonthYyyyRegex.test(input) ||
    shortMonthCommaYyyyRegex.test(input) ||
    shortMonthYyyyRegex.test(input) ||
    input === 'Present'
  );
};
