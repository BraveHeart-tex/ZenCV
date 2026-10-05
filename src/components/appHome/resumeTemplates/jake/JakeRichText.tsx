import { Text, View } from '@react-pdf/renderer';
import { Html } from 'react-pdf-html';
import { pdfHtmlRenderers } from '../resumeTemplates.pdf';
import { JAKE_FONT_SIZE } from './jake.styles';

export const JakeRichText = ({ html }: { html: string }) => (
  <Html
    style={{ fontSize: JAKE_FONT_SIZE }}
    stylesheet={{
      p: { marginTop: 0, marginBottom: 2 },
      ul: { marginTop: 1, marginBottom: 2, paddingLeft: 12 },
      ol: { marginTop: 1, marginBottom: 2, paddingLeft: 12 },
      li: { marginBottom: 1 },
    }}
    renderers={{
      ...pdfHtmlRenderers,
      p: (props) => <Text {...props} orphans={2} widows={2} />,
      ul: (props) => <View {...props} />,
      ol: (props) => <View {...props} />,
    }}
  >
    {html}
  </Html>
);
