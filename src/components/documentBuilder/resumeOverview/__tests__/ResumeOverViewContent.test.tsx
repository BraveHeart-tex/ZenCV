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
  internshipSection: {
    id: 30,
    title: 'Internships',
    items: [{ id: 31, sectionId: 30, containerType: 'collapsible' }],
  },
  educationSnapshotItem: {
    id: 21,
    displayOrder: 1,
    values: { school: 'First University', degree: 'BSc' },
  },
  internshipSnapshotItem: {
    id: 31,
    displayOrder: 1,
    values: { role: 'Research Intern', employer: 'Example Lab' },
  },
}));

vi.mock('@/lib/stores/documentBuilder/builderSession', () => ({
  builderSession: {
    document: {
      sections: [mocks.educationSection, mocks.internshipSection],
    },
    getItem: mocks.getItem,
    resumeDocumentSnapshot: {
      id: 1,
      sections: [
        {
          id: 20,
          sectionKey: 'education',
          title: 'Education',
          displayOrder: 1,
          items: [mocks.educationSnapshotItem],
        },
        {
          id: 30,
          sectionKey: 'internships',
          title: 'Internships',
          displayOrder: 2,
          items: [mocks.internshipSnapshotItem],
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
  mocks.educationSnapshotItem.values.school = 'First University';
  mocks.internshipSnapshotItem.values.role = 'Research Intern';
});

describe('Education overview', () => {
  it('shows the edited semantic heading and navigates to its stable item ID', () => {
    mocks.getItem.mockReturnValue({
      ...mocks.educationSection.items[0],
      sectionKey: 'education',
    });
    mocks.educationSnapshotItem.values.school = 'Edited University';

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

describe('Internship overview', () => {
  it('shows the edited semantic heading and navigates to its stable item ID', () => {
    mocks.getItem.mockReturnValue({
      ...mocks.internshipSection.items[0],
      sectionKey: 'internships',
    });
    mocks.internshipSnapshotItem.values.role = 'Analyst Intern';

    render(
      <ResumeOverViewContent
        visible
        focusState={{ sectionId: null, itemId: null }}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Analyst Intern at Example Lab' })
    );
    expect(mocks.scrollItemIntoView).toHaveBeenCalledWith(31);
  });
});
