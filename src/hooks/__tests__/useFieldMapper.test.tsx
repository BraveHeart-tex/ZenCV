import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { builderDocumentFixture } from '@/lib/builderDocument/__tests__/builderDocumentFixture';
import { hydrateBuilderDocument } from '@/lib/builderDocument/builderDocument';
import { createGenericRenderPlan } from '@/lib/builderDocument/createGenericRenderPlan';

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

import { useFieldMapper } from '../useFieldMapper';

describe('generic field rendering', () => {
  it('renders a date range once in declared start/end order and keeps an incomplete date editable', () => {
    const result = hydrateBuilderDocument(builderDocumentFixture());
    if (!result.success) {
      throw new Error('Expected a valid document fixture');
    }
    const fields = result.document.workExperience.items[0].editableFields;
    const start = fields.find(
      (field) => field.definition.dateRange?.role === 'start'
    );
    const end = fields.find(
      (field) => field.definition.dateRange?.role === 'end'
    );
    if (!start || !end) {
      throw new Error('Expected date range');
    }

    const render = useFieldMapper().renderFields;
    const paired = renderToStaticMarkup(
      render(createGenericRenderPlan([...fields].reverse()).primary)
    );
    expect(paired.match(/data-date-field-id/g)).toHaveLength(2);
    expect(paired.indexOf(`data-date-field-id="${start.id}"`)).toBeLessThan(
      paired.indexOf(`data-date-field-id="${end.id}"`)
    );
    expect(paired).toContain(
      'col-span-full grid grid-cols-1 gap-4 lg:grid-cols-2'
    );

    const incomplete = renderToStaticMarkup(
      render(
        createGenericRenderPlan(fields.filter((field) => field !== end)).primary
      )
    );
    expect(incomplete).toContain(`data-field-id="${start.id}"`);
  });
});
