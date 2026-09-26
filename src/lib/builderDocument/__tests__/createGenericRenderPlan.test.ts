import { describe, expect, it } from 'vitest';
import { hydrateBuilderDocument } from '../builderDocument';
import { createGenericRenderPlan } from '../createGenericRenderPlan';
import { builderDocumentFixture } from './builderDocumentFixture';

const hydratedFields = () => {
  const records = builderDocumentFixture();
  const result = hydrateBuilderDocument({
    ...records,
    fields: [...records.fields].reverse(),
  });
  if (!result.success) {
    throw new Error('Invalid builder fixture');
  }
  return result.document;
};

describe('generic render plan', () => {
  it('preserves definition order and declared visibility from shuffled persisted records', () => {
    const section = hydratedFields().personalDetails;
    const fields = section.items[0].editableFields;
    const plan = createGenericRenderPlan([...fields].reverse());

    expect(
      plan.primary.map(
        (unit) => unit.kind === 'field' && unit.field.definition.key
      )
    ).toEqual([
      'wantedJobTitle',
      'firstName',
      'lastName',
      'email',
      'phone',
      'country',
    ]);
    expect(
      plan.additional.map(
        (unit) => unit.kind === 'field' && unit.field.definition.key
      )
    ).toEqual(['city', 'address']);
    expect(plan.primary.every((unit) => unit.width === 'half')).toBe(true);
    expect(plan.diagnostics).toEqual([]);
    expect(fields[0].definition).not.toHaveProperty('persistedName');
    expect(fields[0].definition).not.toHaveProperty('expectedPersistedType');
    expect(fields[0].definition.labelRow).toBe('compact');
    expect(section.editorDefinition.editorLayout).toEqual({
      mobileColumns: 1,
      desktopColumns: 2,
      desktopBreakpoint: 'md',
    });
    expect(section.editorDefinition).not.toHaveProperty('persistedType');
    expect(
      createGenericRenderPlan(hydratedFields().summary.items[0].editableFields)
        .primary[0].width
    ).toBe('full');
  });

  it('groups explicit date roles despite fields between members', () => {
    const fields = hydratedFields().workExperience.items[0].editableFields;
    const start = fields.find(
      (field) => field.definition.dateRange?.role === 'start'
    );
    const end = fields.find(
      (field) => field.definition.dateRange?.role === 'end'
    );
    if (!start || !end) {
      throw new Error('Missing date range');
    }
    const endAfterCity = {
      ...end,
      definition: { ...end.definition, order: 5 },
    } as typeof end;
    const plan = createGenericRenderPlan(
      fields
        .filter(
          (field) => field !== end && field.definition.key !== 'description'
        )
        .concat(endAfterCity)
        .reverse()
    );
    const dateUnit = plan.primary.find((unit) => unit.kind === 'dateRange');
    expect(dateUnit).toMatchObject({
      kind: 'dateRange',
      start,
      end: endAfterCity,
      width: 'full',
    });
    expect(
      plan.primary.map((unit) =>
        unit.kind === 'field' ? unit.field.definition.key : 'dates'
      )
    ).toEqual(['role', 'employer', 'dates', 'city']);
    expect(start.definition.dateRange?.allowPresent).toBe(false);
    expect(end.definition.dateRange?.allowPresent).toBe(true);
  });

  it('keeps an incomplete resolved date visible and reports it', () => {
    const fields = hydratedFields().workExperience.items[0].editableFields;
    const plan = createGenericRenderPlan(
      fields.filter((field) => field.definition.key !== 'endDate')
    );
    expect(
      plan.primary.some(
        (unit) =>
          unit.kind === 'field' && unit.field.definition.key === 'startDate'
      )
    ).toBe(true);
    expect(plan.diagnostics).toEqual([
      'Incomplete resolved date range: employment',
    ]);
  });
});
