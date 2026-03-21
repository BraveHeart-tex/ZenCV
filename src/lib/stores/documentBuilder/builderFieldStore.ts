import {
  computed,
  makeAutoObservable,
  ObservableMap,
  observable,
  runInAction,
} from 'mobx';
import type { DEX_Field, DEX_Item } from '@/lib/client-db/clientDbSchema';
import { updateField } from '@/lib/client-db/fieldService';
import type { FieldName, StoreResult } from '@/lib/types/documentBuilder.types';
import type { BuilderRootStore } from './builderRootStore';

export class BuilderFieldStore {
  root: BuilderRootStore;
  fields: DEX_Field[] = [];
  fieldValues: ObservableMap<DEX_Field['id'], string> = new ObservableMap();

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this, {
      fields: observable,
      fieldValues: observable,
    });
  }

  @computed
  get fieldsById() {
    return new Map(this.fields.map((field) => [field.id, field]));
  }

  @computed
  get fieldsByItemId() {
    return this.fields.reduce((acc, curr) => {
      const itemId = curr.itemId;
      if (!acc.has(itemId)) {
        acc.set(itemId, []);
      }
      acc.get(itemId)?.push(curr);
      return acc;
    }, new Map<DEX_Item['id'], DEX_Field[]>());
  }

  getFieldById = (fieldId: DEX_Field['id']): DEX_Field | undefined => {
    const field = this.fieldsById.get(fieldId);
    if (!field) return undefined;
    return {
      ...field,
      value: this.fieldValues.get(field.id) ?? field.value ?? '',
    } as DEX_Field;
  };

  getFieldValueByName = (fieldName: FieldName): string => {
    const field = this.fields.find((currField) => currField.name === fieldName);
    if (!field) return '';
    return this.fieldValues.get(field.id) ?? field.value ?? '';
  };

  setFields = (fields: DEX_Field[]) => {
    this.fields = fields;
    const nextFieldValues = new ObservableMap<DEX_Field['id'], string>();
    fields.forEach((field) => {
      nextFieldValues.set(field.id, field.value ?? '');
    });
    this.fieldValues = nextFieldValues;
  };

  setFieldValue = async (
    fieldId: DEX_Field['id'],
    value: string,
    shouldSaveToStore = true
  ): Promise<StoreResult> => {
    const field = this.fields.find((currField) => currField.id === fieldId);
    if (!field) {
      return {
        success: false,
        error: 'Field not found',
      };
    }

    runInAction(() => {
      this.fieldValues.set(fieldId, value);
    });

    if (shouldSaveToStore) {
      try {
        await updateField(fieldId, value);
        return { success: true };
      } catch (error) {
        console.error('setFieldValue error', error);

        return {
          success: false,
          error: 'Failed to save field value',
        };
      }
    }

    return { success: true };
  };

  getFieldsByItemId = (itemId: DEX_Item['id']): DEX_Field[] => {
    const fields = this.fieldsByItemId.get(itemId) || [];
    return fields.map(
      (field) =>
        ({
          ...field,
          value: this.fieldValues.get(field.id) ?? field.value ?? '',
        }) as DEX_Field
    );
  };
}
