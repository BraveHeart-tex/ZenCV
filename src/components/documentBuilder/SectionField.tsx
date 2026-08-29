import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { DocumentBuilderSelectInput } from '@/components/documentBuilder/DocumentBuilderSelectInput';
import { BuilderRichTextEditorInput } from '@/components/documentBuilder/inputs/BuilderRichTextEditorInput';
import { DateFieldInput } from '@/components/documentBuilder/inputs/DateFieldInput';
import { WebLinkFieldInput } from '@/components/documentBuilder/inputs/WebLinkFieldInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  CONTAINER_TYPES,
  type DEX_Field,
  FIELD_TYPES,
} from '@/lib/client-db/clientDbSchema';
import { getFieldHtmlId } from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import {
  FIELD_NAMES,
  SELECT_TYPES,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { cn } from '@/lib/utils/stringUtils';

interface SectionFieldProps {
  fieldId: DEX_Field['id'];
}

export const SectionField = observer(({ fieldId }: SectionFieldProps) => {
  const field = builderRootStore.fieldStore.getFieldById(fieldId);

  const htmlInputId = field ? getFieldHtmlId(field) : '';
  const fieldLabelId = `${htmlInputId}-label`;

  const handleInputChange = useCallback(
    action(
      async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        await builderRootStore.fieldStore.setFieldValue(
          fieldId,
          e.target.value
        );
      }
    ),
    []
  );

  const setFieldRef = useCallback(
    (ref: HTMLElement | null) => {
      if (ref) {
        builderRootStore.UIStore.setFieldRef(fieldId.toString(), ref);
      }
    },
    [fieldId]
  );

  if (!field) {
    return null;
  }

  const renderInput = () => {
    if (field.type === FIELD_TYPES.STRING) {
      if (field.name === FIELD_NAMES.WEBSITES_SOCIAL_LINKS.LINK) {
        return <WebLinkFieldInput fieldId={fieldId} />;
      }

      return (
        <>
          <div
            className={cn(
              'flex items-center justify-between gap-8',
              field.name === FIELD_NAMES.PERSONAL_DETAILS.WANTED_JOB_TITLE &&
                'max-h-3.5'
            )}
          >
            <Label htmlFor={htmlInputId}>{field.name}</Label>
          </div>
          <Input
            id={htmlInputId}
            ref={setFieldRef}
            type='text'
            value={field.value}
            onChange={handleInputChange}
            placeholder={field?.placeholder}
            data-1p-ignore='true'
            data-lpignore='true'
            data-protonpass-ignore='true'
            data-bwignore='true'
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
      const item = builderRootStore.itemStore.getItemById(field.itemId);
      const section = item
        ? builderRootStore.sectionStore.getSectionById(item.sectionId)
        : null;
      const isCollapsibleItem =
        item?.containerType === CONTAINER_TYPES.COLLAPSIBLE;
      const editorLabelledBy = isCollapsibleItem
        ? fieldLabelId
        : section
          ? `section-title-${section.id}`
          : undefined;

      return (
        <>
          {isCollapsibleItem ? (
            <Label id={fieldLabelId} htmlFor={htmlInputId}>
              {field.name}
            </Label>
          ) : null}
          <BuilderRichTextEditorInput
            fieldId={fieldId}
            ariaLabelledBy={editorLabelledBy}
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
            data-1p-ignore='true'
            data-lpignore='true'
            data-protonpass-ignore='true'
            data-bwignore='true'
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
          'col-span-2'
      )}
    >
      {renderInput()}
    </div>
  );
});
