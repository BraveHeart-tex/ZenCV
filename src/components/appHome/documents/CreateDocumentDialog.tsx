import { Button } from '@/components/ui/button';
import { type FormEvent, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { showErrorToast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { FilePlusIcon } from 'lucide-react';
import { dialogFooterClassNames } from '@/lib/constants';
import ResponsiveDialog from '@/components/ui/ResponsiveDialog';
import { INTERNAL_TEMPLATE_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ResumeTemplate } from '@/lib/types/documentBuilder.types';
import { createAndNavigateToDocument } from '@/lib/helpers/documentBuilderHelpers';
import { Checkbox } from '@/components/ui/checkbox';
import {
  PREFILL_RESUME_STYLES,
  PrefilledResumeStyle,
} from '@/lib/templates/prefilledTemplates';

interface CreateDocumentDialogProps {
  triggerVariant?: 'default' | 'sidebar' | 'icon';
}

const resumeTemplateSelectOptions = Object.keys(INTERNAL_TEMPLATE_TYPES).map(
  (key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
    value: INTERNAL_TEMPLATE_TYPES[key as keyof typeof INTERNAL_TEMPLATE_TYPES],
  }),
);

const sampleDataOptions: { label: string; value: PrefilledResumeStyle }[] = [
  {
    label: 'Standard',
    value: PREFILL_RESUME_STYLES.STANDARD,
  },
  {
    label: 'Tech-Focused',
    value: PREFILL_RESUME_STYLES.TECH_FOCUSED,
  },
  {
    label: 'Creative',
    value: PREFILL_RESUME_STYLES.CREATIVE,
  },
] as const;

const CreateDocumentDialog = ({
  triggerVariant = 'default',
}: CreateDocumentDialogProps) => {
  const navigate = useNavigate();
  const [shouldUseSampleData, setShouldUseSampleData] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [template, setTemplate] = useState<ResumeTemplate>(
    INTERNAL_TEMPLATE_TYPES.MANHATTAN,
  );
  const [selectedPrefillStyle, setSelectedPrefillStyle] =
    useState<PrefilledResumeStyle | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.replaceAll(' ', '')) {
      showErrorToast('Please enter a name for the document.');
      setName('');
      input.current?.focus();
      return;
    }

    await createAndNavigateToDocument({
      title: name,
      templateType: template,
      selectedPrefillStyle,
      onSuccess(documentId) {
        navigate(`/builder/${documentId}`);
        setOpen(false);
      },
      onError() {
        showErrorToast(
          'Something went wrong while creating the document. Please try again later.',
        );
      },
    });
  };

  const renderTrigger = () => {
    if (triggerVariant === 'default') {
      return (
        <Button variant={open ? 'outline' : 'default'}>
          Create New Document
        </Button>
      );
    }

    if (triggerVariant === 'sidebar') {
      return (
        <SidebarMenuButton variant="outline">
          <FilePlusIcon /> Create Document
        </SidebarMenuButton>
      );
    }

    if (triggerVariant === 'icon') {
      return (
        <Button variant="outline" size="icon">
          <FilePlusIcon />
        </Button>
      );
    }
  };

  return (
    <ResponsiveDialog
      title="Create new document"
      description="Use the form below to create a document"
      trigger={renderTrigger()}
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setName('');
        }
        setOpen(isOpen);
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            ref={input}
            id="name"
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
            minLength={1}
            aria-invalid={name ? 'false' : 'true'}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="template">Template</Label>
          <Select
            value={template}
            onValueChange={(value) => setTemplate(value as ResumeTemplate)}
            defaultValue={template}
          >
            <SelectTrigger className="w-full" id="template">
              <SelectValue placeholder="Resume Template" />
            </SelectTrigger>
            <SelectContent>
              {resumeTemplateSelectOptions.map((option) => (
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="use-sample-data"
              checked={shouldUseSampleData}
              onCheckedChange={(checked: boolean) => {
                if (!checked && selectedPrefillStyle) {
                  setSelectedPrefillStyle(null);
                }

                setShouldUseSampleData(checked);
              }}
            />
            <Label htmlFor="use-sample-data">Use sample data</Label>
          </div>
          <p className="text-muted-foreground text-xs">
            Populate the document with sample data.
          </p>
        </div>
        {shouldUseSampleData && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="sample-data-type">Sample Data Type</Label>
            <Select
              value={selectedPrefillStyle || ''}
              onValueChange={(value) =>
                setSelectedPrefillStyle(value as PrefilledResumeStyle)
              }
              defaultValue={
                selectedPrefillStyle || PREFILL_RESUME_STYLES.STANDARD
              }
            >
              <SelectTrigger className="w-full" id="sample-data-type">
                <SelectValue placeholder="Select sample data type" />
              </SelectTrigger>
              <SelectContent>
                {sampleDataOptions.map((option) => (
                  <SelectItem value={option.value} key={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className={dialogFooterClassNames}>
          <Button
            variant="outline"
            aria-label="Close create document dialog"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
};
export default CreateDocumentDialog;
