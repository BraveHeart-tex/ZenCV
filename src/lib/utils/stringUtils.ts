import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DEX_Item, DEX_Section } from '../client-db/clientDbSchema';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeHTMLTags = (htmlString: string) => {
  return htmlString.replace(/<[^>]*>/g, '');
};

export const getSectionContainerId = (sectionId: DEX_Section['id']): string => {
  return `section-${sectionId.toString()}`;
};

export const getItemContainerId = (itemId: DEX_Item['id']): string => {
  return `item-${itemId.toString()}`;
};
