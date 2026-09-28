import { CHECKED_METADATA_VALUE } from '@/lib/constants';
import { SECTION_METADATA_KEYS } from '@/lib/stores/documentBuilder/documentBuilder.constants';
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
  readonly hideReferences?: boolean;
}

export interface SkillsSectionSnapshot extends ResumeSnapshotSection {
  readonly sectionKey: 'skills';
  readonly showExperienceLevel: boolean;
  readonly isCommaSeparated: boolean;
}

export interface InternshipSectionSnapshot extends ResumeSnapshotSection {
  readonly sectionKey: 'internships';
}

export interface ReferencesSectionSnapshot extends ResumeSnapshotSection {
  readonly sectionKey: 'references';
  readonly hideReferences: boolean;
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
    ...(section.sectionKey === 'skills'
      ? {
          showExperienceLevel:
            section.metadata.find(
              (option) =>
                option.key ===
                SECTION_METADATA_KEYS.SKILLS.SHOW_EXPERIENCE_LEVEL
            )?.value === CHECKED_METADATA_VALUE,
          isCommaSeparated:
            section.metadata.find(
              (option) =>
                option.key === SECTION_METADATA_KEYS.SKILLS.IS_COMMA_SEPARATED
            )?.value === CHECKED_METADATA_VALUE,
        }
      : {}),
    ...(section.sectionKey === 'references'
      ? {
          hideReferences:
            section.metadata.find(
              (option) =>
                option.key === SECTION_METADATA_KEYS.REFERENCES.HIDE_REFERENCES
            )?.value === CHECKED_METADATA_VALUE,
        }
      : {}),
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

export const isSkillsSectionSnapshot = (
  section: ResumeSnapshotSection
): section is SkillsSectionSnapshot => section.sectionKey === 'skills';

export const snapshotSection = (
  snapshot: ResumeDocumentSnapshot | null,
  key: SemanticSectionKey
): ResumeSnapshotSection | undefined =>
  snapshot?.sections.find((section) => section.sectionKey === key);
