import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DEX_Item, DEX_Section } from '../client-db/clientDbSchema';
import { TableOfContentItem } from '../types/misc.types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeHTMLTags = (htmlString: string) => {
  return htmlString.replace(/<[^>]*>/g, '');
};

const SECTION_ID_PREFIX = 'section-' as const;
const ITEM_ID_PREFIX = 'item-' as const;

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

/**
 * Generates a table of contents data structure from a Markdown string.
 *
 * @param markdown The Markdown string to parse.
 * @returns An array of `TableOfContentItem` objects representing the table of contents.
 */
export const generateTableOfContents = (
  markdown: string,
): TableOfContentItem[] => {
  const lines = markdown.split('\n');
  const toc: TableOfContentItem[] = [];
  const stack: TableOfContentItem[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    const match = trimmedLine.match(/^(#+)\s+(.*)$/);

    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = generateIdForMarkdownString(text); // Generate a unique ID based on the text

      const item: TableOfContentItem = {
        text,
        id,
        level,
      };

      // Handle nesting based on heading level
      while (stack.length > 0 && level <= stack[stack.length - 1].level) {
        stack.pop();
      }

      if (stack.length > 0) {
        // Add as a child of the current top item in the stack
        const parent = stack[stack.length - 1];
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
      } else {
        // Add to the root of the table of contents
        toc.push(item);
      }

      stack.push(item);
    }
  }

  return toc;
};

function generateIdForMarkdownString(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
}

/**
 * Estimates the reading time for a markdown string.
 * @param markdownString The markdown string to analyze.
 * @returns The estimated reading time in minutes (rounded up to the nearest minute).
 */
export const estimateReadingTime = (markdownString: string): number => {
  const wordsPerMinute = 200; // the average person can read up to 238 words per minute

  // Remove Markdown formatting and HTML tags to get the raw text.
  const plainText = markdownString
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/!\[.*?\]\((.*?)\)/g, '') // Remove images (alt text and link)
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Remove links (keep link text)
    .replace(/[#*_~`>-]+/g, '') // Remove markdown symbols (headings, lists, etc.)
    .replace(/\n+/g, ' ') // Replace multiple newlines with a single space.
    .replace(/\s+/g, ' ') // Remove extra spaces.
    .trim();

  const wordCount = plainText.split(' ').filter((word) => word !== '').length;

  const readingTimeInMinutes = wordCount / wordsPerMinute;

  return Math.ceil(readingTimeInMinutes);
};
