import { Font, StyleSheet } from '@react-pdf/renderer';

Font.register({
  family: 'EB Garamond',
  fonts: [
    {
      src: `/fonts/EBGaramond/EBGaramond-Regular.ttf`,
      fontWeight: 400,
    },
    {
      src: `/fonts/EBGaramond/EBGaramond-Medium.ttf`,
      fontWeight: 500,
    },
    {
      src: `/fonts/EBGaramond/EBGaramond-Bold.ttf`,
      fontWeight: 600,
    },
    {
      src: `/fonts/EBGaramond/EBGaramond-Italic.ttf`,
      fontWeight: 400,
      fontStyle: 'italic',
    },
    {
      src: `/fonts/EBGaramond/EBGaramond-MediumItalic.ttf`,
      fontWeight: 500,
      fontStyle: 'italic',
    },
    {
      src: `/fonts/EBGaramond/EBGaramond-BoldItalic.ttf`,
      fontWeight: 600,
      fontStyle: 'italic',
    },
  ],
});

export const manhattanTemplateStyles = StyleSheet.create({
  page: {
    paddingVertical: 25,
    paddingHorizontal: 35,
    fontFamily: 'EB Garamond',
  },
  section: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
    width: '100%',
    borderBottom: '1px solid black',
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 13,
    marginBottom: 15,
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
  },
  bullet: {
    width: 3,
    height: 3,
    borderRadius: '50%',
    marginRight: 6,
    marginTop: 4,
  },
});

export const MANHATTAN_FONT_SIZE = 11.7 as const;
