import type { SemanticField } from './builderDocument';

export type FieldRenderUnit = Readonly<{
  kind: 'field';
  field: SemanticField;
  visibility: 'primary' | 'additional';
  width: 'half' | 'full';
}>;

export type DateRangeRenderUnit = Readonly<{
  kind: 'dateRange';
  start: SemanticField;
  end: SemanticField;
  visibility: 'primary' | 'additional';
  width: 'full';
}>;

export type GenericRenderUnit = FieldRenderUnit | DateRangeRenderUnit;

export interface GenericRenderPlan {
  readonly primary: readonly GenericRenderUnit[];
  readonly additional: readonly GenericRenderUnit[];
  /** Development diagnostics for impossible incomplete resolved ranges. */
  readonly diagnostics: readonly string[];
}

/** Plans resolved fields using public definitions only. Does not mutate its input. */
export const createGenericRenderPlan = (
  fields: readonly SemanticField[]
): GenericRenderPlan => {
  const ordered = [...fields].sort(
    (left, right) => left.definition.order - right.definition.order
  );
  const ranges = new Map<string, SemanticField[]>();
  for (const field of ordered) {
    const key = field.definition.dateRange?.key;
    if (key !== undefined) {
      const members = ranges.get(key) ?? [];
      members.push(field);
      ranges.set(key, members);
    }
  }

  const primary: GenericRenderUnit[] = [];
  const additional: GenericRenderUnit[] = [];
  const diagnostics: string[] = [];
  const visited = new Set<SemanticField>();
  const invalidRanges = new Set<string>();

  for (const field of ordered) {
    if (visited.has(field)) {
      continue;
    }
    const rangeKey = field.definition.dateRange?.key;
    const members = rangeKey === undefined ? undefined : ranges.get(rangeKey);
    let unit: GenericRenderUnit | undefined;

    if (rangeKey !== undefined && members !== undefined) {
      const start = members.find(
        (member) => member.definition.dateRange?.role === 'start'
      );
      const end = members.find(
        (member) => member.definition.dateRange?.role === 'end'
      );
      if (
        members.length === 2 &&
        start !== undefined &&
        end !== undefined &&
        start.definition.visibility === end.definition.visibility
      ) {
        unit = {
          kind: 'dateRange',
          start,
          end,
          visibility: start.definition.visibility,
          width: 'full',
        };
        visited.add(start);
        visited.add(end);
      } else {
        if (!invalidRanges.has(rangeKey)) {
          diagnostics.push(`Incomplete resolved date range: ${rangeKey}`);
          invalidRanges.add(rangeKey);
        }
      }
    }

    if (unit === undefined) {
      unit = {
        kind: 'field',
        field,
        visibility: field.definition.visibility,
        width: field.definition.width,
      };
      visited.add(field);
    }

    if (unit.visibility === 'primary') {
      primary.push(unit);
    } else {
      additional.push(unit);
    }
  }

  return { primary, additional, diagnostics };
};
