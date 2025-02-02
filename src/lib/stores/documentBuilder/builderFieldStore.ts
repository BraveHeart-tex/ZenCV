import { makeAutoObservable, runInAction } from 'mobx';
import { BuilderRootStore } from './builderRootStore';
import { DEX_Field, DEX_Item } from '@/lib/client-db/clientDbSchema';
import { updateField } from '@/lib/client-db/clientDbService';
import { FieldName } from '@/lib/types/documentBuilder.types';

export class BuilderFieldStore {
  root: BuilderRootStore;
  fields: DEX_Field[] = [];

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  getFieldById = (fieldId: DEX_Field['id']) => {
    return this.fields.find((field) => field.id === fieldId);
  };

  getFieldsByItemId = (itemId: DEX_Item['id']) => {
    return this.fields.filter((field) => field.itemId === itemId);
  };

  setFieldValue = async (
    fieldId: DEX_Field['id'],
    value: string,
    shouldSaveToStore = true,
  ) => {
    const field = this.fields.find((field) => field.id === fieldId);
    if (!field) return;

    runInAction(() => {
      field.value = value;
    });

    if (shouldSaveToStore) {
      await updateField(fieldId, value);
    }
  };

  getFieldValueByName = (fieldName: FieldName): string => {
    return this.fields.find((field) => field.name === fieldName)?.value || '';
  };
}
