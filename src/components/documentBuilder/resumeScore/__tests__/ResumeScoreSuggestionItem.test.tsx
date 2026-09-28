// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  SUGGESTION_ACTION_TYPES,
  SUGGESTION_TYPES,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { ResumeSuggestion } from '@/lib/types/documentBuilder.types';
import { ResumeScoreSuggestionItem } from '../ResumeScoreSuggestionItem';

const mocks = vi.hoisted(() => ({
  getFieldRefBySemanticKey: vi.fn(),
  section: vi.fn(),
  addSection: vi.fn(),
  addItem: vi.fn(),
  scrollToCenterAndFocus: vi.fn(),
  scrollItemIntoView: vi.fn(),
  resumeDocumentSnapshot: { sections: [] as unknown[] },
}));

vi.mock('@/lib/stores/documentBuilder/builderSession', () => ({
  builderSession: {
    UIStore: { getFieldRefBySemanticKey: mocks.getFieldRefBySemanticKey },
    document: { section: mocks.section, addSection: mocks.addSection },
    resumeDocumentSnapshot: mocks.resumeDocumentSnapshot,
    addItem: mocks.addItem,
  },
}));

vi.mock('@/lib/helpers/domHelpers', () => ({
  scrollToCenterAndFocus: mocks.scrollToCenterAndFocus,
}));

vi.mock('@/lib/helpers/documentBuilderHelpers', () => ({
  getTextColorForBackground: () => '#fff',
  scrollItemIntoView: mocks.scrollItemIntoView,
}));

vi.mock('../AnimatedSuggestionButton', () => ({
  AnimatedSuggestionButton: ({
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
  }) => (
    <button type='button' onClick={onClick}>
      {label}
    </button>
  ),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mocks.resumeDocumentSnapshot.sections = [];
});

describe('semantic score suggestion actions', () => {
  it('focuses the requested semantic field', () => {
    const element = document.createElement('input');
    mocks.getFieldRefBySemanticKey.mockReturnValue(element);
    const setOpen = vi.fn();
    const suggestion: ResumeSuggestion = {
      label: 'Add email',
      type: SUGGESTION_TYPES.FIELD,
      sectionKey: 'personalDetails',
      fieldKey: 'email',
      scoreValue: 5,
      actionType: SUGGESTION_ACTION_TYPES.FOCUS_FIELD,
    };

    render(
      <ResumeScoreSuggestionItem suggestion={suggestion} setOpen={setOpen} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add email' }));

    expect(mocks.getFieldRefBySemanticKey).toHaveBeenCalledWith(
      'personalDetails',
      'email'
    );
    expect(mocks.scrollToCenterAndFocus).toHaveBeenCalledWith(element);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('creates a missing semantic section and navigates to its first item', async () => {
    mocks.section.mockReturnValue(undefined);
    mocks.addSection.mockResolvedValue({ success: true, data: { itemId: 42 } });
    const suggestion: ResumeSuggestion = {
      label: 'Add education',
      type: SUGGESTION_TYPES.ITEM,
      sectionKey: 'education',
      scoreValue: 15,
      actionType: SUGGESTION_ACTION_TYPES.ADD_ITEM,
    };

    render(
      <ResumeScoreSuggestionItem suggestion={suggestion} setOpen={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add education' }));

    await waitFor(() =>
      expect(mocks.scrollItemIntoView).toHaveBeenCalledWith(42)
    );
    expect(mocks.addSection).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'education' })
    );
  });

  it('navigates to the first semantically empty Education item, even when it has a legacy value', () => {
    mocks.resumeDocumentSnapshot.sections = [
      {
        sectionKey: 'education',
        items: [
          { id: 52, displayOrder: 2, values: { school: '' } },
          { id: 51, displayOrder: 1, values: { school: '' } },
        ],
      },
    ];
    mocks.section.mockReturnValue({
      id: 10,
      items: [
        {
          id: 52,
          displayOrder: 2,
          editableFields: [{ value: '', isLegacy: false }],
        },
        {
          id: 51,
          displayOrder: 1,
          editableFields: [
            { value: '', isLegacy: false },
            { value: 'Retired field value', isLegacy: true },
          ],
        },
      ],
    });
    const suggestion: ResumeSuggestion = {
      label: 'Add education',
      type: SUGGESTION_TYPES.ITEM,
      sectionKey: 'education',
      scoreValue: 15,
      actionType: SUGGESTION_ACTION_TYPES.ADD_ITEM,
    };

    render(
      <ResumeScoreSuggestionItem suggestion={suggestion} setOpen={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add education' }));

    expect(mocks.scrollItemIntoView).toHaveBeenCalledWith(51);
    expect(mocks.addItem).not.toHaveBeenCalled();
  });

  it('navigates to the intended empty Internship item by semantic display order', () => {
    mocks.resumeDocumentSnapshot.sections = [
      {
        sectionKey: 'internships',
        items: [
          { id: 62, displayOrder: 2, values: { role: '' } },
          { id: 61, displayOrder: 1, values: { role: '', employer: '' } },
        ],
      },
    ];
    mocks.section.mockReturnValue({
      id: 20,
      items: [
        { id: 62, displayOrder: 2 },
        { id: 61, displayOrder: 1 },
      ],
    });
    const suggestion: ResumeSuggestion = {
      label: 'Add internship',
      type: SUGGESTION_TYPES.ITEM,
      sectionKey: 'internships',
      scoreValue: 10,
      actionType: SUGGESTION_ACTION_TYPES.ADD_ITEM,
    };

    render(
      <ResumeScoreSuggestionItem suggestion={suggestion} setOpen={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add internship' }));

    expect(mocks.scrollItemIntoView).toHaveBeenCalledWith(61);
    expect(mocks.addItem).not.toHaveBeenCalled();
  });
});
