import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DEX_Item, DEX_Section } from '../client-db/clientDbSchema';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeHTMLTags = (htmlString: string) => {
  return htmlString.replace(/<[^>]*>/g, '');
};

export const SECTION_ID_PREFIX = 'section-' as const;
export const ITEM_ID_PREFIX = 'item-' as const;

export const getSectionContainerId = (
  sectionId: DEX_Section['id'],
): `${typeof SECTION_ID_PREFIX}${string}` => {
  return `${SECTION_ID_PREFIX}${sectionId.toString()}`;
};

export const getItemContainerId = (
  itemId: DEX_Item['id'],
): `${typeof ITEM_ID_PREFIX}${string}` => {
  return `${ITEM_ID_PREFIX}${itemId.toString()}`;
};
