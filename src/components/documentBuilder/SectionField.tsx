'use client';
import { observer } from 'mobx-react-lite';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { action } from 'mobx';
import {
  CONTAINER_TYPES,
  DEX_Field,
  FIELD_TYPES,
} from '@/lib/client-db/clientDbSchema';
import DateFieldInput from '@/components/documentBuilder/inputs/DateFieldInput';
import {
  getFieldHtmlId,
  getSectionTypeByItemId,
} from '@/lib/helpers/documentBuilderHelpers';
import DocumentBuilderSelectInput from '@/components/documentBuilder/DocumentBuilderSelectInput';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/stringUtils';
import BuilderRichTextEditorInput from '@/components/documentBuilder/inputs/BuilderRichTextEditorInput';
import {
  FIELD_NAMES,
  INTERNAL_SECTION_TYPES,
  SELECT_TYPES,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { SectionType } from '@/lib/types/documentBuilder.types';
import WantedJobTitleSuggestionPopover from '@/components/documentBuilder/aiSuggestions/WantedJobTitleSuggestionPopover';
import { useCallback } from 'react';

interface SectionFieldProps {
  fieldId: DEX_Field['id'];
}

const SectionField = observer(({ fieldId }: SectionFieldProps) => {
  const field = builderRootStore.fieldStore.getFieldById(fieldId);

  if (!field) return null;

  const htmlInputId = getFieldHtmlId(field);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleInputChange = useCallback(
    action(
      async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        await builderRootStore.fieldStore.setFieldValue(
          fieldId,
          e.target.value,
        );
      },
    ),
    [fieldId],
  );

  const setFieldRef = useCallback(
    (ref: HTMLElement | null) => {
      if (ref) builderRootStore.UIStore.setFieldRef(fieldId.toString(), ref);
    },
    [fieldId],
  );

  const renderInput = () => {
    if (field.type === FIELD_TYPES.STRING) {
      return (
        <>
          <div
            className={cn(
              'flex items-center justify-between gap-8',
              field.name === FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE &&
                'max-h-[0.875rem]',
            )}
          >
            <Label htmlFor={htmlInputId}>{field.name}</Label>
            {field.name === FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE && (
              <WantedJobTitleSuggestionPopover
                fieldId={fieldId}
                value={field.value}
              />
            )}
          </div>
          <Input
            id={htmlInputId}
            ref={setFieldRef}
            type="text"
            value={field.value}
            onChange={handleInputChange}
            placeholder={field?.placeholder}
          />
        </>
      );
    }

    if (field.type === FIELD_TYPES.DATE_MONTH) {
      return <DateFieldInput fieldId={fieldId} />;
    }

    if (field.type === FIELD_TYPES.SELECT) {
      if (field.selectType === SELECT_TYPES.BASIC) {
        return <DocumentBuilderSelectInput fieldId={fieldId} />;
      }
    }

    if (field.type === FIELD_TYPES.RICH_TEXT) {
      return (
        <>
          {builderRootStore.itemStore.getItemById(field.itemId)
            ?.containerType === CONTAINER_TYPES.COLLAPSIBLE ? (
            <Label htmlFor={htmlInputId}>{field.name}</Label>
          ) : null}
          <BuilderRichTextEditorInput
            fieldId={fieldId}
            shouldRenderAiWidget={
              (getSectionTypeByItemId(field.itemId) as SectionType) ===
              INTERNAL_SECTION_TYPES.SUMMARY
            }
          />
        </>
      );
    }

    if (field.type === FIELD_TYPES.TEXTAREA) {
      return (
        <>
          <Label htmlFor={htmlInputId}>{field.name}</Label>
          <Textarea
            ref={setFieldRef}
            id={htmlInputId}
            value={field.value}
            onChange={handleInputChange}
            placeholder={field?.placeholder}
          />
        </>
      );
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        (field.type === FIELD_TYPES.RICH_TEXT ||
          field.type === FIELD_TYPES.TEXTAREA) &&
          'col-span-2',
      )}
    >
      {renderInput()}
    </div>
  );
});

export default SectionField;
