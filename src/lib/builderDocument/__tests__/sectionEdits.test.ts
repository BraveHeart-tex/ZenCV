import { describe, expect, it } from 'vitest';
import type { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { getItemInsertTemplate } from '@/lib/helpers/documentBuilderHelpers';
import { getDefaultSkillsMetadata } from '@/lib/misc/sectionMetadataTemplates';
import { sectionDefinitions } from '@/lib/sectionDefinitions/sectionDefinitions';
import { hydrateBuilderDocument } from '../builderDocument';
import { builderDocumentFixture } from './builderDocumentFixture';
import { InMemoryDocumentPersistence } from './inMemoryDocumentPersistence';

const setup = () => {
  const records = builderDocumentFixture();
  const definition = sectionDefinitions.skills;
  const template = getItemInsertTemplate(definition.persistedType);
  if (!template) {
    throw new Error('Missing skills template');
  }
  const metadata = getDefaultSkillsMetadata();
  const skillsSection = {
    id: 50,
    documentId: records.document.id,
    title: 'Skills',
    defaultTitle: 'Skills',
    type: definition.persistedType,
    displayOrder: 4,
    metadata,
  } as const;
  const skillsItem = {
    id: 60,
    sectionId: 50,
    containerType: template.containerType,
    displayOrder: 1,
  } as const;
  const skillsFields = template.fields.map(
    (field, index) =>
      ({
        ...field,
        id: 600 + index,
        itemId: 60,
      }) as DEX_Field
  );
  const seededRecords = {
    ...records,
    sections: [...records.sections, skillsSection],
    items: [...records.items, skillsItem],
    fields: [...records.fields, ...skillsFields],
  };
  const persistence = new InMemoryDocumentPersistence(seededRecords);
  const hydrated = hydrateBuilderDocument(seededRecords, persistence);
  if (!hydrated.success) {
    throw new Error('Invalid skills fixture');
  }
  return { document: hydrated.document, persistence, metadata };
};

describe('Builder Document section edits', () => {
  it('saves titles and metadata through the injected persistence boundary', async () => {
    const { document, persistence } = setup();
    const section = document.skills;
    if (!section) {
      throw new Error('Missing skills section');
    }
    expect(await document.renameSection(section.id, 'Core Skills')).toEqual({
      success: true,
    });
    expect(
      await document.updateSectionMetadata(
        section.id,
        'showExperienceLevel',
        '1'
      )
    ).toEqual({ success: true });
    expect(document.skills).toBe(section);
    expect(section.title).toBe('Core Skills');
    expect(
      persistence.records.sections.find((entry) => entry.id === section.id)
    ).toMatchObject({
      title: 'Core Skills',
      metadata: JSON.stringify(section.metadata),
    });
  });

  it('rejects invalid values and restores the same section on missing or failed writes', async () => {
    const { document, persistence, metadata } = setup();
    const section = document.skills;
    if (!section) {
      throw new Error('Missing skills section');
    }
    const metadataEntry = section.metadata[0];
    expect(
      (
        await document.updateSectionMetadata(
          section.id,
          'showExperienceLevel',
          'bad'
        )
      ).success
    ).toBe(false);
    expect((await document.renameSection(section.id, '   ')).success).toBe(
      false
    );

    const storedSection = persistence.records.sections.find(
      (entry) => entry.id === section.id
    );
    if (!storedSection) {
      throw new Error('Missing stored skills section');
    }
    storedSection.documentId = 99;
    expect((await document.renameSection(section.id, 'Lost')).success).toBe(
      false
    );
    expect(
      (
        await document.updateSectionMetadata(
          section.id,
          'showExperienceLevel',
          '1'
        )
      ).success
    ).toBe(false);
    expect(section.title).toBe('Skills');
    expect(section.metadata[0]).toBe(metadataEntry);
    expect(section.metadata[0].value).toBe('0');
    expect(document.skills).toBe(section);

    storedSection.documentId = document.id;
    persistence.saveFailure = new Error('offline');
    expect((await document.renameSection(section.id, 'Offline')).success).toBe(
      false
    );
    expect(
      (
        await document.updateSectionMetadata(
          section.id,
          'showExperienceLevel',
          '1'
        )
      ).success
    ).toBe(false);
    expect(section.title).toBe('Skills');
    expect(
      persistence.records.sections.find((entry) => entry.id === section.id)
        ?.metadata
    ).toBe(metadata);
  });
});
