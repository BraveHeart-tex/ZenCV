// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResumeOverViewContent } from '../ResumeOverViewContent';

const mocks = vi.hoisted(() => ({
  scrollItemIntoView: vi.fn(),
  getItem: vi.fn(),
  educationSection: {
    id: 20,
    title: 'Education',
    items: [{ id: 21, sectionId: 20, containerType: 'collapsible' }],
  },
  snapshotItem: {
    id: 21,
    displayOrder: 1,
    values: { school: 'First University', degree: 'BSc' },
  },
}));

vi.mock('@/lib/stores/documentBuilder/builderSession', () => ({
  builderSession: {
    document: { sections: [mocks.educationSection] },
    getItem: mocks.getItem,
    resumeDocumentSnapshot: {
      id: 1,
      sections: [
        {
          id: 20,
          sectionKey: 'education',
          title: 'Education',
          displayOrder: 1,
          items: [mocks.snapshotItem],
        },
      ],
    },
  },
}));

vi.mock('@/lib/helpers/documentBuilderHelpers', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@/lib/helpers/documentBuilderHelpers')
  >()),
  scrollItemIntoView: mocks.scrollItemIntoView,
}));

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('motion/react-m', () => ({
  div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mocks.snapshotItem.values.school = 'First University';
});

describe('Education overview', () => {
  it('shows the edited semantic heading and navigates to its stable item ID', () => {
    mocks.getItem.mockReturnValue({
      ...mocks.educationSection.items[0],
      sectionKey: 'education',
    });
    mocks.snapshotItem.values.school = 'Edited University';

    render(
      <ResumeOverViewContent
        visible
        focusState={{ sectionId: null, itemId: null }}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'BSc at Edited University' })
    );
    expect(mocks.scrollItemIntoView).toHaveBeenCalledWith(21);
  });
});
