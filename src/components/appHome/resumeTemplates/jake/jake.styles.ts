import { Font, StyleSheet } from '@react-pdf/renderer';

Font.register({
  family: 'Times New Roman',
  fonts: [
    { src: '/fonts/TimesNewRoman/TimesNewRoman.ttf', fontWeight: 400 },
    { src: '/fonts/TimesNewRoman/TimesNewRomanBold.ttf', fontWeight: 600 },
    {
      src: '/fonts/TimesNewRoman/TimesNewRomanItalic.ttf',
      fontWeight: 400,
      fontStyle: 'italic',
    },
    {
      src: '/fonts/TimesNewRoman/TimesNewRomanBoldItalic.ttf',
      fontWeight: 600,
      fontStyle: 'italic',
    },
  ],
});

export const JAKE_FONT_SIZE = 11;

export const jakeStyles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 28,
    fontFamily: 'Times New Roman',
    fontSize: JAKE_FONT_SIZE,
    color: '#000000',
    lineHeight: 1.15,
  },
  header: { alignItems: 'center', marginBottom: 7 },
  name: {
    fontSize: 26,
    lineHeight: 1.15,
    fontWeight: 600,
    textAlign: 'center',
  },
  jobTitle: {
    fontSize: 12,
    lineHeight: 1.15,
    textAlign: 'center',
    marginBottom: 2,
  },
  address: { textAlign: 'center', marginBottom: 2 },
  contacts: { textAlign: 'center', maxWidth: '100%', lineHeight: 1.4 },
  phone: { color: '#000000', textDecoration: 'none' },
  link: { color: '#000000', textDecoration: 'underline' },
  section: { marginBottom: 7 },
  sectionLabel: {
    fontSize: 13,
    lineHeight: 1.15,
    fontWeight: 600,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    paddingBottom: 1,
    marginBottom: 4,
  },
  entries: { gap: 6 },
  entryHeader: { marginBottom: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  title: { flex: 1, minWidth: 0, fontWeight: 600 },
  date: { fontWeight: 600, maxWidth: '42%', textAlign: 'right' },
  subtitle: { flex: 1, minWidth: 0, fontStyle: 'italic' },
  city: { fontStyle: 'italic', maxWidth: '42%', textAlign: 'right' },
  columns: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 3 },
  column: { width: '48%' },
  course: { flexDirection: 'row', gap: 5 },
  courseBody: { flex: 1, minWidth: 0 },
});
