// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { ConfirmDialog } from '../ConfirmDialog';

vi.mock('@/hooks/useMediaQuery', () => ({ useMediaQuery: () => true }));

afterEach(async () => {
  cleanup();
  await confirmDialogStore.hideDialog();
});

describe('confirmation recovery', () => {
  it('locks duplicate confirmation and dismissal until the operation completes', async () => {
    let complete = () => {};
    const onConfirm = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          complete = resolve;
        })
    );
    confirmDialogStore.showDialog({
      title: 'Restore',
      message: 'Replace local work',
      onConfirm,
    });
    render(<ConfirmDialog />);
    const confirm = screen.getByRole('button', { name: 'Confirm' });
    fireEvent.click(confirm);
    fireEvent.click(confirm);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(
      (screen.getByRole('button', { name: 'Cancel' }) as HTMLButtonElement)
        .disabled
    ).toBe(true);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(confirmDialogStore.isOpen).toBe(true);
    await act(async () => {
      complete();
    });
    expect(
      (screen.getByRole('button', { name: 'Confirm' }) as HTMLButtonElement)
        .disabled
    ).toBe(false);
  });

  it('keeps failed actions open with an actionable error and allows a retry', async () => {
    const onConfirm = vi
      .fn()
      .mockRejectedValueOnce(new Error('write failed'))
      .mockResolvedValueOnce(undefined);
    confirmDialogStore.showDialog({
      title: 'Restore',
      message: 'Replace local work',
      errorMessage: 'Your data is unchanged. Try again.',
      onConfirm,
    });
    render(<ConfirmDialog />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    });
    expect(screen.getByRole('alert').textContent).toContain(
      'Your data is unchanged'
    );
    expect(confirmDialogStore.isOpen).toBe(true);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    });
    expect(onConfirm).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
