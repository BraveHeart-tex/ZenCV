import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  initialize: vi.fn(),
  errorToast: vi.fn(),
  successToast: vi.fn(),
}));
vi.mock('@/lib/client-db/documentService', () => ({
  createDocument: mocks.create,
}));
vi.mock('@/lib/stores/documentBuilder/builderSession', () => ({
  builderSession: { initializeStore: mocks.initialize },
}));
vi.mock('@/components/ui/sonner', () => ({
  showErrorToast: mocks.errorToast,
  showSuccessToast: mocks.successToast,
}));

import { createAndNavigateToDocument } from '../createAndNavigateToDocument';

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('resume creation recovery', () => {
  it('reports a creation failure once through the inline-error callback', async () => {
    mocks.create.mockRejectedValue(new Error('storage failure'));
    const onError = vi.fn();
    const onSuccess = vi.fn();
    await createAndNavigateToDocument({
      title: 'Application',
      templateType: 'manhattan',
      onError,
      onSuccess,
    });
    expect(onError).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining('Your entries are still here')
    );
    expect(mocks.errorToast).not.toHaveBeenCalled();
    expect(mocks.initialize).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('directs users to the saved resume when opening fails instead of suggesting another creation', async () => {
    mocks.create.mockResolvedValue(42);
    mocks.initialize.mockRejectedValue(new Error('opening failure'));
    const onError = vi.fn();
    const onSuccess = vi.fn();
    await createAndNavigateToDocument({
      title: 'Application',
      templateType: 'manhattan',
      onError,
      onSuccess,
    });
    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining('Your resume was saved')
    );
    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining('resume library')
    );
    expect(onSuccess).not.toHaveBeenCalled();
    expect(mocks.successToast).not.toHaveBeenCalled();
  });

  it('keeps toast recovery for callers without an inline-error callback', async () => {
    mocks.create.mockRejectedValue(new Error('storage failure'));
    await createAndNavigateToDocument({
      title: 'Application',
      templateType: 'manhattan',
    });
    expect(mocks.errorToast).toHaveBeenCalledOnce();
    expect(mocks.errorToast).toHaveBeenCalledWith(
      expect.stringContaining('Could not create your resume')
    );
  });
});
