import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  DocumentBuilderStore,
  TOGGLE_ITEM_WAIT_MS,
} from '../documentBuilderStore';
import {
  addItemFromTemplate,
  bulkUpdateItems,
  bulkUpdateSections,
  deleteItem,
  deleteSection,
  getFullDocumentStructure,
  renameDocument,
  updateField,
  updateSection,
} from '@/lib/service';
import {
  FIELD_NAMES,
  INTERNAL_SECTION_TYPES,
  SECTION_METADATA_KEYS,
} from '../constants';
import { CONTAINER_TYPES, FIELD_TYPES } from '../schema';
import { getItemInsertTemplate } from '../helpers';
import { ParsedSectionMetadata, SectionMetadataKey } from '../types';

// Mock external services
vi.mock('@/lib/service');
vi.mock('@/lib/helpers');

// Alias for mocked service functions
const mockedGetFullDocumentStructure = vi.mocked(
  getFullDocumentStructure,
  true,
);

const mockedRenameDocument = vi.mocked(renameDocument);
const mockedUpdateField = vi.mocked(updateField);
const mockedUpdateSection = vi.mocked(updateSection);
const mockedDeleteSection = vi.mocked(deleteSection);
const mockedDeleteItem = vi.mocked(deleteItem);

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
    type: INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
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
    name: FIELD_NAMES.WORK_EXPERIENCE.JOB_TITLE,
    type: FIELD_TYPES.STRING,
  },
];

