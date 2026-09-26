// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ItemsDndContext } from '@/components/documentBuilder/ItemsDndContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { builderDocumentFixture } from '@/lib/builderDocument/__tests__/builderDocumentFixture';
import type { PersistedDocumentRecords } from '@/lib/builderDocument/builderDocument';
import type {
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import { getFullDocumentStructure } from '@/lib/client-db/documentService';
import { updateField } from '@/lib/client-db/fieldService';
import { sectionDefinitions } from '@/lib/sectionDefinitions/sectionDefinitions';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { SectionItem } from '../SectionItem';

vi.mock('@/lib/client-db/documentService', () => ({
  getFullDocumentStructure: vi.fn(),
}));
vi.mock('@/lib/client-db/fieldService', () => ({ updateField: vi.fn() }));

let records: PersistedDocumentRecords;

beforeEach(async () => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  records = builderDocumentFixture();
  localStorage.clear();
  vi.mocked(getFullDocumentStructure).mockImplementation(async () => ({
    success: true,
    document: records.document,
    sections: [...records.sections],
    items: [...records.items],
    fields: [...records.fields],
  }));
  vi.mocked(updateField).mockImplementation(async (id, value) => {
    const field = records.fields.find((candidate) => candidate.id === id);
    if (!field) {
      return 0;
    }
    records = {
      ...records,
      fields: records.fields.map(
        (candidate): DEX_Field =>
          candidate.id === id
            ? ({ ...candidate, value } as DEX_Field)
            : candidate
      ),
    };
    return 1;
  });
  await builderSession.load(records.document.id);
});

afterEach(() => {
  cleanup();
  builderSession.discard();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

const renderItem = (itemId: number) =>
  render(
    <TooltipProvider>
      <ItemsDndContext items={[itemId]}>
        <SectionItem
          itemId={itemId as Parameters<typeof SectionItem>[0]['itemId']}
        />
      </ItemsDndContext>
    </TooltipProvider>
  );

describe('document editor integration', () => {
  it('reveals additional Personal Details and remembers the disclosure choice', () => {
    const item = builderSession.document?.personalDetails.items[0];
    if (!item) {
      throw new Error('Expected Personal Details');
    }

    const editor = renderItem(item.id);
    expect(screen.getByLabelText('First Name')).toBeTruthy();
    expect(screen.queryByLabelText('City')).toBeNull();

    fireEvent.click(
      screen.getByRole('button', { name: 'Show additional details' })
    );
    expect(screen.getByLabelText('City')).toBeTruthy();
    expect(localStorage.getItem('areExtraFieldsHidden')).toBe('false');

    editor.unmount();
    renderItem(item.id);
    expect(screen.getByLabelText('City')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Hide additional details' })
    ).toBeTruthy();
  });

  it('edits a Custom date range through the generic editor and reloads the saved date', async () => {
    const definition = sectionDefinitions.custom;
    const section = {
      id: 40,
      documentId: records.document.id,
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
    const fields = Object.values(definition.fields).map((field, index) => ({
      id: 400 + index,
      itemId: item.id,
      name: field.persistedName,
      type: field.expectedPersistedType,
      value: '',
    })) as DEX_Field[];
    records = {
      ...records,
      sections: [...records.sections, section],
      items: [...records.items, item],
      fields: [...records.fields, ...fields.reverse()],
    };
    await builderSession.load(records.document.id);

    const editor = renderItem(item.id);
    fireEvent.click(screen.getByRole('button', { name: 'Expand entry' }));
    const start = screen.getByLabelText('Start Date');
    const end = screen.getByLabelText('End Date');
    expect(start.closest('.col-span-full')).toBe(end.closest('.col-span-full'));

    fireEvent.change(start, { target: { value: 'Jan 2024' } });
    fireEvent.blur(start);
    await waitFor(() => {
      expect(
        records.fields.find(
          (field) => field.name === 'Start Date' && field.itemId === item.id
        )?.value
      ).toBe('Jan 2024');
    });

    editor.unmount();
    await builderSession.load(records.document.id);
    renderItem(item.id);
    fireEvent.click(screen.getByRole('button', { name: 'Expand entry' }));
    expect(screen.getByLabelText('Start Date')).toHaveProperty(
      'value',
      'Jan 2024'
    );
  });

  it('keeps Work Experience on its typed form and saves its role across navigation', async () => {
    const item = builderSession.document?.workExperience.items[0];
    if (!item) {
      throw new Error('Expected Work Experience');
    }

    const editor = renderItem(item.id);
    fireEvent.click(screen.getByRole('button', { name: 'Expand entry' }));
    expect(
      screen.getByText('Employment dates', { selector: 'legend' })
    ).toBeTruthy();
    expect(screen.getByLabelText('Start Date')).toBeTruthy();
    expect(screen.getByLabelText('End Date')).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: 'Show additional details' })
    ).toBeNull();

    fireEvent.change(screen.getByLabelText('Job Title'), {
      target: { value: 'Staff Engineer' },
    });
    expect(screen.getByLabelText('Job Title')).toHaveProperty(
      'value',
      'Staff Engineer'
    );
    expect(await builderSession.prepareNavigation()).toBe(true);
    editor.unmount();

    await builderSession.load(records.document.id);
    renderItem(item.id);
    fireEvent.click(screen.getByRole('button', { name: 'Expand entry' }));
    expect(screen.getByLabelText('Job Title')).toHaveProperty(
      'value',
      'Staff Engineer'
    );
  });
});
