// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DEX_Document } from '@/lib/client-db/clientDbSchema';
import { DocumentsPageClient } from '../DocumentsPageClient';

vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: vi.fn(),
}));

vi.mock('@/lib/client-db/clientDb', () => ({
  clientDb: { documents: { orderBy: vi.fn() } },
}));

vi.mock('../CreateDocumentDialog', () => ({
  CreateDocumentDialog: ({
    triggerClassName,
  }: {
    triggerClassName?: string;
  }) => (
    <button type='button' className={triggerClassName}>
      New Resume
    </button>
  ),
}));

vi.mock('../DocumentCard', () => ({
  DocumentCard: ({ document }: { document: DEX_Document }) => (
    <article>{document.title}</article>
  ),
}));

const documents: DEX_Document[] = [
  {
    id: 1,
    title: 'Product Designer',
    templateType: 'manhattan',
    templateSettings: '{}',
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-03T09:00:00.000Z',
    jobPostingId: null,
  },
  {
    id: 2,
    title: 'Research Lead',
    templateType: 'london',
    templateSettings: '{}',
    createdAt: '2026-10-02T09:00:00.000Z',
    updatedAt: '2026-10-04T09:00:00.000Z',
    jobPostingId: null,
  },
];

const renderPage = () =>
  render(
    <MemoryRouter>
      <DocumentsPageClient />
    </MemoryRouter>
  );

describe('DocumentsPageClient', () => {
  beforeEach(() => {
    vi.mocked(useLiveQuery).mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows a stable loading library while the local query is pending', () => {
    vi.mocked(useLiveQuery).mockReturnValue(null);

    renderPage();

    expect(
      screen
        .getByRole('region', { name: 'Loading resumes' })
        .getAttribute('aria-busy')
    ).toBe('true');
    expect(
      screen.getByRole('searchbox', { name: 'Search resumes' })
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'New Resume' })).toBeTruthy();
    expect(
      screen.getAllByRole('region', { name: 'Loading resumes' })[0].children
    ).toHaveLength(4);
  });

  it('shows the useful first-run state and Settings import path', () => {
    vi.mocked(useLiveQuery).mockReturnValue([]);

    renderPage();

    expect(
      screen.getByRole('heading', { name: 'No resumes yet' })
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Create your first resume. Your work is saved locally in this browser.'
      )
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'New Resume' })).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Import backup' }).getAttribute('href')
    ).toBe('/settings#data');
  });

  it('shows the filtered document count and matching resumes', () => {
    vi.mocked(useLiveQuery).mockReturnValue(documents);

    renderPage();

    expect(
      screen.getByText('2 resumes stored locally in this browser.')
    ).toBeTruthy();
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByText('Product Designer')).toBeTruthy();
    expect(screen.getByText('Research Lead')).toBeTruthy();
  });

  it('shows the query on no matches and clear search restores the list', () => {
    vi.mocked(useLiveQuery).mockReturnValue(documents);

    renderPage();
    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Search resumes' }),
      {
        target: { value: 'engineer' },
      }
    );

    expect(screen.getByText('No results for “engineer”')).toBeTruthy();
    expect(
      screen.getByText('0 resumes stored locally in this browser.')
    ).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(screen.getByText('Product Designer')).toBeTruthy();
    expect(screen.getByText('Research Lead')).toBeTruthy();
  });
});
