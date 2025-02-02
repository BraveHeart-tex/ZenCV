import { makeAutoObservable } from 'mobx';
import { BuilderRootStore } from './builderRootStore';
import { DEX_Field, DEX_Item } from '@/lib/client-db/clientDbSchema';
import { FieldName, SectionType } from '@/lib/types/documentBuilder.types';

export class BuilderUIStore {
  root: BuilderRootStore;

  collapsedItemId: DEX_Item['id'] | null = null;

  itemRefs: Map<string, HTMLElement | null> = new Map();
  fieldRefs: Map<string, HTMLElement | null> = new Map();

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  setElementRef = (key: string, value: HTMLElement | null) => {
    this.itemRefs.set(key, value);
  };

  setFieldRef = (key: string, value: HTMLElement | null) => {
    this.fieldRefs.set(key, value);
  };

  toggleItem = (itemId: DEX_Item['id']) => {
    this.collapsedItemId = itemId === this.collapsedItemId ? null : itemId;
  };

  getFieldRefByFieldNameAndSection = (
    fieldName: FieldName,
    sectionType: SectionType,
  ) => {
    const section = this.root.sectionStore.sections.find(
      (section) => section.type === sectionType,
    );
    if (!section) return;

    const fieldMap = new Map<DEX_Item['id'], DEX_Field[]>();
    for (const field of this.root.fieldStore.fields) {
      if (!fieldMap.has(field.itemId)) {
        fieldMap.set(field.itemId, []);
      }
      fieldMap.get(field.itemId)?.push(field);
    }

    const sectionFields: DEX_Field[] = [];
    for (const item of this.root.itemStore.items) {
      if (item.sectionId === section.id && fieldMap.has(item.id)) {
        sectionFields.push(...(fieldMap.get(item.id) || []));
      }
    }

    const field = sectionFields?.find((field) => field.name === fieldName);
    if (!field) return;
    return this.fieldRefs.get(field.id.toString());
  };
}
