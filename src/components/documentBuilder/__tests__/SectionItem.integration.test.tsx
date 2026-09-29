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
import { DexieDocumentPersistence } from '@/lib/client-db/dexieDocumentPersistence';
import { sectionDefinitions } from '@/lib/sectionDefinitions/sectionDefinitions';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { SectionItem } from '../SectionItem';

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
  vi.spyOn(DexieDocumentPersistence.prototype, 'load').mockImplementation(
    async () => ({
      success: true,
      value: records,
    })
  );
  vi.spyOn(
    DexieDocumentPersistence.prototype,
    'saveFieldValue'
  ).mockImplementation(async (_documentId, id, value) => {
    const field = records.fields.find((candidate) => candidate.id === id);
    if (!field) {
      return { success: false, reason: 'notFound' };
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
    return { success: true, value: undefined };
  });
  await builderSession.load(records.document.id);
});

afterEach(() => {
  cleanup();
  builderSession.discard();
  vi.clearAllMocks();
  vi.restoreAllMocks();
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
  it('edits, clears, and reloads Hobbies through the editor', async () => {
    const definition = sectionDefinitions.hobbies;
    const section = {
      id: 50,
      documentId: records.document.id,
      title: definition.label,
      defaultTitle: definition.label,
      type: definition.persistedType,
      displayOrder: 5,
      metadata: '[]',
    } as DEX_Section;
    const item = {
      id: 51,
      sectionId: section.id,
      containerType: definition.expectedContainerType,
      displayOrder: 1,
    } as DEX_Item;
    const field = {
      id: 52,
      itemId: item.id,
      name: definition.fields.whatYouLike.persistedName,
      type: definition.fields.whatYouLike.expectedPersistedType,
      value: 'Photography',
    } as DEX_Field;
    records = {
      ...records,
      sections: [...records.sections, section],
      items: [...records.items, item],
      fields: [...records.fields, field],
    };
    await builderSession.load(records.document.id);

    const editor = renderItem(item.id);
    const input = screen.getByLabelText('What do you like?');
    expect(input).toHaveProperty('value', 'Photography');
    fireEvent.change(input, { target: { value: 'Photography, Hiking' } });
    expect(input).toHaveProperty('value', 'Photography, Hiking');
    expect(await builderSession.prepareNavigation()).toBe(true);
    editor.unmount();

    await builderSession.load(records.document.id);
    const reloadedEditor = renderItem(item.id);
    const reloadedInput = screen.getByLabelText('What do you like?');
    expect(reloadedInput).toHaveProperty('value', 'Photography, Hiking');
    fireEvent.change(reloadedInput, { target: { value: '' } });
    expect(reloadedInput).toHaveProperty('value', '');
    expect(await builderSession.prepareNavigation()).toBe(true);
    reloadedEditor.unmount();

    await builderSession.load(records.document.id);
    renderItem(item.id);
    expect(screen.getByLabelText('What do you like?')).toHaveProperty(
      'value',
      ''
    );
  });

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

  it('spans the desktop Work Experience container and keeps dates in its grid', () => {
    const item = builderSession.document?.workExperience.items[0];
    if (!item) {
      throw new Error('Expected Work Experience');
    }

    const { container } = renderItem(item.id);
    fireEvent.click(screen.getByRole('button', { name: 'Expand entry' }));

    const outerGrid = container.querySelector('.grid.grid-cols-2.gap-4.p-4');
    const form = outerGrid?.firstElementChild;
    const dates = screen.getByRole('group', { name: 'Employment dates' });
    expect(form?.classList.contains('lg:col-span-2')).toBe(true);
    expect(form?.classList.contains('lg:grid-cols-2')).toBe(true);
    expect(dates.parentElement).toBe(form);
    expect(dates.classList.contains('col-span-1')).toBe(true);
    expect(dates.classList.contains('lg:col-span-2')).toBe(true);
  });

  it('places the Work Experience form in a single-column mobile drawer', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(max-width: 1024px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const item = builderSession.document?.workExperience.items[0];
    if (!item) {
      throw new Error('Expected Work Experience');
    }

    renderItem(item.id);
    fireEvent.click(
      screen.getByRole('button', { name: /value-role at value-employer/ })
    );

    const dates = await screen.findByRole('group', {
      name: 'Employment dates',
    });
    const form = dates.parentElement;
    expect(form?.classList.contains('grid-cols-1')).toBe(true);
    expect(dates.classList.contains('col-span-1')).toBe(true);
    expect(screen.getByRole('dialog').contains(form)).toBe(true);
  });

  it('edits and reloads a supported extra Work Experience field', async () => {
    const item = builderSession.document?.workExperience.items[0];
    if (!item) {
      throw new Error('Expected Work Experience');
    }
    const extra = {
      id: 9001,
      itemId: item.id,
      name: 'Legacy note',
      type: 'string',
      value: 'Original note',
    } as unknown as DEX_Field;
    records = { ...records, fields: [...records.fields, extra] };
    await builderSession.load(records.document.id);

    const editor = renderItem(item.id);
    fireEvent.click(screen.getByRole('button', { name: 'Expand entry' }));
    expect(screen.getByLabelText('Job Title')).toBeTruthy();
    expect(screen.queryByLabelText('Legacy note')).toBeNull();
    fireEvent.click(
      screen.getByRole('button', { name: 'Show additional details' })
    );
    fireEvent.change(screen.getByLabelText('Legacy note'), {
      target: { value: 'Updated note' },
    });
    expect(await builderSession.prepareNavigation()).toBe(true);
    expect(records.fields.find((field) => field.id === extra.id)?.value).toBe(
      'Updated note'
    );

    editor.unmount();
    await builderSession.load(records.document.id);
    renderItem(item.id);
    fireEvent.click(screen.getByRole('button', { name: 'Expand entry' }));
    expect(screen.getByLabelText('Legacy note')).toHaveProperty(
      'value',
      'Updated note'
    );
    expect(
      builderSession.document?.workExperience.items[0]?.editableFields.find(
        (field) => field.id === extra.id
      )?.fieldKey
    ).toBe('legacy:9001');
  });
});
