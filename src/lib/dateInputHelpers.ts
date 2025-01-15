import { MONTHS } from '@/lib/constants';

export const getMonthFromFieldValue = (fieldValue: string) => {
  return fieldValue.split(' ')[0];
};

export const getYearFromFieldValue = (fieldValue: string) => {
  return Number.parseInt(fieldValue.split(' ')[1] as string);
};

export const CURRENT_MONTH = MONTHS[new Date().getMonth()] ?? '';
export const CURRENT_YEAR = new Date().getFullYear();

export const mmYYYYRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
export const yyyyRegex = /^\d{4}$/;
