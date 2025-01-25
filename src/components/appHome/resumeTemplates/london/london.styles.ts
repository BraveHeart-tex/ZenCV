import { StyleSheet, Font } from '@react-pdf/renderer';
import {
  DOCUMENT_TITLE_FONT_SIZE,
  PDF_BODY_FONT_SIZE,
  SECTION_LABEL_FONT_SIZE,
} from '@/components/appHome/resumeTemplates/resumeTemplates.constants';

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

export const londonTemplateStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'EB Garamond',
  },
  documentTitle: {
    fontSize: DOCUMENT_TITLE_FONT_SIZE,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  label: {
    fontSize: PDF_BODY_FONT_SIZE,
  },
  documentDescription: {
    fontSize: PDF_BODY_FONT_SIZE,
    marginTop: 5,
    marginBottom: 10,
    textAlign: 'center',
  },
  link: {
    textDecoration: 'underline',
    color: 'black',
    fontSize: PDF_BODY_FONT_SIZE,
  },
  section: {
    padding: 10,
    paddingTop: 5,
    paddingBottom: 15,
    width: '100%',
    borderTop: '1px solid #000',
  },
  sectionLabel: {
    textTransform: 'uppercase',
    fontSize: SECTION_LABEL_FONT_SIZE,
    letterSpacing: 1.1,
    width: '25%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
