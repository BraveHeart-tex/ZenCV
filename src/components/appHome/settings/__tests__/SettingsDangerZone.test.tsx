// @vitest-environment jsdom
import 'fake-indexeddb/auto';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SettingsDangerZone } from '@/components/appHome/settings/SettingsDangerZone';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { clientDb } from '@/lib/client-db/clientDb';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { INTERNAL_TEMPLATE_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';

vi.mock('@/hooks/useMediaQuery', () => ({ useMediaQuery: () => true }));

const clearLocalData = async () => {
  await clientDb.transaction('rw', clientDb.tables, async () => {
    for (const table of clientDb.tables) {
      await table.clear();
    }
  });
};

beforeEach(async () => {
  await clearLocalData();
  await clientDb.documents.add({
    title: 'Disposable test resume',
    templateType: INTERNAL_TEMPLATE_TYPES.MANHATTAN,
    templateSettings: '{}',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    jobPostingId: null,
  });
  await clientDb.settings.add({
    key: 'language',
    value: 'en-US',
  });
});

afterEach(async () => {
  cleanup();
  await confirmDialogStore.hideDialog();
  await clearLocalData();
});

describe('settings data reset', () => {
  it('requires confirmation before clearing local records', async () => {
    render(
      <>
        <SettingsDangerZone />
        <ConfirmDialog />
      </>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete all data' }));

    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: 'Delete all local data?' })
    ).toBeDefined();
    expect(within(dialog).getByText(/This cannot be undone/)).toBeDefined();
    expect(await clientDb.documents.count()).toBe(1);

    await act(async () => {
      fireEvent.click(
        within(dialog).getByRole('button', { name: 'Delete all data' })
      );
    });

    await waitFor(async () => {
      const counts = await Promise.all(
        clientDb.tables.map((table) => table.count())
      );
      expect(counts.every((count) => count === 0)).toBe(true);
      expect(confirmDialogStore.isOpen).toBe(false);
    });
  });
});
