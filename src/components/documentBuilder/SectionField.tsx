import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { DocumentBuilderSelectInput } from '@/components/documentBuilder/DocumentBuilderSelectInput';
import { FieldPersistenceError } from '@/components/documentBuilder/FieldPersistenceError';
import { BuilderRichTextEditorInput } from '@/components/documentBuilder/inputs/BuilderRichTextEditorInput';
import { DateFieldInput } from '@/components/documentBuilder/inputs/DateFieldInput';
import { WebLinkFieldInput } from '@/components/documentBuilder/inputs/WebLinkFieldInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { FieldId } from '@/lib/builderDocument/builderDocument';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { cn } from '@/lib/utils/stringUtils';

interface SectionFieldProps {
  fieldId: FieldId;
  width?: 'half' | 'full';
}

export const SectionField = observer((props: SectionFieldProps) => {
  const { fieldId, width } = props;
  const field = builderSession.getField(fieldId);

  const htmlInputId = `field-${fieldId}`;
  const fieldLabelId = `${htmlInputId}-label`;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      field?.setDebounced(e.target.value);
    },
    [field]
  );

  const setFieldRef = useCallback(
    (ref: HTMLElement | null) => {
      if (ref) {
        builderSession.UIStore.setFieldRef(fieldId.toString(), ref);
      }
    },
    [fieldId]
  );

  if (!field) {
    return null;
  }

  const renderInput = () => {
    if (
      field.definition.control === 'text' ||
      field.definition.control === 'url'
    ) {
      if (field.definition.control === 'url') {
        return <WebLinkFieldInput fieldId={fieldId} />;
      }

      return (
        <>
          <div
            className={cn(
              'flex items-center justify-between gap-8',
              field.definition.labelRow === 'compact' && 'max-h-3.5'
            )}
          >
            <Label htmlFor={htmlInputId}>{field.label}</Label>
          </div>
          <Input
            id={htmlInputId}
            ref={setFieldRef}
            type='text'
            value={field.value}
            onChange={handleInputChange}
            placeholder={field.definition.placeholder}
            data-1p-ignore='true'
            data-lpignore='true'
            data-protonpass-ignore='true'
            data-bwignore='true'
          />
        </>
      );
    }

    if (field.definition.control === 'month') {
      return <DateFieldInput fieldId={fieldId} />;
    }

    if (field.definition.control === 'select') {
      return <DocumentBuilderSelectInput fieldId={fieldId} />;
    }

    if (field.definition.control === 'richText') {
      const item = builderSession.getItem(field.itemId);
      const section = item ? builderSession.getSection(item.sectionId) : null;
      const isCollapsibleItem = item?.containerType === 'collapsible';
      const editorLabelledBy = isCollapsibleItem
        ? fieldLabelId
        : section
          ? `section-title-${section.id}`
          : undefined;

      return (
        <>
          {isCollapsibleItem ? (
            <Label id={fieldLabelId} htmlFor={htmlInputId}>
              {field.label}
            </Label>
          ) : null}
          <BuilderRichTextEditorInput
            fieldId={fieldId}
            ariaLabelledBy={editorLabelledBy}
          />
        </>
      );
    }

    if (field.definition.control === 'textarea') {
      return (
        <>
          <Label htmlFor={htmlInputId}>{field.label}</Label>
          <Textarea
            ref={setFieldRef}
            id={htmlInputId}
            value={field.value}
            onChange={handleInputChange}
            placeholder={field.definition.placeholder}
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
        (width ?? field.definition.width) === 'full' && 'col-span-full'
      )}
    >
      {renderInput()}
      <FieldPersistenceError field={field} />
    </div>
  );
});
