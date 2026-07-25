import { makeAutoObservable, observable, runInAction } from 'mobx';
import { showErrorToast } from '@/components/ui/sonner';
import type { DEX_Field, DEX_Item } from '@/lib/client-db/clientDbSchema';
import { updateField } from '@/lib/client-db/fieldService';
import type { FieldName, StoreResult } from '@/lib/types/documentBuilder.types';
import type { BuilderRootStore } from './builderRootStore';

const FIELD_SAVE_DEBOUNCE_MS = 400;

export class FieldModel {
  private readonly fieldData: Omit<DEX_Field, 'value'>;
  value: string;
  private saveVersion = 0;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private lastPersistedValue: string;

  constructor(field: DEX_Field) {
    const { value, ...fieldData } = field;

    this.fieldData = fieldData;
    this.value = value ?? '';
    this.lastPersistedValue = this.value;

    makeAutoObservable<
      this,
      'fieldData' | 'saveVersion' | 'saveTimer' | 'lastPersistedValue'
    >(
      this,
      {
        fieldData: false,
        saveVersion: false,
        saveTimer: false,
        lastPersistedValue: false,
      },
      { autoBind: true }
    );
  }

  get id() {
    return this.fieldData.id;
  }

  get itemId() {
    return this.fieldData.itemId;
  }

  get name() {
    return this.fieldData.name;
  }

  get type() {
    return this.fieldData.type;
  }

  setValue(value: string, shouldSaveToStore = true) {
    const previousValue = this.value;

    this.value = value;

    if (!shouldSaveToStore) {
      return;
    }

    this.saveVersion += 1;
    const saveVersion = this.saveVersion;

    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }

    const timer = setTimeout(async () => {
      try {
        await updateField(this.id, value);
        this.lastPersistedValue = value;
      } catch (error) {
        console.error('setFieldValue error', error);
        runInAction(() => {
          if (this.saveVersion === saveVersion) {
            this.value = this.lastPersistedValue ?? previousValue;
          }
        });

        showErrorToast('Could not save this edit.', {
          description: 'The field was restored to its last saved value.',
        });
      } finally {
        if (this.saveTimer === timer) {
          this.saveTimer = null;
        }
      }
    }, FIELD_SAVE_DEBOUNCE_MS);

    this.saveTimer = timer;
  }

  dispose() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
  }

  toSnapshot(): DEX_Field {
    return {
      ...this.fieldData,
      value: this.value,
    } as DEX_Field;
  }
}

export class BuilderFieldStore {
  root: BuilderRootStore;
  fields: FieldModel[] = [];

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(
      this,
      {
        fields: observable,
      },
      { autoBind: true }
    );
  }

  get fieldsById() {
    return new Map(this.fields.map((field) => [field.id, field]));
  }

  get fieldsByItemId() {
    return this.fields.reduce((acc, curr) => {
      const itemId = curr.itemId;
      if (!acc.has(itemId)) {
        acc.set(itemId, []);
      }
      acc.get(itemId)?.push(curr);
      return acc;
    }, new Map<DEX_Item['id'], FieldModel[]>());
  }

  getFieldById(fieldId: DEX_Field['id']): DEX_Field | undefined {
    const field = this.fieldsById.get(fieldId);
    return field?.toSnapshot();
  }

  getFieldValueByName(fieldName: FieldName): string {
    const field = this.fields.find((currField) => currField.name === fieldName);
    if (!field) {
      return '';
    }
    return field.value;
  }

  setFields(fields: DEX_Field[]) {
    this.clear();
    this.fields = fields.map((field) => new FieldModel(field));
  }

  addFields(fields: DEX_Field[]) {
    this.fields.push(...fields.map((field) => new FieldModel(field)));
  }

  clear() {
    this.fields.forEach((field) => {
      field.dispose();
    });
    this.fields = [];
  }

  async setFieldValue(
    fieldId: DEX_Field['id'],
    value: string,
    shouldSaveToStore = true
  ): Promise<StoreResult> {
    const field = this.fields.find((currField) => currField.id === fieldId);
    if (!field) {
      return {
        success: false,
        error: 'Field not found',
      };
    }

    runInAction(() => {
      field.setValue(value, shouldSaveToStore);
    });

    return { success: true };
  }

  getFieldsByItemId(itemId: DEX_Item['id']): DEX_Field[] {
    const fields = this.fieldsByItemId.get(itemId) || [];
    return fields.map((field) => field.toSnapshot());
  }
}
