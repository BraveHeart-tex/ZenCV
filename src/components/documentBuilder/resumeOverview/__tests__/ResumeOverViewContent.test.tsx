// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ItemId } from '@/lib/builderDocument/builderDocument';
import { CollapsibleItemHeader } from '../../collapsibleItemContainer/CollapsibleItemHeader';
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
  coursesSection: {
    id: 40,
    title: 'Courses',
    items: [
      { id: 42, sectionId: 40, containerType: 'collapsible' },
      { id: 41, sectionId: 40, containerType: 'collapsible' },
    ],
  },
  skillsSection: {
    id: 50,
    title: 'Skills',
    items: [{ id: 51, sectionId: 50, containerType: 'collapsible' }],
  },
  skillsSnapshotItem: {
    id: 51,
    displayOrder: 1,
    values: { skill: 'TypeScript', experienceLevel: 'Expert' },
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
  coursesSnapshotItems: [
    {
      id: 42,
      displayOrder: 2,
      values: {
        course: 'Second Course',
        institution: 'Second Academy',
        startDate: '2024-04',
        endDate: '2024-06',
      },
    },
    {
      id: 41,
      displayOrder: 1,
      values: {
        course: 'First Course',
        institution: 'First Academy',
        startDate: '2023-01',
        endDate: '2023-03',
      },
    },
  ],
}));

vi.mock('@/lib/stores/documentBuilder/builderSession', () => ({
  builderSession: {
    document: {
      sections: [
        mocks.educationSection,
        mocks.internshipSection,
        mocks.coursesSection,
        mocks.skillsSection,
      ],
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
        {
          id: 40,
          sectionKey: 'courses',
          title: 'Courses',
          displayOrder: 3,
          items: mocks.coursesSnapshotItems,
        },
        {
          id: 50,
          sectionKey: 'skills',
          title: 'Skills',
          displayOrder: 4,
          showExperienceLevel: true,
          isCommaSeparated: false,
          items: [mocks.skillsSnapshotItem],
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
  mocks.coursesSnapshotItems[1].values.course = 'First Course';
  mocks.skillsSnapshotItem.values.skill = 'TypeScript';
});

describe('Skills editor and overview', () => {
  it('shows semantic Skills heading and selected level in the editor', () => {
    mocks.getItem.mockReturnValue({
      ...mocks.skillsSection.items[0],
      sectionKey: 'skills',
    });
    mocks.skillsSnapshotItem.values.skill = 'Edited Skill';

    render(<CollapsibleItemHeader itemId={51 as ItemId} />);

    expect(screen.getByText('Edited Skill')).toBeTruthy();
    expect(screen.getByText('Expert')).toBeTruthy();
  });

  it('navigates from the semantic Skills heading to its stable item ID', () => {
    mocks.getItem.mockReturnValue({
      ...mocks.skillsSection.items[0],
      sectionKey: 'skills',
    });

    render(
      <ResumeOverViewContent
        visible
        focusState={{ sectionId: null, itemId: null }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'TypeScript' }));
    expect(mocks.scrollItemIntoView).toHaveBeenCalledWith(51);
  });
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

describe('Courses navigation', () => {
  it('shows edited Course values and dates in the collapsed heading', () => {
    mocks.getItem.mockReturnValue({
      ...mocks.coursesSection.items[1],
      sectionKey: 'courses',
    });
    mocks.coursesSnapshotItems[1].values.course = 'Edited Course';

    render(<CollapsibleItemHeader itemId={41 as ItemId} />);

    expect(screen.getByText('Edited Course at First Academy')).toBeTruthy();
    expect(screen.getByText('2023-01 - 2023-03')).toBeTruthy();
  });

  it('shows reordered, edited Course headings and navigates to stable item IDs', () => {
    mocks.getItem.mockImplementation((itemId: number) => ({
      ...mocks.coursesSection.items.find((item) => item.id === itemId),
      sectionKey: 'courses',
    }));
    mocks.coursesSnapshotItems[1].values.course = 'Edited Course';

    render(
      <ResumeOverViewContent
        visible
        focusState={{ sectionId: null, itemId: null }}
      />
    );

    const first = screen.getByRole('button', {
      name: 'Second Course at Second Academy',
    });
    const second = screen.getByRole('button', {
      name: 'Edited Course at First Academy',
    });
    expect(
      first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();

    fireEvent.click(second);
    expect(mocks.scrollItemIntoView).toHaveBeenCalledWith(41);
  });
});
