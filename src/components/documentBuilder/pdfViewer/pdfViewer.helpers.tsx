import LondonTemplate from '@/components/appHome/resumeTemplates/london/LondonTemplate';
import ManhattanTemplate from '@/components/appHome/resumeTemplates/manhattan/ManhattanTemplate';
import { INTERNAL_TEMPLATE_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  PdfTemplateData,
  ResumeTemplate,
} from '@/lib/types/documentBuilder.types';

export const getPdfTemplateByType = (
  templateType: ResumeTemplate,
  pdfTemplateData: PdfTemplateData,
) => {
  if (templateType === INTERNAL_TEMPLATE_TYPES.MANHATTAN) {
    return <ManhattanTemplate templateData={pdfTemplateData} />;
  }

  if (templateType === INTERNAL_TEMPLATE_TYPES.LONDON) {
    return <LondonTemplate templateData={pdfTemplateData} />;
  }

  return <></>;
};
