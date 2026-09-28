import { describe, expect, it, vi } from 'vitest';
import { getSkillsSectionEntries } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { builderDocumentFixture } from '@/lib/builderDocument/__tests__/builderDocumentFixture';
import { InMemoryDocumentPersistence } from '@/lib/builderDocument/__tests__/inMemoryDocumentPersistence';
import type { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { getDefaultSkillsMetadata } from '@/lib/misc/sectionMetadataTemplates';
import { sectionDefinitions } from '@/lib/sectionDefinitions/sectionDefinitions';
import { BuilderSession } from '../builderSession';
import { FIELD_NAMES } from '../documentBuilder.constants';

describe('BuilderSession', () => {
  it('projects Skills values, order, and render options through the snapshot', async () => {
    const records = builderDocumentFixture();
    const definition = sectionDefinitions.skills;
    const sectionId = 13;
    const session = new BuilderSession({
      persistence: new InMemoryDocumentPersistence({
        ...records,
        sections: [
          ...records.sections,
          {
            id: sectionId,
            documentId: records.document.id,
            type: definition.persistedType,
            title: definition.label,
            defaultTitle: definition.label,
            displayOrder: 4,
            metadata: JSON.stringify([
              { key: 'showExperienceLevel', label: 'Show level', value: '1' },
              { key: 'isCommaSeparated', label: 'Comma separated', value: '1' },
            ]),
          },
        ],
        items: [
          ...records.items,
          { id: 23, sectionId, containerType: 'collapsible', displayOrder: 2 },
          { id: 24, sectionId, containerType: 'collapsible', displayOrder: 1 },
        ],
        fields: [
          ...records.fields,
          ...[24, 23].flatMap((itemId, itemIndex) =>
            Object.values(definition.fields).map(
              (field, fieldIndex) =>
                ({
                  id: 600 + itemIndex * 10 + fieldIndex,
                  itemId,
                  name: field.persistedName,
                  type: field.expectedPersistedType,
                  value:
                    field.key === 'skill'
                      ? itemId === 24
                        ? 'TypeScript'
                        : 'Research'
                      : itemId === 24
                        ? 'Expert'
                        : 'Proficient',
                  ...(field.control === 'select'
                    ? { selectType: 'basic', options: [...field.options] }
                    : {}),
                }) as DEX_Field
            )
          ),
        ],
      }),
    });
    await session.load(records.document.id);

    const skills = session.templateStore.pdfTemplateData.skillsSection;
    expect(skills).toMatchObject({
      sectionKey: 'skills',
      showExperienceLevel: true,
      isCommaSeparated: true,
      items: [
        { id: 24, values: { skill: 'TypeScript', experienceLevel: 'Expert' } },
        {
          id: 23,
          values: { skill: 'Research', experienceLevel: 'Proficient' },
        },
      ],
    });
    expect(skills).toBeDefined();
    if (!skills) {
      throw new Error('Expected the Skills snapshot');
    }
    expect(getSkillsSectionEntries(skills)).toEqual([
      { entryId: '24', name: 'TypeScript', level: 'Expert' },
      { entryId: '23', name: 'Research', level: 'Proficient' },
    ]);
    const scoreWithSkills = session.templateStore.resumeStats.score;
    session.document?.skills?.items.forEach((item) => {
      item.field('skill')?.setDraft('');
    });
    expect(session.templateStore.resumeStats.score).toBe(scoreWithSkills - 8);
    expect(
      session.templateStore.pdfTemplateData.skillsSection?.items.every(
        (item) => item.values.skill === ''
      )
    ).toBe(true);
  });

  it('keeps empty Skills and default options empty in the snapshot and PDF entries', async () => {
    const records = builderDocumentFixture();
    const definition = sectionDefinitions.skills;
    const session = new BuilderSession({
      persistence: new InMemoryDocumentPersistence({
        ...records,
        sections: [
          ...records.sections,
          {
            id: 13,
            documentId: records.document.id,
            type: definition.persistedType,
            title: definition.label,
            defaultTitle: definition.label,
            displayOrder: 4,
            metadata: getDefaultSkillsMetadata(),
          },
        ],
        items: [
          ...records.items,
          {
            id: 23,
            sectionId: 13,
            containerType: 'collapsible',
            displayOrder: 1,
          },
        ],
        fields: [
          ...records.fields,
          ...Object.values(definition.fields).map(
            (field, index) =>
              ({
                id: 700 + index,
                itemId: 23,
                name: field.persistedName,
                type: field.expectedPersistedType,
                value: '',
                ...(field.control === 'select'
                  ? { selectType: 'basic', options: [...field.options] }
                  : {}),
              }) as DEX_Field
          ),
        ],
      }),
    });
    await session.load(records.document.id);

    const skills = session.templateStore.pdfTemplateData.skillsSection;
    expect(skills).toMatchObject({
      sectionKey: 'skills',
      showExperienceLevel: false,
      isCommaSeparated: false,
      items: [{ id: 23, values: { skill: '', experienceLevel: '' } }],
    });
    if (!skills) {
      throw new Error('Expected the Skills snapshot');
    }
    expect(getSkillsSectionEntries(skills)).toEqual([]);
  });

  it('projects Internship values semantically into templates and score', async () => {
    const records = builderDocumentFixture();
    const definition = sectionDefinitions.internships;
    const sectionId = 13;
    const itemId = 23;
    const session = new BuilderSession({
      persistence: new InMemoryDocumentPersistence({
        ...records,
        sections: [
          ...records.sections,
          {
            id: sectionId,
            documentId: records.document.id,
            type: definition.persistedType,
            title: definition.label,
            defaultTitle: definition.label,
            displayOrder: 4,
            metadata: '',
          },
        ],
        items: [
          ...records.items,
          {
            id: itemId,
            sectionId,
            containerType: 'collapsible',
            displayOrder: 1,
          },
        ],
        fields: [
          ...records.fields,
          ...Object.values(definition.fields).map(
            (field, index) =>
              ({
                id: 500 + index,
                itemId,
                name: field.persistedName,
                type: field.expectedPersistedType,
                value:
                  field.key === 'role'
                    ? 'Research Intern'
                    : field.key === 'employer'
                      ? 'Example Lab'
                      : field.key === 'startDate'
                        ? '2024-01'
                        : '',
              }) as DEX_Field
          ),
        ],
      }),
    });
    await session.load(records.document.id);

    const snapshot = session.resumeDocumentSnapshot?.sections.find(
      (section) => section.sectionKey === 'internships'
    );
    expect(snapshot?.items[0]).toMatchObject({
      id: itemId,
      values: {
        role: 'Research Intern',
        employer: 'Example Lab',
        startDate: '2024-01',
      },
    });
    expect(session.templateStore.pdfTemplateData.internshipsSection).toEqual(
      snapshot
    );
    expect(
      session.templateStore.pdfTemplateData.sections.some(
        (section) => section.type === definition.persistedType
      )
    ).toBe(false);
    expect(
      session.templateStore.resumeStats.suggestions.some(
        (suggestion) =>
          suggestion.sectionKey === 'internships' &&
          suggestion.actionType === 'ADD_ITEM'
      )
    ).toBe(false);

    session.document?.internships?.items[0]
      ?.field('role')
      ?.setDraft('Analyst Intern');
    expect(
      session.templateStore.pdfTemplateData.internshipsSection?.items[0]?.values
        .role
    ).toBe('Analyst Intern');
  });

  it('loads, saves, and reloads a supported legacy field without semantic aliasing', async () => {
    const records = builderDocumentFixture();
    const item = records.items.find((entry) => entry.sectionId === 10);
    if (!item) {
      throw new Error('Missing Personal Details item');
    }
    const extra = {
      id: 9001,
      itemId: item.id,
      name: 'Legacy note',
      type: 'string',
      value: 'legacy value',
    } as unknown as DEX_Field;
    const persistence = new InMemoryDocumentPersistence({
      ...records,
      fields: [...records.fields, extra],
    });
    const session = new BuilderSession({ persistence });
    await session.load(records.document.id);
    const legacyField =
      session.document?.personalDetails.items[0]?.editableFields.at(-1);
    expect(legacyField).toMatchObject({
      id: 9001,
      fieldKey: 'legacy:9001',
      value: 'legacy value',
    });
    expect(session.document?.hydrationDiagnostics).toHaveLength(1);
    expect(
      session.resumeDocumentSnapshot?.sections[0]?.items[0]?.values
    ).not.toHaveProperty('legacy:9001');
    expect(
      session.currentStoreProjection.getFieldsByItemId(item.id)
    ).not.toContainEqual(expect.objectContaining({ name: 'Legacy note' }));
    legacyField?.setDraft('saved legacy value');
    expect(await legacyField?.flush()).toBe(true);
    await session.load(records.document.id);
    expect(
      session.document?.personalDetails.items[0]?.editableFields.at(-1)
    ).toMatchObject({
      id: 9001,
      fieldKey: 'legacy:9001',
      value: 'saved legacy value',
    });
    expect(
      session.document?.personalDetails.items[0]?.fields.email.fieldKey
    ).toBe('email');
  });

  it('projects Personal Details, Summary, and ordered Links from semantic fields', async () => {
    const records = builderDocumentFixture();
    const links = sectionDefinitions.websitesSocialLinks;
    const session = new BuilderSession({
      persistence: new InMemoryDocumentPersistence({
        ...records,
        sections: [
          ...records.sections,
          {
            id: 13,
            documentId: records.document.id,
            type: links.persistedType,
            title: 'Profiles',
            defaultTitle: links.label,
            displayOrder: 4,
            metadata: '',
          },
        ],
        items: [
          ...records.items,
          {
            id: 31,
            sectionId: 13,
            containerType: 'collapsible',
            displayOrder: 2,
          },
          {
            id: 30,
            sectionId: 13,
            containerType: 'collapsible',
            displayOrder: 1,
          },
        ],
        fields: [
          ...records.fields,
          {
            id: 301,
            itemId: 31,
            name: 'Label',
            type: 'string',
            value: 'Portfolio',
          },
          {
            id: 302,
            itemId: 31,
            name: 'Link',
            type: 'string',
            value: 'example.com/work',
          },
          { id: 303, itemId: 30, name: 'Label', type: 'string', value: '' },
          {
            id: 304,
            itemId: 30,
            name: 'Link',
            type: 'string',
            value: 'https://www.example.org/about',
          },
        ],
      }),
    });
    await session.load(records.document.id);

    const snapshot = session.resumeDocumentSnapshot;
    expect(snapshot?.sections.map(({ id, title }) => ({ id, title }))).toEqual([
      { id: 10, title: 'Personal Details' },
      { id: 11, title: 'Summary' },
      { id: 12, title: 'Work Experience' },
      { id: 13, title: 'Profiles' },
    ]);
    expect(snapshot?.sections[3].items.map((item) => item.id)).toEqual([
      30, 31,
    ]);
    expect(session.templateStore.pdfTemplateData.personalDetails.links).toEqual(
      [
        {
          entryId: '30',
          label: 'example.org/about',
          link: 'https://www.example.org/about',
        },
        { entryId: '31', label: 'Portfolio', link: 'https://example.com/work' },
      ]
    );

    expect(await session.reorderItems([31, 30])).toBe(true);
    expect(
      session.resumeDocumentSnapshot?.sections[3].items.map((item) => item.id)
    ).toEqual([31, 30]);
    expect(
      session.templateStore.pdfTemplateData.personalDetails.links.map(
        (link) => link.entryId
      )
    ).toEqual(['31', '30']);

    const summary = session.document?.summary.items[0].field('summary');
    summary?.setDraft('One. Two. Three.');
    expect(
      session.resumeDocumentSnapshot?.sections[1].items[0].values.summary
    ).toBe('One. Two. Three.');
    expect(session.templateStore.pdfTemplateData.summarySection.summary).toBe(
      'One. Two. Three.'
    );
    expect(
      session.templateStore.atsCompatibility.checks.find(
        (check) => check.id === 'summary_length'
      )?.pass
    ).toBe(true);

    const email = session.document?.personalDetails.items[0].field('email');
    email?.setDraft('');
    const emailElement = { focus: vi.fn() } as unknown as HTMLElement;
    if (email) {
      session.UIStore.setFieldRef(email.id.toString(), emailElement);
    }
    expect(
      session.UIStore.getFieldRefBySemanticKey('personalDetails', 'email')
    ).toBeDefined();
    expect(session.templateStore.resumeStats.suggestions).toContainEqual(
      expect.objectContaining({
        sectionKey: 'personalDetails',
        fieldKey: 'email',
      })
    );
    expect(
      session.templateStore.atsCompatibility.checks.find(
        (check) => check.id === 'has_email'
      )?.pass
    ).toBe(false);
    session.document?.websitesSocialLinks?.items[0]
      .field('link')
      ?.setDraft('javascript:invalid');
    expect(
      session.templateStore.pdfTemplateData.personalDetails.links
    ).toHaveLength(1);
    session.document?.websitesSocialLinks?.items[1].field('link')?.setDraft('');
    expect(session.templateStore.pdfTemplateData.personalDetails.links).toEqual(
      []
    );
    session.discard();
    expect(session.resumeDocumentSnapshot).toBeNull();
  });

  it('reloads durable state when model construction fails after creation commits', async () => {
    const records = builderDocumentFixture();
    const persistence = new InMemoryDocumentPersistence(records);
    const session = new BuilderSession({ persistence });
    await session.load(records.document.id);
    const originalDocument = session.document;
    const addSection = persistence.addSection.bind(persistence);
    persistence.addSection = async (...args) => {
      const result = await addSection(...args);
      return result.success
        ? { success: true, value: { ...result.value, fields: [] } }
        : result;
    };
    const definition = sectionDefinitions.courses;
    const result = await originalDocument?.addSection({
      type: definition.persistedType,
      title: definition.label,
      defaultTitle: definition.label,
    });
    expect(result).toEqual({ success: false, error: 'Failed to add section' });
    expect(session.state.status).toBe('ready');
    expect(session.document).not.toBe(originalDocument);
    expect(session.document?.courses?.items).toHaveLength(1);
    expect(persistence.records.sections).toHaveLength(
      records.sections.length + 1
    );
  });

  it('does not reopen an old document after a late create failure', async () => {
    const records = builderDocumentFixture();
    const otherDocumentId = records.document.id + 1;
    const otherRecords = {
      ...records,
      document: { ...records.document, id: otherDocumentId },
      sections: records.sections.map((section) => ({
        ...section,
        documentId: otherDocumentId,
      })),
    };
    const persistence = new InMemoryDocumentPersistence(records);
    const load = persistence.load.bind(persistence);
    persistence.load = async (documentId) =>
      documentId === otherDocumentId
        ? { success: true, value: otherRecords }
        : load(documentId);
    const session = new BuilderSession({ persistence });
    await session.load(records.document.id);
    const originalDocument = session.document;
    const addSection = persistence.addSection.bind(persistence);
    let release: (() => void) | undefined;
    persistence.addSection = async (...args) => {
      const result = await addSection(...args);
      await new Promise<void>((resolve) => {
        release = resolve;
      });
      return result.success
        ? { success: true, value: { ...result.value, fields: [] } }
        : result;
    };
    const definition = sectionDefinitions.courses;
    const pending = originalDocument?.addSection({
      type: definition.persistedType,
      title: definition.label,
      defaultTitle: definition.label,
    });
    await vi.waitFor(() => expect(release).toBeDefined());
    await session.load(otherDocumentId);
    const currentDocument = session.document;
    release?.();
    expect(await pending).toEqual({
      success: false,
      error: 'Failed to add section',
    });
    expect(session.document).toBe(currentDocument);
    expect(session.document?.id).toBe(otherDocumentId);
  });

  it('uses one persistence instance for load, field save, and navigation flush', async () => {
    const records = builderDocumentFixture();
    const persistence = new InMemoryDocumentPersistence(records);
    const session = new BuilderSession({ persistence });
    expect((await session.load(records.document.id)).status).toBe('ready');
    const role = session.document?.workExperience.entries[0]?.role;
    if (!role) {
      throw new Error('Expected a role field');
    }
    role.setDraft('Staff Engineer');
    expect(role.value).toBe('Staff Engineer');
    expect(
      persistence.records.fields.find((field) => field.id === role.id)?.value
    ).toBe('value-role');
    expect(await session.prepareNavigation()).toBe(true);
    expect(
      persistence.records.fields.find((field) => field.id === role.id)?.value
    ).toBe('Staff Engineer');
    expect(session.state).toEqual({ status: 'idle' });
  });

  it('keeps a failed flush in the active session for a corrected retry', async () => {
    const records = builderDocumentFixture();
    const persistence = new InMemoryDocumentPersistence(records);
    const session = new BuilderSession({ persistence });
    await session.load(records.document.id);
    const role = session.document?.workExperience.entries[0]?.role;
    if (!role) {
      throw new Error('Expected a role field');
    }
    persistence.saveFailure = new Error('offline');
    role.setDraft('First attempt');
    expect(await session.prepareNavigation()).toBe(false);
    expect(session.document).not.toBeNull();
    expect(role.value).toBe('value-role');
    persistence.saveFailure = null;
    role.setDraft('Second attempt');
    expect(await session.prepareNavigation()).toBe(true);
    expect(
      persistence.records.fields.find((field) => field.id === role.id)?.value
    ).toBe('Second attempt');
  });

  it('atomically publishes one hydrated document and its projection', async () => {
    const records = builderDocumentFixture();
    const session = new BuilderSession({
      persistence: new InMemoryDocumentPersistence({
        document: records.document,
        sections: [...records.sections],
        items: [...records.items],
        fields: [...records.fields],
      }),
    });

    await expect(session.load(records.document.id)).resolves.toMatchObject({
      status: 'ready',
      documentId: records.document.id,
    });
    expect(session.document?.id).toBe(records.document.id);
    expect(session.currentStoreProjection.sections).toHaveLength(
      records.sections.length
    );

    session.discard();
    expect(session.state).toEqual({ status: 'idle' });
    expect(session.currentStoreProjection.sections).toEqual([]);
  });

  it('focuses the semantic initial field for a Work Experience entry', async () => {
    const records = builderDocumentFixture();
    const session = new BuilderSession({
      persistence: new InMemoryDocumentPersistence({
        document: records.document,
        sections: [...records.sections],
        items: [...records.items],
        fields: [...records.fields],
      }),
    });

    await session.load(records.document.id);
    const item = session.document?.workExperience.items[0];
    const role = item?.entry.role;
    if (!item || !role) {
      throw new Error('Expected a Work Experience entry and its role field');
    }

    const roleElement = { focus: vi.fn() } as unknown as HTMLElement;
    session.UIStore.setFieldRef(role.id.toString(), roleElement);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    session.UIStore.focusFirstFieldInItem(item.id);

    expect(roleElement.focus).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });

  it('does not publish a document when hydration fails', async () => {
    const records = builderDocumentFixture();
    const session = new BuilderSession({
      persistence: new InMemoryDocumentPersistence({
        document: records.document,
        sections: [{ ...records.sections[0], id: records.sections[1]?.id }],
        items: [...records.items],
        fields: [...records.fields],
      }),
    });

    await expect(session.load(records.document.id)).resolves.toMatchObject({
      status: 'failed',
    });
    expect(session.document).toBeNull();
    expect(session.currentStoreProjection.sections).toEqual([]);
  });

  it('keeps the generic load failure for malformed Work Experience fields', async () => {
    const records = builderDocumentFixture();
    const session = new BuilderSession({
      persistence: new InMemoryDocumentPersistence({
        document: records.document,
        sections: [...records.sections],
        items: [...records.items],
        fields: records.fields.filter((field) => field.name !== 'Employer'),
      }),
    });

    await expect(session.load(records.document.id)).resolves.toEqual({
      status: 'failed',
      documentId: records.document.id,
      message: 'The document contains records the builder cannot load.',
    });
    expect(session.document).toBeNull();
  });

  it('retains projection, PDF, score, and ATS behavior through the session', async () => {
    const records = builderDocumentFixture();
    const workExperienceItem = records.items.find((item) => item.id === 22);
    if (!workExperienceItem) {
      throw new Error('Expected a Work Experience item');
    }
    const secondWorkExperienceItemId = 23;
    const items = [
      ...records.items,
      {
        ...workExperienceItem,
        id: secondWorkExperienceItemId,
        displayOrder: 2,
      },
    ];
    const fields = [
      ...records.fields,
      ...records.fields
        .filter((field) => field.itemId === workExperienceItem.id)
        .map(
          (field) =>
            ({
              ...field,
              id: field.id + 1_000,
              itemId: secondWorkExperienceItemId,
              value: `second-${field.value}`,
            }) as DEX_Field
        ),
    ];
    const session = new BuilderSession({
      persistence: new InMemoryDocumentPersistence({
        document: records.document,
        sections: [...records.sections],
        items,
        fields,
      }),
    });

    await session.load(records.document.id);

    const personalDetailsItem = session.document?.personalDetails.items[0];
    if (!personalDetailsItem) {
      throw new Error('Expected a Personal Details item');
    }
    expect(
      session.getItemFieldValue(
        personalDetailsItem.id,
        FIELD_NAMES.PERSONAL_DETAILS.FIRST_NAME
      )
    ).toBe('value-firstName');
    expect(session.templateStore.pdfTemplateData.personalDetails).toMatchObject(
      {
        firstName: 'value-firstName',
        lastName: 'value-lastName',
        jobTitle: 'value-wantedJobTitle',
        email: 'value-email',
      }
    );
    expect(session.templateStore.pdfTemplateData.workExperienceSection).toEqual(
      {
        id: 12,
        title: 'Work Experience',
        displayOrder: 3,
        entries: [
          {
            entryId: '22',
            role: 'value-role',
            employer: 'value-employer',
            startDate: 'value-startDate',
            endDate: 'value-endDate',
            city: 'value-city',
            description: 'value-description',
          },
          {
            entryId: '23',
            role: 'second-value-role',
            employer: 'second-value-employer',
            startDate: 'second-value-startDate',
            endDate: 'second-value-endDate',
            city: 'second-value-city',
            description: 'second-value-description',
          },
        ],
      }
    );
    expect(session.templateStore.pdfTemplateData.sections).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'work-experience' }),
      ])
    );
    expect(session.templateStore.resumeStats.score).toBeGreaterThan(0);
    expect(session.templateStore.atsCompatibility.totalCount).toBe(6);

    const firstNameField = personalDetailsItem.field('firstName');
    if (!firstNameField) {
      throw new Error('Expected a first-name field');
    }
    firstNameField.setDraft('Grace');
    expect(
      session.currentStoreProjection
        .getFieldsByItemId(personalDetailsItem.id)
        .find((field) => field.id === firstNameField.id)?.value
    ).toBe('Grace');

    const firstEditableField = personalDetailsItem.editableFields[0];
    if (!firstEditableField) {
      throw new Error('Expected an editable field');
    }
    const fieldElement = { focus: vi.fn() } as unknown as HTMLElement;
    session.UIStore.setFieldRef(firstEditableField.id.toString(), fieldElement);
    const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal('requestAnimationFrame', requestAnimationFrame);
    session.UIStore.focusFirstFieldInItem(personalDetailsItem.id);
    expect(fieldElement.focus).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });

  it('derives Work Experience score and ATS feedback from semantic entries', async () => {
    vi.useFakeTimers();
    const records = builderDocumentFixture();
    const workExperienceSection = records.sections.find(
      (section) => section.type === 'work-experience'
    );
    if (!workExperienceSection) {
      throw new Error('Expected a Work Experience section');
    }
    const workExperienceItemIds = new Set(
      records.items
        .filter((item) => item.sectionId === workExperienceSection.id)
        .map((item) => item.id)
    );
    const session = new BuilderSession({
      persistence: new InMemoryDocumentPersistence({
        document: records.document,
        sections: [...records.sections],
        items: [...records.items],
        fields: records.fields.map((field) =>
          workExperienceItemIds.has(field.itemId)
            ? ({ ...field, value: '' } as DEX_Field)
            : field
        ),
      }),
    });

    try {
      await session.load(records.document.id);
      await vi.advanceTimersByTimeAsync(500);

      const entry = session.document?.workExperience.entries[0];
      if (!entry) {
        throw new Error('Expected a Work Experience entry');
      }

      const initialScore = session.templateStore.debouncedResumeStats.score;
      expect(
        session.templateStore.debouncedResumeStats.suggestions
      ).toContainEqual(
        expect.objectContaining({ label: 'Add work experience' })
      );
      entry.description.setDraft('<ul><li>Increased revenue by 20%</li></ul>');
      await vi.advanceTimersByTimeAsync(500);

      expect(session.templateStore.debouncedResumeStats.score).toBeGreaterThan(
        initialScore
      );
      expect(
        session.templateStore.debouncedResumeStats.suggestions
      ).not.toContainEqual(
        expect.objectContaining({ label: 'Add work experience' })
      );
      expect(session.templateStore.debouncedATSCompatibility.checks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'work_experience_bullets',
            pass: true,
          }),
          expect.objectContaining({
            id: 'quantified_achievements',
            pass: true,
          }),
        ])
      );
    } finally {
      vi.useRealTimers();
    }
  });
});
