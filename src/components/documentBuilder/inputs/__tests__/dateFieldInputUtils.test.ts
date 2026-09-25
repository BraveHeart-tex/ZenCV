import { describe, expect, it } from 'vitest';
import { builderDocumentFixture } from '@/lib/builderDocument/__tests__/builderDocumentFixture';
import { hydrateBuilderDocument } from '@/lib/builderDocument/builderDocument';
import { canMarkDateAsPresent } from '../dateFieldInputUtils';

describe('canMarkDateAsPresent', () => {
  it('limits Present to the Work Experience end date', () => {
    const result = hydrateBuilderDocument(builderDocumentFixture());
    if (!result.success) {
      throw new Error('Expected a valid document fixture');
    }

    const entry = result.document.workExperience.entries[0];
    if (!entry) {
      throw new Error('Expected a Work Experience entry');
    }

    expect(canMarkDateAsPresent(entry.startDate)).toBe(false);
    expect(canMarkDateAsPresent(entry.endDate)).toBe(true);
  });

  it('keeps the generic date control behavior for non-Work sections', () => {
    expect(
      canMarkDateAsPresent({
        sectionKey: 'education',
        definition: {
          dateRange: { allowPresent: false },
        },
      })
    ).toBe(true);
  });
});
