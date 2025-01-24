import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DocumentBuilderStore } from '../documentBuilderStore';
import { getFullDocumentStructure } from '@/lib/service';
import { FIELD_NAMES, INTERNAL_SECTION_TYPES } from '../constants';
import { CONTAINER_TYPES, FIELD_TYPES } from '../schema';

// Mock external services
vi.mock('@/lib/service');
vi.mock('@/lib/helpers');

// Alias for mocked service functions
const mockedGetFullDocumentStructure = vi.mocked(
  getFullDocumentStructure,
  true,
);

// const mockedRenameDocument = vi.mocked(renameDocument);
// const mockedUpdateField = vi.mocked(updateField);

let store: DocumentBuilderStore;

// Mock data for tests
const mockDocument = {
  id: 1,
  title: 'Test Document',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockSections = [
  {
    id: 1,
    displayOrder: 1,
    metadata: '[]',
    documentId: 1,
    type: INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
    defaultTitle: 'Section 1',
    title: 'Section 1',
  },
  {
    id: 2,
    displayOrder: 2,
    metadata: '[]',
    documentId: 1,
    type: INTERNAL_SECTION_TYPES.EMPLOYMENT_HISTORY,
    defaultTitle: 'Section 1',
    title: 'Section 1',
  },
];

const mockItems = [
  {
    id: 1,
    sectionId: 1,
    displayOrder: 1,
    containerType: CONTAINER_TYPES.COLLAPSIBLE,
  },
  {
    id: 2,
    sectionId: 2,
    displayOrder: 2,
    containerType: CONTAINER_TYPES.COLLAPSIBLE,
  },
];

const mockFields = [
  {
    id: 1,
    itemId: 1,
    value: 'Test Field',
    name: FIELD_NAMES.EMPLOYMENT_HISTORY.JOB_TITLE,
    type: FIELD_TYPES.STRING,
  },
];

const mockSuccessResponse = {
  success: true as const,
  document: mockDocument,
  sections: mockSections,
  items: mockItems,
  fields: mockFields,
};

// Helper function for mocking getFullDocumentStructure
const mockGetFullDocumentStructure = (
  response: Awaited<ReturnType<typeof getFullDocumentStructure>>,
) => {
  mockedGetFullDocumentStructure.mockResolvedValueOnce(response);
};

// Reusable assertions
const expectStoreToMatchMockData = () => {
  expect(store.document).toEqual(mockDocument);
  expect(store.sections).toHaveLength(mockSections.length);
  expect(store.items).toHaveLength(mockItems.length);
  expect(store.fields).toHaveLength(mockFields.length);
};

beforeEach(() => {
  store = new DocumentBuilderStore();
});

describe('DocumentBuilderStore', () => {
  describe('initializeStore', () => {
    it('should populate the store with fetched data when initialization is successful', async () => {
      mockGetFullDocumentStructure(mockSuccessResponse);

      await store.initializeStore(1);

      expectStoreToMatchMockData();
    });

    it('should handle initialization failure gracefully', async () => {
      mockGetFullDocumentStructure({
        success: false,
        error: 'Failed to load',
      });

      const result = await store.initializeStore(1);

      expect(result?.error).toBe('Failed to load');
      expect(store.document).toBeNull();
      expect(store.sections).toHaveLength(0);
      expect(store.items).toHaveLength(0);
      expect(store.fields).toHaveLength(0);
    });
  });
});
