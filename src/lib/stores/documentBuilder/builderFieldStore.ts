import {
  makeAutoObservable,
  ObservableMap,
  observable,
  runInAction,
} from 'mobx';
import { showErrorToast } from '@/components/ui/sonner';
import type { DEX_Field, DEX_Item } from '@/lib/client-db/clientDbSchema';
import { updateField } from '@/lib/client-db/fieldService';
import type { FieldName, StoreResult } from '@/lib/types/documentBuilder.types';
import type { BuilderRootStore } from './builderRootStore';

const FIELD_SAVE_DEBOUNCE_MS = 400;

export class BuilderFieldStore {
  root: BuilderRootStore;
  fields: DEX_Field[] = [];
  fieldValues: ObservableMap<DEX_Field['id'], string> = new ObservableMap();
  private saveVersions = new Map<DEX_Field['id'], number>();
  private saveTimers = new Map<
    DEX_Field['id'],
    ReturnType<typeof setTimeout>
  >();
  private lastPersistedValues = new Map<DEX_Field['id'], string>();

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable<
      this,
      'saveVersions' | 'saveTimers' | 'lastPersistedValues'
    >(
      this,
      {
        fields: observable,
        fieldValues: observable,
        saveVersions: false,
        saveTimers: false,
        lastPersistedValues: false,
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
    }, new Map<DEX_Item['id'], DEX_Field[]>());
  }

  getFieldById(fieldId: DEX_Field['id']): DEX_Field | undefined {
    const field = this.fieldsById.get(fieldId);
    if (!field) {
      return undefined;
    }
    return {
      ...field,
      value: this.fieldValues.get(field.id) ?? field.value ?? '',
    } as DEX_Field;
  }

  getFieldValueByName(fieldName: FieldName): string {
    const field = this.fields.find((currField) => currField.name === fieldName);
    if (!field) {
      return '';
    }
    return this.fieldValues.get(field.id) ?? field.value ?? '';
  }

  setFields(fields: DEX_Field[]) {
    this.fields = fields;
    const nextFieldValues = new ObservableMap<DEX_Field['id'], string>();
    fields.forEach((field) => {
      nextFieldValues.set(field.id, field.value ?? '');
      this.lastPersistedValues.set(field.id, field.value ?? '');
    });
    this.fieldValues = nextFieldValues;
    this.saveVersions.clear();
    this.saveTimers.forEach((timer) => {
      clearTimeout(timer);
    });
    this.saveTimers.clear();
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

    const previousValue = this.fieldValues.get(fieldId) ?? field.value ?? '';

    runInAction(() => {
      this.fieldValues.set(fieldId, value);
    });

    if (shouldSaveToStore) {
      const saveVersion = (this.saveVersions.get(fieldId) ?? 0) + 1;
      this.saveVersions.set(fieldId, saveVersion);

      const existingTimer = this.saveTimers.get(fieldId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(async () => {
        try {
          await updateField(fieldId, value);
          this.lastPersistedValues.set(fieldId, value);
        } catch (error) {
          console.error('setFieldValue error', error);
          runInAction(() => {
            if (this.saveVersions.get(fieldId) === saveVersion) {
              this.fieldValues.set(
                fieldId,
                this.lastPersistedValues.get(fieldId) ?? previousValue
              );
            }
          });

          showErrorToast('Could not save this edit.', {
            description: 'The field was restored to its last saved value.',
          });
        } finally {
          if (this.saveTimers.get(fieldId) === timer) {
            this.saveTimers.delete(fieldId);
          }
        }
      }, FIELD_SAVE_DEBOUNCE_MS);

      this.saveTimers.set(fieldId, timer);
    }

    return { success: true };
  }

  getFieldsByItemId(itemId: DEX_Item['id']): DEX_Field[] {
    const fields = this.fieldsByItemId.get(itemId) || [];
    return fields.map(
      (field) =>
        ({
          ...field,
          value: this.fieldValues.get(field.id) ?? field.value ?? '',
        }) as DEX_Field
    );
  }
}
