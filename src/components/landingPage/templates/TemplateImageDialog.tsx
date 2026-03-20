import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createAndNavigateToDocument } from '@/lib/helpers/documentBuilderHelpers';
import type { TemplateOption } from '@/lib/types/documentBuilder.types';

export const TemplateImageDialog = ({
  template,
}: {
  template: TemplateOption;
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleUseTemplate = async () => {
    await createAndNavigateToDocument({
      title: 'Untitled',
      templateType: template.value,
      onSuccess(documentId) {
        navigate(`/builder/${documentId}`);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className='relative overflow-hidden cursor-pointer bg-muted/30'>
          <img
            src={template.image}
            alt={`${template.name} template`}
            width={300}
            height={400}
            className='object-cover w-full transition-transform duration-500 hover:scale-[1.03]'
          />
          <div className='absolute inset-0 bg-foreground/0 hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center'>
            <span className='opacity-0 hover:opacity-100 transition-opacity duration-300 text-xs font-semibold tracking-widest uppercase bg-background/90 text-foreground px-3 py-1.5 rounded-full border border-border/60'>
              Preview
            </span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent
        className='max-w-[95vw] lg:max-w-[75vw] p-0 overflow-hidden border-border/50 gap-0 max-h-[90vh]'
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>{template.name}</DialogTitle>
            <DialogDescription>{template.description}</DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        {/* Mobile: stacked + scrollable. Desktop: side by side, fixed height */}
        <div className='flex flex-col lg:flex-row w-full lg:h-[80vh] overflow-y-auto lg:overflow-hidden'>
          {/* Image panel — short on mobile, full height on desktop */}
          <div className='w-full h-[35vh] lg:h-full lg:w-[55%] bg-muted/20 flex items-center justify-center overflow-hidden shrink-0'>
            <img
              src={template.image}
              alt={`${template.name} template`}
              width={1920}
              height={1080}
              className='object-contain w-full h-full'
            />
          </div>

          {/* Info panel — natural height on mobile, scrollable column on desktop */}
          <div className='w-full lg:w-[45%] flex flex-col border-t lg:border-t-0 lg:border-l border-border/40 lg:overflow-hidden'>
            {/* Header */}
            <div className='px-5 pt-5 pb-4 border-b border-border/40 shrink-0'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-xs font-semibold tracking-widest uppercase text-muted-foreground/60 mb-1'>
                    Template
                  </p>
                  <h2 className='text-lg font-bold tracking-tight'>
                    {template.name}
                  </h2>
                </div>
                <Button
                  size='icon'
                  variant='ghost'
                  className='shrink-0 -mt-1 -mr-1 h-8 w-8 text-muted-foreground'
                  onClick={() => setIsOpen(false)}
                >
                  <X className='w-4 h-4' />
                </Button>
              </div>
            </div>

            {/* Body — scrollable on desktop */}
            <div className='flex-1 px-5 py-4 space-y-4 lg:overflow-y-auto'>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {template.description}
              </p>
              {template.tags.length > 0 && (
                <div className='space-y-2'>
                  <p className='text-xs font-semibold tracking-widest uppercase text-muted-foreground/60'>
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

            {/* Actions — pinned to bottom on desktop, natural flow on mobile */}
            <div className='px-5 pb-5 pt-4 border-t border-border/40 space-y-2 shrink-0'>
              <Button className='w-full gap-2' onClick={handleUseTemplate}>
                Use this template
                <ArrowRight className='w-4 h-4' />
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
