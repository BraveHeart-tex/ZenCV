// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PersonalDetailsLinks } from '../PersonalDetailsLinks';

const mocks = vi.hoisted(() => ({
  addItem: vi.fn(),
  addSection: vi.fn(),
  scrollItemIntoView: vi.fn(),
  document: {
    websitesSocialLinks: undefined as
      | { id: number; itemIds: number[] }
      | undefined,
  },
}));

vi.mock('@/lib/stores/documentBuilder/builderSession', () => ({
  builderSession: {
    document: {
      get websitesSocialLinks() {
        return mocks.document.websitesSocialLinks;
      },
      addSection: mocks.addSection,
    },
    addItem: mocks.addItem,
  },
}));

vi.mock('@/lib/helpers/documentBuilderHelpers', () => ({
  scrollItemIntoView: mocks.scrollItemIntoView,
}));

vi.mock('../ItemsDndContext', () => ({
  ItemsDndContext: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('../SectionItem', () => ({
  SectionItem: ({ itemId }: { itemId: number }) => <output>{itemId}</output>,
}));

afterEach(() => {
  cleanup();
  mocks.document.websitesSocialLinks = undefined;
  vi.clearAllMocks();
});

describe('Personal Details Links navigation', () => {
  it('exposes the section anchor and navigates to a newly added link', async () => {
    mocks.document.websitesSocialLinks = { id: 13, itemIds: [31] };
    mocks.addItem.mockResolvedValue(32);

    const { container } = render(<PersonalDetailsLinks />);
    expect(container.querySelector('#section-13')).not.toBeNull();
    expect(screen.getByText('31')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Add link' }));

    await waitFor(() =>
      expect(mocks.scrollItemIntoView).toHaveBeenCalledWith(32)
    );
    expect(mocks.addItem).toHaveBeenCalledWith(13);
  });

  it('creates the section from the empty state before navigating', async () => {
    mocks.addSection.mockResolvedValue({
      success: true,
      data: { itemId: 41 },
    });

    render(<PersonalDetailsLinks />);
    expect(screen.getByText('No professional links added.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Add link' }));

    await waitFor(() =>
      expect(mocks.scrollItemIntoView).toHaveBeenCalledWith(41)
    );
    expect(mocks.addSection).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'websites-social-links' })
    );
  });
});
