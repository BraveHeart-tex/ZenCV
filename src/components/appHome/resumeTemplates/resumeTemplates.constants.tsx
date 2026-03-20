import { Link, Text, View } from '@react-pdf/renderer';
import type { ComponentProps } from 'react';
import type Html from 'react-pdf-html';
import { INTERNAL_TEMPLATE_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { TemplateOption } from '@/lib/types/documentBuilder.types';

export const pdfHtmlRenderers: ComponentProps<typeof Html>['renderers'] = {
  i: (props) => {
    return (
      <Text {...props} style={{ ...props.style, fontStyle: 'italic' }}>
        {props.children}
      </Text>
    );
  },
  em: (props) => {
    return (
      <Text {...props} style={{ ...props.style, fontStyle: 'italic' }}>
        {props.children}
      </Text>
    );
  },
  ol: (props) => (
    <View
      {...props}
      style={{
        ...props.style,
        marginTop: 5,
        marginLeft: 0,
      }}
    >
      {props.children}
    </View>
  ),
  ul: (props) => (
    <View
      {...props}
      style={{
        ...props.style,
        marginTop: 2,
        paddingLeft: 0,
        marginLeft: 0,
      }}
    >
      {props.children}
    </View>
  ),
  a: (props) => (
    <Link
      {...props}
      style={{
        ...props.style,
        color: 'black',
      }}
    >
      {props.children}
    </Link>
  ),
  p: (props) => <Text {...props} style={{ ...props.style, marginTop: 0 }} />,
};

export const templateOptionsWithImages: TemplateOption[] = [
  {
    name: 'London',
    image: '/templates/london.webp',
    description:
      'The London template offers a clean and modern design, perfect for showcasing your professional experience in a structured and elegant format. Its minimalist layout ensures ATS compatibility while maintaining a polished and professional appearance.',
    tags: ['Clean & Modern', 'ATS-Optimized', 'Professional'],
    value: INTERNAL_TEMPLATE_TYPES.LONDON,
  },
  {
    name: 'Manhattan',
    image: '/templates/manhattan.webp',
    description:
      'The Manhattan template combines a sleek, contemporary design with a focus on clarity and readability. Its ATS-friendly structure ensures your resume passes through automated systems effortlessly, while its professional layout highlights your skills and achievements effectively.',
    tags: ['Clean & Modern', 'ATS-Optimized', 'Professional'],
    value: INTERNAL_TEMPLATE_TYPES.MANHATTAN,
  },
  {
    name: 'Tokyo',
    image: '/templates/tokyo.webp',
    description:
      'The Tokyo template features a bold two-column layout with a dark sidebar and clean white main column. Designed for modern professionals who want to stand out while remaining ATS-friendly and easy to scan.',
    tags: ['Two-Column', 'Modern', 'ATS-Optimized'],
    value: INTERNAL_TEMPLATE_TYPES.TOKYO,
  },
  {
    name: 'Dubai',
    image: '/templates/dubai.webp',
    description:
      'The Dubai template features a warm two-column layout with a light sidebar and gold accent detailing. Refined and professional, it suits finance, consulting, and corporate roles where elegance matters.',
    tags: ['Two-Column', 'Elegant', 'Professional'],
    value: INTERNAL_TEMPLATE_TYPES.DUBAI,
  },
  {
    name: 'Sydney',
    image: '/templates/sydney.webp',
    description:
      'The Sydney template is a purely minimal, whitespace-driven design built for senior and executive profiles. A bold name treatment anchors the page while generous spacing lets your experience speak for itself.',
    tags: ['Minimal', 'Executive', 'Whitespace'],
    value: INTERNAL_TEMPLATE_TYPES.SYDNEY,
  },
];

export const selectedOptionImageClassNames = 'ring-2 ring-blue-500' as const;
