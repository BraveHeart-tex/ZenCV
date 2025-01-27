import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeHTMLTags = (htmlString: string) => {
  return htmlString.replace(/<[^>]*>/g, '');
};
