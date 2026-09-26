import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SemanticField } from '@/lib/builderDocument/builderDocument';
import type { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { sectionDefinitions } from '@/lib/sectionDefinitions/sectionDefinitions';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

vi.mock('@/lib/stores/documentBuilder/builderSession', () => ({
  builderSession: { getField: vi.fn() },
}));

vi.mock('@radix-ui/react-popover', () => ({
  PopoverClose: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('@/components/documentBuilder/FieldPersistenceError', () => ({
  FieldPersistenceError: () => null,
}));

import { DateFieldInput } from '../DateFieldInput';

const record = (id: number): DEX_Field =>
  ({
    id,
    itemId: 20,
    name: 'Start Date',
    type: 'date-month',
    value: '',
  }) as DEX_Field;

describe('DateFieldInput', () => {
  it('offers Present only for declared end dates in generic sections', () => {
    const start = new SemanticField(
      record(1),
      'custom',
      sectionDefinitions.custom.fields.startDate
    );
    const end = new SemanticField(
      record(2),
      'custom',
      sectionDefinitions.custom.fields.endDate
    );
    vi.mocked(builderSession.getField).mockReturnValue(start);
    const startMarkup = renderToStaticMarkup(
      <TooltipProvider>
        <DateFieldInput fieldId={start.id} />
      </TooltipProvider>
    );
    vi.mocked(builderSession.getField).mockReturnValue(end);
    const endMarkup = renderToStaticMarkup(
      <TooltipProvider>
        <DateFieldInput fieldId={end.id} />
      </TooltipProvider>
    );

    expect(startMarkup).toContain('Start Date');
    expect(startMarkup).not.toContain('Currently here');
    expect(endMarkup).toContain('End Date');
    expect(endMarkup).toContain('Currently here');
  });
});
