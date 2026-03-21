import { Font, StyleSheet } from '@react-pdf/renderer';

export const TOKYO_FONT_SIZE = 10.5;
export const TOKYO_SIDEBAR_WIDTH = '32%';
export const TOKYO_MAIN_WIDTH = '68%';
export const TOKYO_ACCENT_COLOR = '#1a1a2e';
export const TOKYO_SIDEBAR_BG = '#1a1a2e';
export const TOKYO_SIDEBAR_TEXT = '#e8e8f0';
export const TOKYO_SIDEBAR_MUTED = '#a0a0b8';

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: `/fonts/Roboto/Roboto-Regular.ttf`,
      fontWeight: 400,
    },
    {
      src: `/fonts/Roboto/Roboto-Italic.ttf`,
      fontWeight: 400,
      fontStyle: 'italic',
    },
    {
      src: `/fonts/Roboto/Roboto-Bold.ttf`,
      fontWeight: 700,
    },
    {
      src: `/fonts/Roboto/Roboto-BoldItalic.ttf`,
      fontWeight: 700,
      fontStyle: 'italic',
    },
  ],
});

export const createTokyoStyles = (accentColor: string) =>
  StyleSheet.create({
    page: {
      fontFamily: 'Roboto',
      flexDirection: 'row',
      backgroundColor: '#ffffff',
    },
    sidebar: {
      width: TOKYO_SIDEBAR_WIDTH,
      backgroundColor: TOKYO_SIDEBAR_BG,
      paddingVertical: 28,
      paddingHorizontal: 18,
      flexDirection: 'column',
      gap: 0,
    },
    sidebarName: {
      fontSize: 18,
      fontWeight: 700,
      color: '#ffffff',
      marginBottom: 2,
      lineHeight: 1.2,
    },
    sidebarJobTitle: {
      fontSize: 10,
      color: accentColor,
      fontWeight: 400,
      marginBottom: 20,
      letterSpacing: 0.5,
    },
    sidebarSection: {
      marginBottom: 18,
    },
    sidebarSectionLabel: {
      fontSize: 8,
      fontWeight: 700,
      color: accentColor,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: 8,
      borderBottom: `1px solid ${accentColor}`,
      paddingBottom: 4,
    },
    sidebarText: {
      fontSize: TOKYO_FONT_SIZE,
      color: TOKYO_SIDEBAR_TEXT,
      lineHeight: 1.5,
      marginBottom: 3,
    },
    sidebarMuted: {
      fontSize: 9,
      color: TOKYO_SIDEBAR_MUTED,
      lineHeight: 1.4,
    },
    main: {
      width: TOKYO_MAIN_WIDTH,
      paddingVertical: 28,
      paddingHorizontal: 22,
      flexDirection: 'column',
    },
    mainSection: {
      marginBottom: 14,
    },
    mainSectionLabel: {
      fontSize: 11,
      fontWeight: 700,
      color: TOKYO_ACCENT_COLOR,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 2,
      paddingBottom: 4,
      borderBottom: `2px solid ${accentColor}`,
    },
    mainText: {
      fontSize: TOKYO_FONT_SIZE,
      color: '#2d2d2d',
      lineHeight: 1.5,
    },
    mainMuted: {
      fontSize: 9.5,
      color: '#666666',
      lineHeight: 1.4,
    },
    entryTitle: {
      fontSize: TOKYO_FONT_SIZE,
      fontWeight: 700,
      color: TOKYO_ACCENT_COLOR,
    },
    entrySubtitle: {
      fontSize: 9.5,
      color: accentColor,
      fontWeight: 400,
      marginBottom: 3,
    },
    entryDate: {
      fontSize: 9,
      color: '#888888',
      marginBottom: 2,
    },
    link: {
      textDecoration: 'none',
      color: TOKYO_SIDEBAR_TEXT,
      fontSize: TOKYO_FONT_SIZE,
    },
    bullet: {
      width: 3,
      height: 3,
      borderRadius: '50%',
      marginRight: 6,
      marginTop: 4,
      backgroundColor: accentColor,
    },
    skillRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    skillName: {
      fontSize: TOKYO_FONT_SIZE,
      color: TOKYO_SIDEBAR_TEXT,
      flex: 1,
    },
    skillLevel: {
      fontSize: 9,
      color: TOKYO_SIDEBAR_MUTED,
    },
  });
