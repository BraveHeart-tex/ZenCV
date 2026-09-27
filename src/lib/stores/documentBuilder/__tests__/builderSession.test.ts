import { describe, expect, it, vi } from 'vitest';
import { builderDocumentFixture } from '@/lib/builderDocument/__tests__/builderDocumentFixture';
import { InMemoryDocumentPersistence } from '@/lib/builderDocument/__tests__/inMemoryDocumentPersistence';
import type { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { sectionDefinitions } from '@/lib/sectionDefinitions/sectionDefinitions';
import { BuilderSession } from '../builderSession';
import { FIELD_NAMES } from '../documentBuilder.constants';

describe('BuilderSession', () => {
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
