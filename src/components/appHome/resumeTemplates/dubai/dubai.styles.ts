import { Font, StyleSheet } from '@react-pdf/renderer';

export const DUBAI_FONT_SIZE = 10.5;
export const DUBAI_DARK = '#1c1c1c';
export const DUBAI_MUTED = '#666666';
export const DUBAI_SIDEBAR_BG = '#f7f5f2';
export const DUBAI_SIDEBAR_WIDTH = '33%';
export const DUBAI_MAIN_WIDTH = '67%';
export const DUBAI_DIVIDER = '#e0dbd3';

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

export const createDubaiStyles = (accentColor: string) =>
  StyleSheet.create({
    page: {
      fontFamily: 'Roboto',
      flexDirection: 'row',
      backgroundColor: '#ffffff',
    },
    // Sidebar — light warm gray
    sidebar: {
      width: DUBAI_SIDEBAR_WIDTH,
      backgroundColor: DUBAI_SIDEBAR_BG,
      paddingVertical: 32,
      paddingHorizontal: 18,
      flexDirection: 'column',
      borderRight: `1px solid ${DUBAI_DIVIDER}`,
    },
    sidebarName: {
      fontSize: 17,
      fontWeight: 700,
      color: DUBAI_DARK,
      marginBottom: 2,
      lineHeight: 1.2,
    },
    sidebarJobTitle: {
      fontSize: 9.5,
      color: accentColor,
      fontWeight: 400,
      marginBottom: 22,
      letterSpacing: 0.8,
    },
    sidebarSection: {
      marginBottom: 18,
    },
    sidebarSectionLabel: {
      fontSize: 8,
      fontWeight: 700,
      color: accentColor,
      textTransform: 'uppercase',
      letterSpacing: 1.4,
      marginBottom: 8,
      paddingBottom: 4,
      borderBottom: `1px solid ${accentColor}`,
    },
    sidebarText: {
      fontSize: DUBAI_FONT_SIZE,
      color: DUBAI_DARK,
      lineHeight: 1.5,
      marginBottom: 3,
    },
    sidebarMuted: {
      fontSize: 9,
      color: DUBAI_MUTED,
      lineHeight: 1.4,
    },
    skillRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    skillName: {
      fontSize: DUBAI_FONT_SIZE,
      color: DUBAI_DARK,
      flex: 1,
    },
    skillLevel: {
      fontSize: 9,
      color: DUBAI_MUTED,
    },
    link: {
      fontSize: DUBAI_FONT_SIZE,
      color: DUBAI_DARK,
      textDecoration: 'none',
    },
    // Main column
    main: {
      width: DUBAI_MAIN_WIDTH,
      paddingVertical: 32,
      paddingHorizontal: 24,
      flexDirection: 'column',
    },
    mainSection: {
      marginBottom: 16,
    },
    mainSectionLabel: {
      fontSize: 10,
      fontWeight: 700,
      color: DUBAI_DARK,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: 8,
      paddingBottom: 4,
      borderBottom: `1.5px solid ${accentColor}`,
    },
    entryWrapper: {
      marginBottom: 10,
    },
    entryTitle: {
      fontSize: DUBAI_FONT_SIZE,
      fontWeight: 700,
      color: DUBAI_DARK,
      marginBottom: 1,
    },
    entrySubtitle: {
      fontSize: 9.5,
      color: accentColor,
      marginBottom: 2,
    },
    entryMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 3,
    },
    entryDate: {
      fontSize: 9,
      color: DUBAI_MUTED,
    },
    entryCity: {
      fontSize: 9,
      color: DUBAI_MUTED,
    },
    mainText: {
      fontSize: DUBAI_FONT_SIZE,
      color: '#2d2d2d',
      lineHeight: 1.5,
    },
    mainMuted: {
      fontSize: 9.5,
      color: DUBAI_MUTED,
      lineHeight: 1.4,
    },
    bullet: {
      width: 3,
      height: 3,
      borderRadius: '50%',
      marginRight: 6,
      marginTop: 4,
      backgroundColor: accentColor,
    },
  });
