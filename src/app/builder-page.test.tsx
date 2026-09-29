import { describe, expect, it, vi } from 'vitest';
import { createDiscardAndLeaveAction } from './builder-page';

describe('failed navigation recovery', () => {
  it('exposes an explicit discard action that leaves after discarding', () => {
    const discard = vi.fn();
    const leave = vi.fn();
    const action = createDiscardAndLeaveAction(discard, leave);

    expect(action.label).toBe('Discard and leave');
    action.onClick();

    expect(discard).toHaveBeenCalledOnce();
    expect(leave).toHaveBeenCalledOnce();
  });
});
