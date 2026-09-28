import type {
  BuilderDocumentModel,
  SemanticSectionKey,
} from './builderDocument';

export interface ResumeSnapshotItem {
  readonly id: number;
  readonly displayOrder: number;
  readonly values: Readonly<Record<string, string>>;
}

export interface ResumeSnapshotSection {
  readonly id: number;
  readonly sectionKey: SemanticSectionKey;
  readonly title: string;
  readonly displayOrder: number;
  readonly items: readonly ResumeSnapshotItem[];
}

export interface InternshipSectionSnapshot extends ResumeSnapshotSection {
  readonly sectionKey: 'internships';
}

export interface ResumeDocumentSnapshot {
  readonly id: number;
  readonly sections: readonly ResumeSnapshotSection[];
}

/** A derived read of the active document. No editable state is stored here. */
export const createResumeDocumentSnapshot = (
  document: BuilderDocumentModel
): ResumeDocumentSnapshot => ({
  id: document.id,
  sections: document.sections.map((section) => ({
    id: section.id,
    sectionKey: section.sectionKey,
    title: section.title,
    displayOrder: section.displayOrder,
    items: section.items.map((item) => ({
      id: item.id,
      displayOrder: item.displayOrder,
      values: Object.fromEntries(
        item.editableFields
          .filter((field) => !field.isLegacy)
          .map((field) => [field.fieldKey, field.value])
      ),
    })),
  })),
});

export const snapshotSection = (
  snapshot: ResumeDocumentSnapshot | null,
  key: SemanticSectionKey
): ResumeSnapshotSection | undefined =>
  snapshot?.sections.find((section) => section.sectionKey === key);
