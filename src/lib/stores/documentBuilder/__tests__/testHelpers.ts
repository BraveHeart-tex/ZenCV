import type { OtherSectionOption } from '@/components/documentBuilder/AddSectionWidget';
import type {
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import { CONTAINER_TYPES, FIELD_TYPES } from '@/lib/client-db/clientDbSchema';
import { serializeTemplateSettings } from '@/lib/constants/accentColors';
import type {
  FieldName,
  ResumeTemplate,
  TemplatedSectionType,
} from '@/lib/types/documentBuilder.types';
import { BuilderRootStore } from '../builderRootStore';
import {
  FIELD_NAMES,
  INTERNAL_SECTION_TYPES,
  INTERNAL_TEMPLATE_TYPES,
  SECTION_METADATA_KEYS,
} from '../documentBuilder.constants';

export const createTestRootStore = () => new BuilderRootStore();

export const buildDocument = (
  overrides: Partial<DEX_Document> = {}
): DEX_Document => ({
  id: 1,
  title: 'Resume',
  templateType: INTERNAL_TEMPLATE_TYPES.MANHATTAN,
  templateSettings: serializeTemplateSettings({}),
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  jobPostingId: null,
  ...overrides,
});

export const buildSection = (
  overrides: Partial<DEX_Section> = {}
): DEX_Section => ({
  id: 10,
  documentId: 1,
  title: 'Work Experience',
  defaultTitle: 'Work Experience',
  type: INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
  displayOrder: 1,
  metadata: '',
  ...overrides,
});

export const buildParsedSection = (overrides: Partial<DEX_Section> = {}) => ({
  ...buildSection(overrides),
  metadata: overrides.metadata
    ? JSON.parse(overrides.metadata)
    : [
        {
          key: SECTION_METADATA_KEYS.SKILLS.SHOW_EXPERIENCE_LEVEL,
          label: 'Show level',
          value: '1',
        },
      ],
});

export const buildItem = (overrides: Partial<DEX_Item> = {}): DEX_Item => ({
  id: 100,
  sectionId: 10,
  containerType: CONTAINER_TYPES.COLLAPSIBLE,
  displayOrder: 1,
  ...overrides,
});

export const buildField = (
  overrides: Partial<Omit<DEX_Field, 'name' | 'value'>> & {
    name?: FieldName;
    value?: string;
  } = {}
): DEX_Field =>
  ({
    id: 1000,
    itemId: 100,
    name: FIELD_NAMES.WORK_EXPERIENCE.DESCRIPTION,
    type: FIELD_TYPES.RICH_TEXT,
    value: '',
    ...overrides,
  }) as DEX_Field;

export const hydrateBasicResume = (root = createTestRootStore()) => {
  const document = buildDocument({
    templateType: INTERNAL_TEMPLATE_TYPES.TOKYO,
    templateSettings: serializeTemplateSettings({
      [INTERNAL_TEMPLATE_TYPES.TOKYO as ResumeTemplate]: {
        accentColor: '#10b981',
      },
    }),
    jobPostingId: null,
  });

  const sections = [
    buildSection({
      id: 1,
      title: 'Personal Details',
      defaultTitle: 'Personal Details',
      type: INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
      displayOrder: 1,
    }),
    buildSection({
      id: 2,
      title: 'Summary',
      defaultTitle: 'Summary',
      type: INTERNAL_SECTION_TYPES.SUMMARY,
      displayOrder: 2,
    }),
    buildSection({
      id: 3,
      title: 'Work Experience',
      defaultTitle: 'Work Experience',
      type: INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
      displayOrder: 3,
    }),
    buildSection({
      id: 4,
      title: 'Skills',
      defaultTitle: 'Skills',
      type: INTERNAL_SECTION_TYPES.SKILLS,
      displayOrder: 4,
      metadata: JSON.stringify([
        {
          key: SECTION_METADATA_KEYS.SKILLS.IS_COMMA_SEPARATED,
          label: 'Comma separated',
          value: '1',
        },
      ]),
    }),
    buildSection({
      id: 5,
      title: 'Links',
      defaultTitle: 'Links',
      type: INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS,
      displayOrder: 5,
    }),
  ];

  const items = [
    buildItem({ id: 1, sectionId: 1, containerType: CONTAINER_TYPES.STATIC }),
    buildItem({ id: 2, sectionId: 2, containerType: CONTAINER_TYPES.STATIC }),
    buildItem({ id: 3, sectionId: 3, displayOrder: 2 }),
    buildItem({ id: 4, sectionId: 4 }),
    buildItem({ id: 5, sectionId: 5 }),
  ];

  const fields = [
    buildField({
      id: 1,
      itemId: 1,
      name: FIELD_NAMES.PERSONAL_DETAILS.FIRST_NAME,
      type: FIELD_TYPES.STRING,
      value: 'Ada',
    }),
    buildField({
      id: 2,
      itemId: 1,
      name: FIELD_NAMES.PERSONAL_DETAILS.LAST_NAME,
      type: FIELD_TYPES.STRING,
      value: 'Lovelace',
    }),
    buildField({
      id: 3,
      itemId: 1,
      name: FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE,
      type: FIELD_TYPES.STRING,
      value: 'Product Engineer',
    }),
    buildField({
      id: 4,
      itemId: 1,
      name: FIELD_NAMES.PERSONAL_DETAILS.EMAIL,
      type: FIELD_TYPES.STRING,
      value: 'ada@example.com',
    }),
    buildField({
      id: 5,
      itemId: 1,
      name: FIELD_NAMES.PERSONAL_DETAILS.PHONE,
      type: FIELD_TYPES.STRING,
      value: '+1 555 100 2000',
    }),
    buildField({
      id: 6,
      itemId: 2,
      name: FIELD_NAMES.SUMMARY.SUMMARY,
      type: FIELD_TYPES.RICH_TEXT,
      value:
        'Engineer who builds useful tools. Leads teams well. Ships reliable work.',
    }),
    buildField({
      id: 7,
      itemId: 3,
      name: FIELD_NAMES.WORK_EXPERIENCE.DESCRIPTION,
      type: FIELD_TYPES.RICH_TEXT,
      value: '<ul><li>Improved React workflows by 35%</li></ul>',
    }),
    buildField({
      id: 8,
      itemId: 4,
      name: FIELD_NAMES.SKILLS.SKILL,
      type: FIELD_TYPES.STRING,
      value: 'TypeScript',
    }),
    buildField({
      id: 9,
      itemId: 5,
      name: FIELD_NAMES.WEBSITES_SOCIAL_LINKS.LINK,
      type: FIELD_TYPES.STRING,
      value: 'example.com',
    }),
    buildField({
      id: 10,
      itemId: 5,
      name: FIELD_NAMES.WEBSITES_SOCIAL_LINKS.LABEL,
      type: FIELD_TYPES.STRING,
      value: 'Portfolio',
    }),
  ];

  root.hydrateFromBackend({
    success: true,
    document,
    sections,
    items,
    fields,
  });

  return { root, document, sections, items, fields };
};

export const createSectionOption = (
  type: TemplatedSectionType = INTERNAL_SECTION_TYPES.CUSTOM
): Omit<OtherSectionOption, 'icon'> => ({
  title: type === INTERNAL_SECTION_TYPES.CUSTOM ? 'Custom Section' : 'Courses',
  defaultTitle:
    type === INTERNAL_SECTION_TYPES.CUSTOM ? 'Custom Section' : 'Courses',
  type,
  containerType:
    type === INTERNAL_SECTION_TYPES.HOBBIES
      ? CONTAINER_TYPES.STATIC
      : CONTAINER_TYPES.COLLAPSIBLE,
});
