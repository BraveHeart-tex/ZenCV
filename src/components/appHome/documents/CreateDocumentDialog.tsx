import { Button } from '@/components/ui/button';
import { type FormEvent, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import { createDocument } from '@/lib/client-db/clientDbService';
import { useNavigate } from 'react-router';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { FilePlusIcon } from 'lucide-react';
import { dialogFooterClassNames } from '@/lib/constants';
import ResponsiveDialog from '@/components/ui/ResponsiveDialog';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { INTERNAL_TEMPLATE_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ResumeTemplate } from '@/lib/types/documentBuilder.types';

interface CreateDocumentDialogProps {
  triggerVariant?: 'default' | 'sidebar' | 'icon';
}

const CreateDocumentDialog = ({
  triggerVariant = 'default',
}: CreateDocumentDialogProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [template, setTemplate] = useState<ResumeTemplate>(
    INTERNAL_TEMPLATE_TYPES.MANHATTAN,
  );
  const input = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.replaceAll(' ', '')) {
      showErrorToast('Please enter a name for the document.');
      setName('');
      input.current?.focus();
      return;
    }

    try {
      const documentId = await createDocument({
        title: name,
        templateType: template,
      });

      if (!documentId) {
        showErrorToast(
          'An error occurred while creating the document. Please try again.',
        );
        return;
      }

      await builderRootStore.documentStore.initializeStore(documentId);
      showSuccessToast('Document created successfully.');
      setName('');
      setOpen(false);
      navigate(`/builder/${documentId}`);
    } catch (error) {
      showErrorToast('An error occurred while creating the document.');
      console.error(error);
    }
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
              <SelectItem value={INTERNAL_TEMPLATE_TYPES.MANHATTAN}>
                Manhattan
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
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
