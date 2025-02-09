import {
  FieldInsertTemplate,
  FieldName,
  ResumeTemplate,
  SectionType,
  SelectType,
} from '@/lib/types/documentBuilder.types';

type IdType = number;

export interface DEX_Document {
  id: IdType;
  title: string;
  templateType: ResumeTemplate;
  createdAt: string;
  updatedAt: string;
}

export interface DEX_Section {
  id: IdType;
  documentId: IdType;
  title: string;
  defaultTitle: string;
  type: SectionType;
  displayOrder: number;
  metadata?: string;
}

export interface DEX_Item {
  id: IdType;
  sectionId: IdType;
  containerType: 'collapsible' | 'static';
  displayOrder: number;
}

interface BaseFieldProps {
  id: IdType;
  itemId: IdType;
  name: FieldName;
  placeholder?: string;
}

interface StringField extends BaseFieldProps {
  type: 'string';
  value: string;
}

interface TextareaField extends BaseFieldProps {
  type: 'textarea';
  value: string;
}

interface RichTextField extends BaseFieldProps {
  type: 'rich-text';
  value: 'string';
}

interface DateMonthField extends BaseFieldProps {
  type: 'date-month';
  value: string;
}

export interface SelectField extends BaseFieldProps {
  type: 'select';
  selectType: SelectType;
  value: string;
  options: string[];
}

export const FIELD_TYPES = {
  STRING: 'string',
  RICH_TEXT: 'rich-text',
  DATE_MONTH: 'date-month',
  SELECT: 'select',
  TEXTAREA: 'textarea',
} as const;

export const CONTAINER_TYPES = {
  STATIC: 'static',
  COLLAPSIBLE: 'collapsible',
} as const;

export type DEX_Field =
  | StringField
  | DateMonthField
  | SelectField
  | RichTextField
  | TextareaField;

export interface ItemWithFields extends Omit<DEX_Item, 'id' | 'sectionId'> {
  fields: FieldInsertTemplate[];
}

export interface SectionWithFields extends Omit<DEX_Section, 'id'> {
  items: ItemWithFields[];
}

export type DEX_InsertDocumentModel = Omit<
  DEX_Document,
  'id' | 'createdAt' | 'updatedAt'
>;

export type DEX_InsertItemModel = Omit<DEX_Item, 'id'>;
export type DEX_InsertFieldModel = Omit<DEX_Field, 'id'>;

export interface EditorPreferences {
  askBeforeDeletingItem: boolean;
  askBeforeDeletingSection: boolean;
}

export type SettingsKey = 'language' | 'editorPreferences';

export interface Setting<T = unknown> {
  key: SettingsKey;
  value: T;
}
