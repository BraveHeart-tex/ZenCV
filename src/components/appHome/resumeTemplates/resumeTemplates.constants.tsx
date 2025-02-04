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
