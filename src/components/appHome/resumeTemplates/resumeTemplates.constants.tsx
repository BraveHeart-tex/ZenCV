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
  tags: string[];
  value: ResumeTemplate;
};

export const templateOptionsWithImages: TemplateOptionWithVariants[] = [
  {
    name: 'London',
    images: {
      card: '/templates/london-400.webp',
      hover: '/templates/london-700.webp',
      modal: '/templates/london-1000.webp',
    },
    description:
      'The London template offers a clean and modern design, perfect for showcasing your professional experience in a structured and elegant format. Its minimalist layout ensures ATS compatibility while maintaining a polished and professional appearance.',
    tags: ['Clean & Modern', 'ATS-Optimized', 'Professional'],
    value: INTERNAL_TEMPLATE_TYPES.LONDON,
  },
  {
    name: 'Manhattan',
    images: {
      card: '/templates/manhattan-400.webp',
      hover: '/templates/manhattan-700.webp',
      modal: '/templates/manhattan-1000.webp',
    },
    description:
      'The Manhattan template combines a sleek, contemporary design with a focus on clarity and readability. Its ATS-friendly structure ensures your resume passes through automated systems effortlessly, while its professional layout highlights your skills and achievements effectively.',
    tags: ['Clean & Modern', 'ATS-Optimized', 'Professional'],
    value: INTERNAL_TEMPLATE_TYPES.MANHATTAN,
  },
  {
    name: 'Tokyo',
    images: {
      card: '/templates/tokyo-400.webp',
      hover: '/templates/tokyo-700.webp',
      modal: '/templates/tokyo-1000.webp',
    },
    description:
      'The Tokyo template features a bold two-column layout with a dark sidebar and clean white main column. Designed for modern professionals who want to stand out while remaining ATS-friendly and easy to scan.',
    tags: ['Two-Column', 'Modern', 'ATS-Optimized'],
    value: INTERNAL_TEMPLATE_TYPES.TOKYO,
  },
  {
    name: 'Dubai',
    images: {
      card: '/templates/dubai-400.webp',
      hover: '/templates/dubai-700.webp',
      modal: '/templates/dubai-1000.webp',
    },
    description:
      'The Dubai template features a warm two-column layout with a light sidebar and gold accent detailing. Refined and professional, it suits finance, consulting, and corporate roles where elegance matters.',
    tags: ['Two-Column', 'Elegant', 'Professional'],
    value: INTERNAL_TEMPLATE_TYPES.DUBAI,
  },
  {
    name: 'Sydney',
    images: {
      card: '/templates/sydney-400.webp',
      hover: '/templates/sydney-700.webp',
      modal: '/templates/sydney-1000.webp',
    },
    description:
      'The Sydney template is a purely minimal, whitespace-driven design built for senior and executive profiles. A bold name treatment anchors the page while generous spacing lets your experience speak for itself.',
    tags: ['Minimal', 'Executive', 'Whitespace'],
    value: INTERNAL_TEMPLATE_TYPES.SYDNEY,
  },
];

export const selectedOptionImageClassNames = 'ring-2 ring-blue-500' as const;
