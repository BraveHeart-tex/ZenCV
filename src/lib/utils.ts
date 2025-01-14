import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const builderSectionTitleClassNames =
  'scroll-m-20 text-2xl font-semibold tracking-tight';
