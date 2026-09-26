import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { builderDocumentFixture } from '@/lib/builderDocument/__tests__/builderDocumentFixture';
import { hydrateBuilderDocument } from '@/lib/builderDocument/builderDocument';
import type {
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import { sectionDefinitions } from '@/lib/sectionDefinitions/sectionDefinitions';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

const disclosureState = vi.hoisted(() => ({ hidden: true }));

vi.mock('@/components/documentBuilder/SectionField', () => ({
  SectionField: ({
    fieldId,
    width,
  }: {
    fieldId: number;
    width: 'half' | 'full';
  }) => <output data-field-id={fieldId} data-width={width} />,
}));

vi.mock('@/components/documentBuilder/inputs/DateFieldInput', () => ({
  DateFieldInput: ({ fieldId }: { fieldId: number }) => (
    <output data-date-field-id={fieldId} />
  ),
}));

vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: () => [disclosureState.hidden, vi.fn()],
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
    disclosureState.hidden = true;
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
    ).toContain(`data-field-id="${summaryItem.editableFields[0].id}"`);
  });

  it('uses declared visibility and responsive layout for Personal Details', () => {
    const result = hydrateBuilderDocument(builderDocumentFixture());
    if (!result.success) {
      throw new Error('Expected a valid document fixture');
    }
    const section = result.document.personalDetails;
    const item = section.items[0];
    vi.mocked(builderSession.getItem).mockReturnValue(item);
    vi.mocked(builderSession.getSection).mockReturnValue(section);

    const markup = renderToStaticMarkup(<SectionItem itemId={item.id} />);
    expect(markup).toContain('grid-cols-1 md:grid-cols-2');
    expect(markup.match(/data-field-id/g)).toHaveLength(6);
    expect(markup).toContain('Show additional details');

    disclosureState.hidden = false;
    const expandedMarkup = renderToStaticMarkup(
      <SectionItem itemId={item.id} />
    );
    expect(expandedMarkup.match(/data-field-id/g)).toHaveLength(8);
    expect(expandedMarkup).toContain('Hide additional details');
  });

  it('renders Custom date ranges as a paired full row despite shuffled records', () => {
    const records = builderDocumentFixture();
    const definition = sectionDefinitions.custom;
    const section = {
      id: 40,
      documentId: 1,
      title: definition.label,
      defaultTitle: definition.label,
      type: definition.persistedType,
      displayOrder: 4,
      metadata: '',
    } as DEX_Section;
    const item = {
      id: 41,
      sectionId: section.id,
      containerType: definition.expectedContainerType,
      displayOrder: 1,
    } as DEX_Item;
    const customFields = Object.values(definition.fields).map(
      (field, index) =>
        ({
          id: 400 + index,
          itemId: item.id,
          name: field.persistedName,
          type: field.expectedPersistedType,
          value: '',
        }) as DEX_Field
    );
    const result = hydrateBuilderDocument({
      ...records,
      sections: [...records.sections, section],
      items: [...records.items, item],
      fields: [...records.fields, ...customFields.reverse()],
    });
    if (!result.success) {
      throw new Error('Expected a valid Custom section');
    }
    const customSection = result.document.customSections[0];
    const customItem = customSection.items[0];
    vi.mocked(builderSession.getItem).mockReturnValue(customItem);
    vi.mocked(builderSession.getSection).mockReturnValue(customSection);

    const markup = renderToStaticMarkup(<SectionItem itemId={customItem.id} />);
    const startId = customItem.field('startDate')?.id;
    const endId = customItem.field('endDate')?.id;
    expect(markup).toContain(
      'col-span-full grid grid-cols-1 gap-4 lg:grid-cols-2'
    );
    expect(markup.indexOf(`data-date-field-id="${startId}"`)).toBeLessThan(
      markup.indexOf(`data-date-field-id="${endId}"`)
    );
    expect(markup).toContain(
      `data-field-id="${customItem.field('description')?.id}" data-width="full"`
    );
    expect(markup).not.toContain('additional details');
    expect(markup).not.toContain('data-work-experience-form');
  });
});
