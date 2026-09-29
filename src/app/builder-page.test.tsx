// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { builderDocumentFixture } from '@/lib/builderDocument/__tests__/builderDocumentFixture';
import { DexieDocumentPersistence } from '@/lib/client-db/dexieDocumentPersistence';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

const toastMocks = vi.hoisted(() => ({ showErrorToast: vi.fn() }));

vi.mock('@/components/ui/sonner', () => ({
  showErrorToast: toastMocks.showErrorToast,
}));
vi.mock('@/components/documentBuilder/DocumentBuilderClient', () => ({
  DocumentBuilderClient: ({
    onReturnToDocuments,
  }: {
    onReturnToDocuments: () => void;
  }) => (
    <button type='button' onClick={onReturnToDocuments}>
      Return to documents
    </button>
  ),
}));
vi.mock('@/components/documentBuilder/resumeOverview/ResumeOverview', () => ({
  ResumeOverview: () => null,
}));
vi.mock(
  '@/components/documentBuilder/builderViewOptions/DocumentBuilderViewToggle',
  () => ({
    DocumentBuilderViewToggle: () => null,
  })
);
vi.mock('@/components/ui/LazyMotionWrapper', () => ({
  LazyMotionWrapper: ({ children }: { children: React.ReactNode }) => children,
}));

import { BuilderPage } from './builder-page';

beforeEach(async () => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  const records = builderDocumentFixture();
  vi.spyOn(DexieDocumentPersistence.prototype, 'load').mockResolvedValue({
    success: true,
    value: records,
  });
  vi.spyOn(
    DexieDocumentPersistence.prototype,
    'saveFieldValue'
  ).mockResolvedValue({
    success: false,
    reason: 'notFound',
  });
  await builderSession.load(records.document.id);
});

afterEach(() => {
  cleanup();
  builderSession.discard();
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe('failed navigation recovery', () => {
  it('keeps the builder open after a failed save, then discards and reaches the destination', async () => {
    const role = builderSession.document?.workExperience.entries[0]?.role;
    if (!role) {
      throw new Error('Expected Work Experience role');
    }
    role.setDraft('Unsaved role');

    const router = createMemoryRouter(
      [
        { path: '/builder/:id', element: <BuilderPage /> },
        { path: '/documents', element: <div>Documents destination</div> },
      ],
      { initialEntries: ['/builder/1'] }
    );
    render(<RouterProvider router={router} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Return to documents' })
    );

    await waitFor(() =>
      expect(toastMocks.showErrorToast).toHaveBeenCalledOnce()
    );
    expect(
      DexieDocumentPersistence.prototype.saveFieldValue
    ).toHaveBeenCalledOnce();
    expect(router.state.location.pathname).toBe('/builder/1');
    expect(builderSession.state.status).toBe('ready');

    const toastOptions = toastMocks.showErrorToast.mock.calls[0]?.[1] as
      | { action?: { label: string; onClick: () => void } }
      | undefined;
    expect(toastOptions?.action?.label).toBe('Discard and leave');
    await act(async () => {
      toastOptions?.action?.onClick();
    });

    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/documents')
    );
    expect(screen.getByText('Documents destination')).toBeTruthy();
    expect(builderSession.state.status).toBe('idle');
  });
});
