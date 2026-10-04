import { ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TemplateOptionWithVariants } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { TemplateImage } from '@/components/documentBuilder/TemplateImage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createAndNavigateToDocument } from '@/lib/misc/createAndNavigateToDocument';

export const TemplateImageDialog = ({
  template,
  previewSizes,
  onCreateResume,
}: {
  template: TemplateOptionWithVariants;
  previewSizes: string;
  onCreateResume?: (template: TemplateOptionWithVariants) => void;
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleUseTemplate = async () => {
    if (onCreateResume) {
      onCreateResume(template);
      return;
    }

    if (isCreating) {
      return;
    }

    setIsCreating(true);
    try {
      await createAndNavigateToDocument({
        title: 'Untitled',
        templateType: template.value,
        onSuccess(documentId) {
          navigate(`/builder/${documentId}`);
        },
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type='button'
          className='group/preview relative block aspect-[1/1.414] w-full overflow-hidden bg-muted/30 text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring'
          aria-label={`Preview ${template.name} template`}
        >
          <TemplateImage
            template={template}
            variant='card'
            imgProps={{
              width: 400,
              height: 566,
              sizes: previewSizes,
              className: 'block h-full w-full object-contain',
              alt: `${template.name} resume template preview`,
            }}
          />
          <span className='absolute inset-0 bg-foreground/0 transition-colors duration-150 group-hover/preview:bg-foreground/5 motion-reduce:transition-none' />
          <span className='absolute right-2 bottom-2 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground'>
            Preview
          </span>
        </button>
      </DialogTrigger>

      <DialogContent
        className='flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl flex-col gap-0 overflow-hidden rounded-md p-0'
        showCloseButton={false}
      >
        <DialogHeader className='shrink-0 border-b px-4 py-3 text-left sm:px-5'>
          <div className='flex items-start justify-between gap-4'>
            <div className='space-y-1 pt-1'>
              <DialogTitle>{template.name}</DialogTitle>
              <DialogDescription>
                {template.layoutDescription}
              </DialogDescription>
            </div>
            <Button
              size='icon'
              variant='ghost'
              aria-label='Close template preview'
              className='size-11 shrink-0 text-muted-foreground'
              onClick={() => setIsOpen(false)}
            >
              <X className='size-4' />
            </Button>
          </div>
        </DialogHeader>

        <div className='min-h-0 overflow-y-auto overscroll-contain lg:flex'>
          <div className='bg-muted/30 lg:w-[65%] lg:shrink-0'>
            <TemplateImage
              template={template}
              variant='modal'
              imgProps={{
                width: 1000,
                height: 1414,
                sizes: '(min-width: 1024px) 650px, calc(100vw - 32px)',
                loading: 'eager',
                className: 'block h-auto w-full',
                alt: `${template.name} resume template preview`,
              }}
            />
          </div>
          <div className='space-y-4 border-t p-4 lg:w-[35%] lg:border-t-0 lg:border-l lg:p-5'>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              {template.description}
            </p>
            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Layout</h3>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                {template.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className='flex shrink-0 flex-col gap-2 border-t bg-background p-4 sm:flex-row-reverse sm:px-5'>
          <Button
            className='min-h-11 gap-2 sm:min-w-48'
            aria-label={`Create resume with ${template.name} template`}
            onClick={handleUseTemplate}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create resume'}
            <ArrowRight className='size-4' />
          </Button>
          <Button
            variant='ghost'
            className='min-h-11 text-muted-foreground hover:text-foreground'
            onClick={() => setIsOpen(false)}
          >
            Back to templates
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
