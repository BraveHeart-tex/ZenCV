import { INTERNAL_TEMPLATE_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { ResumeTemplate } from '@/lib/types/documentBuilder.types';

export type TemplateImages = {
  card: string; // ~400px
  hover: string; // ~700px
  modal: string; // ~1000px
};

export type TemplateOptionWithVariants = {
  name: string;
  images: TemplateImages;
  description: string;
  layoutDescription: string;
  tags: string[];
  value: ResumeTemplate;
};

export const templateOptionsWithImages: TemplateOptionWithVariants[] = [
  {
    name: "Jake's Template",
    layoutDescription: 'Single column · compact ruled sections',
    images: {
      card: '/templates/jake-400.webp',
      hover: '/templates/jake-700.webp',
      modal: '/templates/jake-1000.webp',
    },
    description:
      'A compact black-and-white layout with a centered header, serif typography, and fine rules beneath section headings.',
    tags: ['Single column', 'Serif type', 'Compact sections'],
    value: INTERNAL_TEMPLATE_TYPES.JAKE,
  },
  {
    name: 'London',
    layoutDescription: 'Single column · section rules',
    images: {
      card: '/templates/london-400.webp',
      hover: '/templates/london-700.webp',
      modal: '/templates/london-1000.webp',
    },
    description:
      'A single-column layout with serif typography and horizontal rules separating sections.',
    tags: ['Single column', 'Serif type', 'Section rules'],
    value: INTERNAL_TEMPLATE_TYPES.LONDON,
  },
  {
    name: 'Manhattan',
    layoutDescription: 'Single column · softer typography',
    images: {
      card: '/templates/manhattan-400.webp',
      hover: '/templates/manhattan-700.webp',
      modal: '/templates/manhattan-1000.webp',
    },
    description:
      'A single-column layout with softer serif typography and compact, clearly grouped sections.',
    tags: ['Single column', 'Serif type', 'Compact sections'],
    value: INTERNAL_TEMPLATE_TYPES.MANHATTAN,
  },
  {
    name: 'Tokyo',
    layoutDescription: 'Two columns · dark sidebar',
    images: {
      card: '/templates/tokyo-400.webp',
      hover: '/templates/tokyo-700.webp',
      modal: '/templates/tokyo-1000.webp',
    },
    description:
      'A two-column layout with a dark sidebar for supporting details and a white main column.',
    tags: ['Two columns', 'Dark sidebar', 'Color accents'],
    value: INTERNAL_TEMPLATE_TYPES.TOKYO,
  },
  {
    name: 'Dubai',
    layoutDescription: 'Two columns · light sidebar',
    images: {
      card: '/templates/dubai-400.webp',
      hover: '/templates/dubai-700.webp',
      modal: '/templates/dubai-1000.webp',
    },
    description:
      'A two-column layout with a light sidebar and accent details separating supporting information.',
    tags: ['Two columns', 'Light sidebar', 'Color accents'],
    value: INTERNAL_TEMPLATE_TYPES.DUBAI,
  },
  {
    name: 'Sydney',
    layoutDescription: 'Single column · generous spacing',
    images: {
      card: '/templates/sydney-400.webp',
      hover: '/templates/sydney-700.webp',
      modal: '/templates/sydney-1000.webp',
    },
    description:
      'A spacious single-column layout with a prominent name and generous space between sections.',
    tags: ['Single column', 'Large name', 'Generous spacing'],
    value: INTERNAL_TEMPLATE_TYPES.SYDNEY,
  },
];

export const selectedOptionImageClassNames = 'ring-2 ring-blue-500' as const;
