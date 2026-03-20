import { DubaiTemplate } from '@/components/appHome/resumeTemplates/dubai/DubaiTemplate';
import { LondonTemplate } from '@/components/appHome/resumeTemplates/london/LondonTemplate';
import { ManhattanTemplate } from '@/components/appHome/resumeTemplates/manhattan/ManhattanTemplate';
import { SydneyTemplate } from '@/components/appHome/resumeTemplates/sydney/SydneyTemplate';
import { TokyoTemplate } from '@/components/appHome/resumeTemplates/tokyo/TokyoTemplate';
import { INTERNAL_TEMPLATE_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type {
  PdfTemplateData,
  ResumeTemplate,
} from '@/lib/types/documentBuilder.types';

export const getPdfTemplateByType = (
  templateType: ResumeTemplate,
  pdfTemplateData: PdfTemplateData
) => {
  if (templateType === INTERNAL_TEMPLATE_TYPES.MANHATTAN) {
    return <ManhattanTemplate templateData={pdfTemplateData} />;
  }

  if (templateType === INTERNAL_TEMPLATE_TYPES.LONDON) {
    return <LondonTemplate templateData={pdfTemplateData} />;
  }

  if (templateType === INTERNAL_TEMPLATE_TYPES.TOKYO) {
    return <TokyoTemplate templateData={pdfTemplateData} />;
  }

  if (templateType === INTERNAL_TEMPLATE_TYPES.DUBAI) {
    return <DubaiTemplate templateData={pdfTemplateData} />;
  }

  if (templateType === INTERNAL_TEMPLATE_TYPES.SYDNEY) {
    return <SydneyTemplate templateData={pdfTemplateData} />;
  }

  // biome-ignore lint/complexity/noUselessFragments: Fragment is fine here
  return <></>;
};
