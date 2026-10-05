// @vitest-environment node
import path from 'node:path';
import { Font, renderToBuffer } from '@react-pdf/renderer';
import { describe, expect, it } from 'vitest';
import { getPdfTemplateByType } from '@/components/documentBuilder/pdfViewer/pdfViewer.helpers';
import { jakeTemplateData } from './fixtures/jakeTemplateData';

describe('Jake PDF export', () => {
  it('exports A4 with embedded fonts and wraps lengthy content onto additional pages', async () => {
    for (const source of Font.getRegisteredFonts()['Times New Roman'].sources) {
      source.src = path.resolve('public', source.src.slice(1));
    }
    const workExperienceSection = jakeTemplateData.workExperienceSection;
    if (!workExperienceSection) {
      throw new Error('Expected fixture work experience');
    }
    const exportPdf = (long: boolean) =>
      renderToBuffer(
        getPdfTemplateByType({
          ...jakeTemplateData,
          workExperienceSection: long
            ? {
                ...workExperienceSection,
                entries: Array.from({ length: 18 }, (_, index) => ({
                  ...workExperienceSection.entries[0],
                  entryId: `long-${index}`,
                })),
              }
            : jakeTemplateData.workExperienceSection,
        })
      );
    const normal = (await exportPdf(false)).toString('latin1');
    expect(normal.startsWith('%PDF-')).toBe(true);
    const mediaBox = normal.match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
    expect(Number(mediaBox?.[1])).toBeCloseTo(595.28, 2);
    expect(Number(mediaBox?.[2])).toBeCloseTo(841.89, 2);
    expect(normal).toContain('/FontFile2');
    expect(normal.match(/\/Type \/Page\b/g)).toHaveLength(1);
    const long = (await exportPdf(true)).toString('latin1');
    expect(long.match(/\/Type \/Page\b/g)?.length).toBeGreaterThan(1);
  }, 20000);
});
