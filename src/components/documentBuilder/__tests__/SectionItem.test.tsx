import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { builderDocumentFixture } from '@/lib/builderDocument/__tests__/builderDocumentFixture';
import { hydrateBuilderDocument } from '@/lib/builderDocument/builderDocument';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

vi.mock('@/hooks/useFieldMapper', () => ({
  useFieldMapper: () => ({
    renderFields: (fields: readonly unknown[]) => (
      <output data-generic-field-count={fields.length} />
    ),
  }),
}));

vi.mock('@/components/documentBuilder/WorkExperienceForm', () => ({
  WorkExperienceForm: () => <output data-work-experience-form />,
}));

vi.mock('@/lib/stores/documentBuilder/builderSession', () => ({
  builderSession: {
    getItem: vi.fn(),
    getSection: vi.fn(),
  },
}));

vi.mock(
  '@/components/documentBuilder/collapsibleItemContainer/CollapsibleItemContainer',
  () => ({
    CollapsibleSectionItemContainer: ({
      children,
    }: {
      children: React.ReactNode;
    }) => <div>{children}</div>,
  })
);

import { SectionItem } from '../SectionItem';

describe('SectionItem', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('uses the Work Experience form only for typed Work Experience items', () => {
    const result = hydrateBuilderDocument(builderDocumentFixture());
    if (!result.success) {
      throw new Error('Expected a valid document fixture');
    }

    const workItem = result.document.workExperience.items[0];
    const summarySection = result.document.section('summary');
    const summaryItem = summarySection?.items[0];
    if (!workItem || !summaryItem) {
      throw new Error('Expected Work Experience and Summary items');
    }

    const getItem = vi.mocked(builderSession.getItem).mockReturnValue(workItem);
    expect(
      renderToStaticMarkup(<SectionItem itemId={workItem.id} />)
    ).toContain('data-work-experience-form');

    getItem.mockReturnValue(summaryItem);
    expect(
      renderToStaticMarkup(<SectionItem itemId={summaryItem.id} />)
    ).toContain('data-generic-field-count');
  });
});
