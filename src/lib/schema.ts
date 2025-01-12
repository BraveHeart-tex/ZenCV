import type { SectionType } from './constants';

type IdType = number;

export interface Document {
  id: IdType;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: IdType;
  documentId: IdType;
  title: string;

  defaultTitle: string;
  type: SectionType;
  displayOrder: number;

  metadata?: string;
}

export interface Item {
  id: IdType;
  sectionId: IdType;
  containerType: 'collapsible' | 'static';
  displayOrder: number;
}

interface BaseFieldProps {
  id: IdType;
  itemId: IdType;
  name: string;
}

interface StringField extends BaseFieldProps {
  type: 'string';
  value: string;
}

interface DateMonthField extends BaseFieldProps {
  type: 'date-month';
  value: string;
}

interface SelectField extends BaseFieldProps {
  type: 'select';
  selectType: 'basic' | 'level';
  value: string;
  options: string[];
}

export type Field = StringField | DateMonthField | SelectField;
