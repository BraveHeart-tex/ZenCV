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

type FieldType = 'string' | 'date-month' | 'select';

export interface Field {
  id: IdType;
  itemId: IdType;
  name: string;
  type: FieldType;
  value: 'string';
  options?: FieldOption[];
}

interface FieldOption {
  placeholder: string;
  options: string[];
  selectType: 'basic' | 'level';
}
