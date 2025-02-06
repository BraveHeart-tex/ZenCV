import { INTERNAL_TEMPLATE_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { TemplateOption } from '@/lib/types/documentBuilder.types';
import { Link, Text, View } from '@react-pdf/renderer';
import { ComponentProps } from 'react';
import Html from 'react-pdf-html';

export const PDF_BODY_FONT_SIZE = 11 as const;
export const DOCUMENT_TITLE_FONT_SIZE = 14 as const;
export const SECTION_LABEL_FONT_SIZE = 9 as const;

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
    image: '/templates/london.jpg',
    description:
      'The London template offers a clean and modern design, perfect for showcasing your professional experience in a structured and elegant format. Its minimalist layout ensures ATS compatibility while maintaining a polished and professional appearance.',
    tags: ['Clean & Modern', 'ATS-Optimized', 'Professional'],
    value: INTERNAL_TEMPLATE_TYPES.LONDON,
  },
  {
    name: 'Manhattan',
    image: '/templates/manhattan.jpg',
    description:
      'The Manhattan template combines a sleek, contemporary design with a focus on clarity and readability. Its ATS-friendly structure ensures your resume passes through automated systems effortlessly, while its professional layout highlights your skills and achievements effectively.',
    tags: ['Clean & Modern', 'ATS-Optimized', 'Professional'],
    value: INTERNAL_TEMPLATE_TYPES.MANHATTAN,
  },
];

export const selectedOptionImageClassNames = 'ring-2 ring-blue-500' as const;
