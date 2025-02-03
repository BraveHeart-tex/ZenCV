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
    padding: 40,
    fontFamily: 'EB Garamond',
  },
  section: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 11,
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
