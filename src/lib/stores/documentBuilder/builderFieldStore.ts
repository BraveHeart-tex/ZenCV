import { computed, makeAutoObservable, runInAction } from 'mobx';
import type { DEX_Field, DEX_Item } from '@/lib/client-db/clientDbSchema';
import { updateField } from '@/lib/client-db/fieldService';
import type { FieldName, StoreResult } from '@/lib/types/documentBuilder.types';
import type { BuilderRootStore } from './builderRootStore';

export class BuilderFieldStore {
  root: BuilderRootStore;
  fields: DEX_Field[] = [];

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this);
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

  getFieldById = (fieldId: DEX_Field['id']) => {
    return this.fieldsById.get(fieldId);
  };

  getFieldsByItemId = (itemId: DEX_Item['id']) => {
    return this.fieldsByItemId.get(itemId) || [];
  };

  getFieldValueByName = (fieldName: FieldName): string => {
    return this.fields.find((field) => field.name === fieldName)?.value || '';
  };

  setFields = (fields: DEX_Field[]) => {
    this.fields = fields;
  };

  setFieldValue = async (
    fieldId: DEX_Field['id'],
    value: string,
    shouldSaveToStore = true
  ): Promise<StoreResult> => {
    const field = this.fields.find((field) => field.id === fieldId);
    if (!field) {
      return {
        success: false,
        error: 'Field not found',
      };
    }

    runInAction(() => {
      field.value = value;
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
}
