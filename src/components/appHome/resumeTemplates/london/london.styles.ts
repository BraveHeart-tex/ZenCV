import { Font, StyleSheet } from '@react-pdf/renderer';

export const LONDON_FONT_SIZE = 11.5;

Font.register({
  family: 'Times New Roman',
  fonts: [
    {
      src: `/fonts/TimesNewRoman/TimesNewRoman.ttf`,
      fontWeight: 400,
    },
    {
      src: `/fonts/TimesNewRoman/TimesNewRomanItalic.ttf`,
      fontWeight: 400,
      fontStyle: 'italic',
    },
    {
      src: `/fonts/TimesNewRoman/TimesNewRomanBold.ttf`,
      fontWeight: 600,
    },
    {
      src: `/fonts/TimesNewRoman/TimesNewRomanBoldItalic.ttf`,
      fontWeight: 600,
      fontStyle: 'italic',
    },
  ],
});

export const londonTemplateStyles = StyleSheet.create({
  page: {
    paddingVertical: 20,
    paddingHorizontal: 35,
    fontFamily: 'Times New Roman',
  },
  section: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
    textTransform: 'uppercase',
    width: '100%',
    borderTop: '1px solid black',
    paddingTop: 8,
  },
  documentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 13,
    marginBottom: 15,
  },
  link: {
    textDecoration: 'underline',
    color: 'black',
    fontSize: LONDON_FONT_SIZE,
  },
  bullet: {
    width: 3,
    height: 3,
    borderRadius: '50%',
    marginRight: 6,
    marginTop: 4,
  },
});
