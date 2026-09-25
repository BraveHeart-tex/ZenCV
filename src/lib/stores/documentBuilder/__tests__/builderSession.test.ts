import { describe, expect, it, vi } from 'vitest';
import { builderDocumentFixture } from '@/lib/builderDocument/__tests__/builderDocumentFixture';
import { BuilderSession } from '../builderSession';
import { FIELD_NAMES } from '../documentBuilder.constants';

describe('BuilderSession', () => {
  it('atomically publishes one hydrated document and its projection', async () => {
    const records = builderDocumentFixture();
    const session = new BuilderSession({
      loadRecords: async () => ({
        success: true,
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
      loadRecords: async () => ({
        success: true,
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
      loadRecords: async () => ({
        success: true,
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
      loadRecords: async () => ({
        success: true,
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
    const session = new BuilderSession({
      loadRecords: async () => ({
        success: true,
        document: records.document,
        sections: [...records.sections],
        items: [...records.items],
        fields: [...records.fields],
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
});