const sectionsWithMockMetadata = [
  {
    ...mockSections[0],
    metadata: [
      {
        key: SECTION_METADATA_KEYS.REFERENCES.HIDE_REFERENCES,
        value: 'test-value-1',
        label: 'Test Label 1',
      },
      {
        key: SECTION_METADATA_KEYS.SKILLS.SHOW_EXPERIENCE_LEVEL,
        value: 'test-value-2',
        label: 'Test Label 2',
      },
    ],
  },
  {
    ...mockSections[1],
    metadata: [],
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
  vi.clearAllMocks();
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
  describe('renameDocument', () => {
    it('should rename the document title', async () => {
      // Arrange
      store.document = {
        id: 1,
        title: 'Old Title',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newTitle = 'New Title';

      // Act
      await store.renameDocument(newTitle);

      // Assert
      expect(mockedRenameDocument).toHaveBeenCalledWith(1, newTitle);
      expect(store.document.title).toBe(newTitle);
    });
    it('should not call renameDocument service if document is null', async () => {
      // Arrange
      store.document = null;
      const newTitle = 'New Title';

      // Act
      await store.renameDocument(newTitle);

      // Assert
      expect(mockedRenameDocument).not.toHaveBeenCalled();
    });
    it('should handle empty title gracefully', async () => {
      // Arrange
      store.document = {
        id: 1,
        title: 'Old Title',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newTitle = '';

      // Act
      await store.renameDocument(newTitle);

      // Assert
      expect(mockedRenameDocument).toHaveBeenCalledWith(1, newTitle);
      expect(store.document.title).toBe(newTitle);
    });
  });
  describe('setFieldValue', async () => {
    beforeEach(() => {
      store.fields = mockFields;
    });
    it('should update the field value in state', async () => {
      const newValue = 'new value';
      const fieldId = 1;
      await store.setFieldValue(fieldId, newValue, false);

      expect(store.fields.find((field) => field.id === fieldId)?.value).toBe(
        newValue,
      );

      expect(mockedUpdateField).not.toHaveBeenCalled();
    });
    it('should not update a non-existent field', async () => {
      const initialFields = [...store.fields];

      await store.setFieldValue(999, 'New Value', false);

      expect(store.fields).toEqual(initialFields);
      expect(mockedUpdateField).not.toHaveBeenCalled();
    });
    it('should handle invalid fieldId gracefully', async () => {
      const result = await store.setFieldValue(
        null as never,
        'New Value',
        true,
      );

      expect(result).toBeUndefined();
      expect(mockedUpdateField).not.toHaveBeenCalled();
    });
  });
  describe('removeSection', () => {
    beforeEach(() => {
      store.sections = mockSections.map((section) => ({
        ...section,
        metadata: [],
      }));
      store.items = mockItems;
      store.fields = mockFields;
    });
    it('should remove the section, its items, and associated fields', async () => {
      const sectionIdToDelete = mockSections[0]?.id;
      // Act
      await store.removeSection(sectionIdToDelete);

      const newSections = store.sections.filter(
        (section) => section.id !== sectionIdToDelete,
      );
      const newItems = store.items.filter(
        (item) => item.sectionId !== sectionIdToDelete,
      );
      const newItemIds = newItems.map((item) => item.id);
      const newFields = store.fields.filter((field) =>
        newItemIds.includes(field.itemId),
      );

      // Assert
      expect(store.sections).toEqual(newSections);
      expect(store.items).toEqual(newItems);
      expect(store.fields).toEqual(newFields);
      expect(mockedDeleteSection).toHaveBeenCalledTimes(1);
      expect(mockedDeleteSection).toHaveBeenCalledWith(sectionIdToDelete);
    });
  });
  describe('renameSection', () => {
    beforeEach(() => {
      store.sections = mockSections.map((section) => ({
        ...section,
        metadata: [],
      }));
    });
    it('should update the section title', async () => {
      const newTitle = 'New Title';
      const sectionId = mockSections[0].id;

      await store.renameSection(sectionId, newTitle);
      expect(
        store.sections.find((section) => section.id === sectionId)?.title,
      ).toBe(newTitle);
      expect(mockedUpdateSection).toHaveBeenCalledWith(sectionId, {
        title: newTitle,
      });
    });
    it('should handle invalid sectionId gracefully', async () => {
      const newTitle = 'New Title';
      const invalidSectionId = 999;
      const initialSections = [...store.sections];

      await store.renameSection(invalidSectionId, newTitle);

      expect(store.sections).toEqual(initialSections);
      expect(mockedUpdateSection).not.toHaveBeenCalled();
    });
  });
  describe('toggleItem', () => {
    beforeEach(() => {
      store.collapsedItemId = null;
    });
    it('should toggle the collapsedItemId', () => {
      const itemId = 1;
      store.toggleItem(itemId);
      expect(store.collapsedItemId).toBe(itemId);
      store.toggleItem(itemId);
      expect(store.collapsedItemId).toBeNull();
    });
  });
  describe('removeItem', () => {
    beforeEach(() => {
      store.items = mockItems;
      store.fields = mockFields;
    });
    it('should remove the item and its associated fields', async () => {
      const itemIdToDelete = mockItems[0].id;

      await store.removeItem(itemIdToDelete);

      const newItems = store.items.filter((item) => item.id !== itemIdToDelete);
      const newFields = store.fields.filter(
        (field) => field.itemId !== itemIdToDelete,
      );

      expect(store.items).toEqual(newItems);
      expect(store.fields).toEqual(newFields);
    });
    it('should call deleteItem with the correct itemId', async () => {
      const itemIdToDelete = mockItems[0].id;
      await store.removeItem(itemIdToDelete);

      expect(mockedDeleteItem).toHaveBeenCalledTimes(1);
      expect(mockedDeleteItem).toHaveBeenCalledWith(itemIdToDelete);
    });
    it('should handle non-existent itemId gracefully', async () => {
      const result = await store.removeItem(999);

      expect(result).toBe(undefined);
      expect(store.items).toHaveLength(mockItems.length);
      expect(store.fields).toHaveLength(mockFields.length);
      expect(mockedDeleteItem).not.toHaveBeenCalled();
    });
    it('should handle an empty store gracefully', async () => {
      store.items = [];
      store.fields = [];

      const result = await store.removeItem(1);

      expect(result).toBe(undefined);
      expect(store.items).toEqual([]);
      expect(store.fields).toEqual([]);
      expect(mockedDeleteItem).not.toHaveBeenCalled();
    });
  });
  describe('addNewItemEntry', () => {
    const mockTemplate = {
      containerType: CONTAINER_TYPES.COLLAPSIBLE,
      displayOrder: 1,
      fields: [
        {
          name: FIELD_NAMES.WORK_EXPERIENCE.JOB_TITLE,
          type: FIELD_TYPES.STRING,
          value: '',
        },
      ],
    };

    const mockAddItemResult = {
      item: {
        id: 3,
        sectionId: 1,
        displayOrder: 3,
        containerType: CONTAINER_TYPES.COLLAPSIBLE,
      },
      fields: [
        {
          id: 2,
          itemId: 3,
          value: '',
          name: FIELD_NAMES.WORK_EXPERIENCE.JOB_TITLE,
          type: FIELD_TYPES.STRING,
        },
      ],
    };

    beforeEach(() => {
      store.sections = mockSections.map((section) => ({
        ...section,
        metadata: [],
      }));
      store.items = mockItems;
      store.fields = mockFields;

      vi.mocked(getItemInsertTemplate).mockReturnValue(mockTemplate);
      vi.mocked(addItemFromTemplate).mockResolvedValue(mockAddItemResult);
    });

    it('should add a new item and its fields to the store', async () => {
      vi.useFakeTimers();

      const sectionId = mockSections[0].id;
      await store.addNewItemEntry(sectionId);

      expect(store.items.map((item) => item.id)).toContain(
        mockAddItemResult.item.id,
      );
      expect(store.fields).toContainEqual(mockAddItemResult.fields[0]);
      vi.advanceTimersByTime(TOGGLE_ITEM_WAIT_MS);
      expect(store.collapsedItemId).toBe(mockAddItemResult.item.id);
    });

    it('should handle non-existent section ID gracefully', async () => {
      const result = await store.addNewItemEntry(999);

      expect(result).toBeUndefined();
      expect(store.items).toHaveLength(mockItems.length);
      expect(store.fields).toHaveLength(mockFields.length);
      expect(vi.mocked(getItemInsertTemplate)).not.toHaveBeenCalled();
      expect(vi.mocked(addItemFromTemplate)).not.toHaveBeenCalled();
    });

    it('should handle template retrieval failure gracefully', async () => {
      vi.mocked(getItemInsertTemplate).mockReturnValue(null as never);

      const result = await store.addNewItemEntry(mockSections[0].id);

      expect(result).toBeUndefined();
      expect(store.items).toHaveLength(mockItems.length);
      expect(store.fields).toHaveLength(mockFields.length);
      expect(vi.mocked(addItemFromTemplate)).not.toHaveBeenCalled();
    });

    it('should calculate correct display order for new item', async () => {
      const sectionId = mockSections[0].id;
      const highestDisplayOrder = Math.max(
        ...mockItems.map((item) => item.displayOrder),
      );

      await store.addNewItemEntry(sectionId);

      expect(vi.mocked(addItemFromTemplate)).toHaveBeenCalledWith(
        expect.objectContaining({
          displayOrder: highestDisplayOrder,
        }),
      );
    });
  });
  describe('reOrderSectionItems', () => {
    beforeEach(() => {
      store.items = mockItems;
    });

    it('should update item display orders and call bulkUpdateItems', async () => {
      const newOrder = mockItems.slice().reverse();

      await store.reOrderSectionItems(newOrder);

      const firstItem = store.items.find((item) => item.id === newOrder[0].id);

      expect(firstItem?.displayOrder).toBe(1);
      expect(vi.mocked(bulkUpdateItems)).toHaveBeenCalledWith(
        newOrder.map((item, index) => ({
          key: item.id,
          changes: { displayOrder: index + 1 },
        })),
      );
    });

    it('should handle an empty input array gracefully', async () => {
      await store.reOrderSectionItems([]);

      expect(store.items).toHaveLength(mockItems.length);
      expect(vi.mocked(bulkUpdateItems)).not.toHaveBeenCalled();
    });

    it('should not call bulkUpdateItems if all displayOrders are unchanged', async () => {
      await store.reOrderSectionItems(mockItems);

      expect(vi.mocked(bulkUpdateItems)).not.toHaveBeenCalled();
    });

    it('should not throw an error if bulkUpdateItems fails', async () => {
      const newOrder = mockItems.slice().reverse();

      vi.mocked(bulkUpdateItems).mockRejectedValue(
        new Error('Failed to update items'),
      );

      await store.reOrderSectionItems(newOrder);

      const firstItem = store.items.find((item) => item.id === newOrder[0].id);

      expect(firstItem?.displayOrder).toBe(1);
    });
  });
  describe('reOrderSections', () => {
    beforeEach(() => {
      store.sections = mockSections.map((section) => ({
        ...section,
        metadata: [],
      }));
    });

    it('should update section display orders and call bulkUpdateSections', async () => {
      const newOrder = store.sections.slice().reverse();

      await store.reOrderSections(newOrder);

      const firstSection = store.sections.find(
        (section) => section.id === newOrder[0].id,
      );
      expect(firstSection?.displayOrder).toBe(1);
      expect(vi.mocked(bulkUpdateSections)).toHaveBeenCalledWith(
        newOrder.map((section, index) => ({
          key: section.id,
          changes: { displayOrder: index + 1 },
        })),
      );
    });

    it('should not update sections with unchanged display orders', async () => {
      const originalOrder = store.sections;
      const newOrder = [...originalOrder];

      await store.reOrderSections(newOrder);

      expect(vi.mocked(bulkUpdateSections)).not.toHaveBeenCalled();
      expect(store.sections).toEqual(originalOrder);
    });

    it('should handle an empty input array gracefully', async () => {
      await store.reOrderSections([]);

      expect(store.sections).toHaveLength(mockSections.length);
      expect(vi.mocked(bulkUpdateSections)).not.toHaveBeenCalled();
    });
  });
  describe('resetState', () => {
    it('should reset the store to its initial state', () => {
      store.document = {
        id: 1,
        title: 'Test Document',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.sections = mockSections.map((section) => ({
        ...section,
        metadata: [],
      }));
      store.items = mockItems;
      store.fields = mockFields;
      store.collapsedItemId = 1;
      store.resetState();

      expect(store.document).toBeNull();
      expect(store.sections).toEqual([]);
      expect(store.items).toEqual([]);
      expect(store.fields).toEqual([]);
      expect(store.collapsedItemId).toEqual(null);
    });
  });
  describe('getSectionMetadataOptions', () => {
    beforeEach(() => {
      store.sections = sectionsWithMockMetadata;
    });

    it('should return metadata options for a section with metadata', () => {
      const sectionId = sectionsWithMockMetadata[0].id;
      const result = store.getSectionMetadataOptions(sectionId);

      expect(result).toHaveLength(2);
      expect(result).toEqual(sectionsWithMockMetadata[0]?.metadata);
      expect(result).toSatisfy((result: ParsedSectionMetadata[]) =>
        result.every(
          (option) =>
            typeof option.key === 'string' &&
            typeof option.value === 'string' &&
            typeof option.label === 'string',
        ),
      );
    });

    it('should return empty array for a section without metadata', () => {
      const sectionId = mockSections[1].id;
      const result = store.getSectionMetadataOptions(sectionId);

      expect(result).toEqual([]);
    });

    it('should return empty array for a non-existent section', () => {
      const result = store.getSectionMetadataOptions(999);

      expect(result).toEqual([]);
    });

    it('should handle null metadata gracefully', () => {
      store.sections = [
        {
          ...mockSections[0],
          metadata: null as never,
        },
      ];

      const result = store.getSectionMetadataOptions(mockSections[0].id);

      expect(result).toEqual([]);
    });
  });
  describe('updateSectionMetadata', () => {
    beforeEach(() => {
      store.sections = sectionsWithMockMetadata;
    });

    it('should update metadata value and call updateSection', async () => {
      const sectionId = sectionsWithMockMetadata[0].id;
      const data = {
        key: SECTION_METADATA_KEYS.REFERENCES.HIDE_REFERENCES,
        value: '1',
      };

      await store.updateSectionMetadata(sectionId, data);

      const section = store.sections.find(
        (section) => section.id === sectionId,
      );
      const updatedMetadata = section?.metadata.find(
        (metadata) => metadata.key === data.key,
      );

      expect(updatedMetadata?.value).toBe(data.value);
      expect(mockedUpdateSection).toHaveBeenCalledWith(sectionId, {
        metadata: JSON.stringify(
          section?.metadata.map((metadata) => ({
            ...metadata,
            value: metadata.key === data.key ? data.value : metadata.value,
          })),
        ),
      });
    });

    it('should handle non-existent section gracefully', async () => {
      const data = {
        key: SECTION_METADATA_KEYS.REFERENCES.HIDE_REFERENCES,
        value: '1',
      };

      const result = await store.updateSectionMetadata(999, data);

      expect(result).toBeUndefined();
      expect(mockedUpdateSection).not.toHaveBeenCalled();
    });

    it('should handle non-existent metadata key gracefully', async () => {
      const sectionId = sectionsWithMockMetadata[0].id;
      const data = {
        key: 'non-existent-key' as SectionMetadataKey,
        value: '1',
      };

      await store.updateSectionMetadata(sectionId, data);

      const section = store.sections.find(
        (section) => section.id === sectionId,
      );
      expect(section?.metadata).toEqual(sectionsWithMockMetadata[0].metadata);
      expect(mockedUpdateSection).toHaveBeenCalledWith(sectionId, {
        metadata: JSON.stringify(section?.metadata),
      });
    });
  });
});
