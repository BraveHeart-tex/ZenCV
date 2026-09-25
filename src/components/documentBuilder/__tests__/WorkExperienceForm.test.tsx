import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { builderDocumentFixture } from '@/lib/builderDocument/__tests__/builderDocumentFixture';
import { hydrateBuilderDocument } from '@/lib/builderDocument/builderDocument';

vi.mock('@/components/documentBuilder/SectionField', () => ({
  SectionField: ({ fieldId }: { fieldId: number }) => (
    <output data-field-id={fieldId} />
  ),
}));

vi.mock('@/components/documentBuilder/inputs/DateFieldInput', () => ({
  DateFieldInput: ({ fieldId }: { fieldId: number }) => (
    <output data-date-field-id={fieldId} />
  ),
}));

import { WorkExperienceForm } from '../WorkExperienceForm';

describe('WorkExperienceForm', () => {
  it('renders typed Work Experience fields in definition order with an explicit date range', () => {
    const result = hydrateBuilderDocument(builderDocumentFixture());
    if (!result.success) {
      throw new Error('Expected a valid document fixture');
    }

    const entry = result.document.workExperience.entries[0];
    if (!entry) {
      throw new Error('Expected a Work Experience entry');
    }

    const markup = renderToStaticMarkup(<WorkExperienceForm entry={entry} />);

    expect(markup).toContain(
      '<legend class="mb-2 text-sm font-medium">Employment dates</legend>'
    );
    expect(markup.indexOf(`data-field-id="${entry.role.id}"`)).toBeLessThan(
      markup.indexOf(`data-field-id="${entry.employer.id}"`)
    );
    expect(
      markup.indexOf(`data-date-field-id="${entry.startDate.id}"`)
    ).toBeLessThan(markup.indexOf(`data-date-field-id="${entry.endDate.id}"`));
    expect(markup.indexOf(`data-field-id="${entry.city.id}"`)).toBeLessThan(
      markup.indexOf(`data-field-id="${entry.description.id}"`)
    );
  });
});
