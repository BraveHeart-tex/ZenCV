import { Font, StyleSheet } from '@react-pdf/renderer';

export const SYDNEY_FONT_SIZE = 10.5;
export const SYDNEY_DARK = '#111111';
export const SYDNEY_MUTED = '#777777';
export const SYDNEY_ACCENT = '#111111';
export const SYDNEY_DIVIDER = '#e5e5e5';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto/Roboto-Regular.ttf', fontWeight: 400 },
    {
      src: '/fonts/Roboto/Roboto-Italic.ttf',
      fontWeight: 400,
      fontStyle: 'italic',
    },
    { src: '/fonts/Roboto/Roboto-Bold.ttf', fontWeight: 700 },
    {
      src: '/fonts/Roboto/Roboto-BoldItalic.ttf',
      fontWeight: 700,
      fontStyle: 'italic',
    },
  ],
});

export const createSydneyStyles = (accentColor: string = SYDNEY_DARK) =>
  StyleSheet.create({
    page: {
      fontFamily: 'Roboto',
      backgroundColor: '#ffffff',
      paddingVertical: 28,
      paddingHorizontal: 36,
      flexDirection: 'column',
    },
    header: {
      marginBottom: 20,
      borderBottom: `1.5px solid ${accentColor}`,
      paddingBottom: 16,
    },
    name: {
      fontSize: 32,
      fontWeight: 700,
      color: SYDNEY_DARK,
      letterSpacing: -0.5,
      lineHeight: 1.1,
      marginBottom: 6,
    },
    jobTitle: {
      fontSize: 13,
      fontWeight: 400,
      color: SYDNEY_MUTED,
      letterSpacing: 0.3,
      marginBottom: 12,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    contactItem: {
      fontSize: 9.5,
      color: SYDNEY_MUTED,
    },
    contactSeparator: {
      fontSize: 9.5,
      color: SYDNEY_DIVIDER,
    },
    section: {
      marginBottom: 14,
    },
    sectionLabel: {
      fontSize: 8.5,
      fontWeight: 700,
      color: accentColor,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 10,
    },
    entryWrapper: {
      marginBottom: 8,
      flexDirection: 'row',
      gap: 20,
    },
    entryLeft: {
      width: '22%',
      flexDirection: 'column',
      paddingTop: 1,
    },
    entryRight: {
      flex: 1,
      flexDirection: 'column',
    },
    entryDate: {
      fontSize: 9,
      color: SYDNEY_MUTED,
      lineHeight: 1.5,
    },
    entryCity: {
      fontSize: 9,
      color: SYDNEY_MUTED,
      lineHeight: 1.5,
    },
    entryTitle: {
      fontSize: SYDNEY_FONT_SIZE,
      fontWeight: 700,
      color: SYDNEY_DARK,
      marginBottom: 1,
    },
    entrySubtitle: {
      fontSize: 10,
      fontWeight: 400,
      color: accentColor,
      marginBottom: 4,
    },
    mainText: {
      fontSize: SYDNEY_FONT_SIZE,
      color: '#333333',
      lineHeight: 1.6,
    },
    mainMuted: {
      fontSize: 9.5,
      color: SYDNEY_MUTED,
      lineHeight: 1.5,
    },
    inlineRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      rowGap: 5,
    },
    inlineItem: {
      fontSize: SYDNEY_FONT_SIZE,
      color: SYDNEY_DARK,
      borderBottom: `1px solid ${SYDNEY_DIVIDER}`,
      paddingBottom: 2,
    },
    skillRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
      width: '46%',
    },
    skillName: {
      fontSize: SYDNEY_FONT_SIZE,
      color: SYDNEY_DARK,
    },
    skillLevel: {
      fontSize: 9,
      color: SYDNEY_MUTED,
    },
    link: {
      fontSize: SYDNEY_FONT_SIZE,
      color: SYDNEY_DARK,
      textDecoration: 'none',
    },
    bullet: {
      width: 3,
      height: 3,
      borderRadius: '50%',
      marginRight: 6,
      marginTop: 5,
      backgroundColor: accentColor,
    },
  });
