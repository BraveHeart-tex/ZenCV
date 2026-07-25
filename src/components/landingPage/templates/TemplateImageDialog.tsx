import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
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
}: {
  template: TemplateOptionWithVariants;
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleUseTemplate = async () => {
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
          className='group/preview relative block w-full overflow-hidden bg-muted/30 text-left focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring'
          aria-label={`Preview ${template.name} template`}
        >
          <TemplateImage
            template={template}
            variant='card'
            imgProps={{
              width: 400,
              height: 566,
              className:
                'object-cover w-full transition-transform duration-500 hover:scale-[1.03]',
              alt: `${template.name} resume template preview`,
            }}
          />
          <span className='absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors duration-300 group-hover/preview:bg-foreground/10'>
            <span className='rounded-full border border-border/60 bg-background/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground opacity-0 transition-opacity duration-300 group-hover/preview:opacity-100 group-focus-visible/preview:opacity-100'>
              Preview
            </span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent
        className='max-h-[90vh] max-w-[95vw] gap-0 overflow-hidden border-border/50 p-0 lg:max-w-[75vw]'
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>{template.name}</DialogTitle>
            <DialogDescription>{template.description}</DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        {/* Mobile: stacked + scrollable. Desktop: side by side, fixed height */}
        <div className='flex w-full flex-col overflow-y-auto lg:h-[80vh] lg:flex-row lg:overflow-hidden'>
          <div className='h-[35vh] w-full shrink-0 bg-muted/20 lg:h-full lg:w-[55%]'>
            <TemplateImage
              template={template}
              imgProps={{
                width: 1000,
                height: 1414,
                className: 'h-full w-full object-contain',
                alt: `${template.name} resume template preview`,
              }}
              variant='modal'
            />
          </div>

          <div className='flex w-full flex-col border-t border-border/40 lg:w-[45%] lg:overflow-hidden lg:border-t-0 lg:border-l'>
            <div className='shrink-0 border-b border-border/40 px-5 pt-5 pb-4'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70'>
                    Template
                  </p>
                  <h2 className='text-lg font-bold tracking-tight'>
                    {template.name}
                  </h2>
                </div>
                <Button
                  size='icon'
                  variant='ghost'
                  aria-label='Close template preview'
                  className='-mt-1 -mr-1 h-8 w-8 shrink-0 text-muted-foreground'
                  onClick={() => setIsOpen(false)}
                >
                  <X className='size-4' />
                </Button>
              </div>
            </div>

            <div className='flex-1 space-y-4 px-5 py-4 lg:overflow-y-auto'>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {template.description}
              </p>
              {template.tags.length > 0 && (
                <div className='space-y-2'>
                  <p className='text-xs font-semibold uppercase tracking-widest text-muted-foreground/70'>
                    Best for
                  </p>
                  <div className='flex flex-wrap gap-1.5'>
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className='inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border border-border/60 bg-muted/40 text-muted-foreground'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className='shrink-0 space-y-2 border-t border-border/40 px-5 pt-4 pb-5'>
              <Button
                className='w-full gap-2'
                onClick={handleUseTemplate}
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Use this template'}
                <ArrowRight className='size-4' />
              </Button>
              <Button
                variant='ghost'
                className='w-full text-muted-foreground hover:text-foreground'
                onClick={() => setIsOpen(false)}
              >
                Back to templates
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
