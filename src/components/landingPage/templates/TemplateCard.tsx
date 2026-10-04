import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TemplateOptionWithVariants } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { Button } from '@/components/ui/button';
import { createAndNavigateToDocument } from '@/lib/misc/createAndNavigateToDocument';
import { cn } from '@/lib/utils/stringUtils';
import { TemplateImageDialog } from './TemplateImageDialog';

interface TemplateCardProps {
  template: TemplateOptionWithVariants;
  previewSizes?: string;
  headingLevel?: 2 | 3;
  presentation?: 'default' | 'gallery';
}

export const TemplateCard = ({
  template,
  previewSizes = '300px',
  headingLevel = 3,
  presentation = 'default',
}: TemplateCardProps) => {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const isGalleryPresentation = presentation === 'gallery';

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
    <article
      className={cn(
        'group flex h-full flex-col',
        isGalleryPresentation && 'min-w-0 snap-start'
      )}
    >
      <div
        className={cn(
          'overflow-hidden',
          isGalleryPresentation
            ? 'bg-white shadow-editorial transition-transform duration-200 ease-(--ease-out-quart) group-hover:-translate-y-0.5 motion-reduce:transition-none'
            : 'border border-border/70 bg-card'
        )}
      >
        <TemplateImageDialog template={template} previewSizes={previewSizes} />
      </div>
      <div className='flex flex-1 flex-col justify-between gap-3 pt-4'>
        <div>
          <Heading
            className={cn(
              'font-semibold tracking-[-0.025em]',
              isGalleryPresentation ? 'text-lg leading-tight' : 'text-xl'
            )}
          >
            {template.name}
          </Heading>
          <p
            className={cn(
              'mt-1 text-xs leading-relaxed text-muted-foreground',
              isGalleryPresentation && 'sm:text-sm'
            )}
          >
            {template.layoutDescription}
          </p>
        </div>
        <Button
          variant='ghost'
          size='sm'
          aria-label={`Create resume with ${template.name} template`}
          className={cn(
            '-ml-3 min-h-11 w-fit justify-start gap-2 px-3 text-sm font-medium transition-colors group-hover:text-foreground',
            isGalleryPresentation && 'mt-1 ml-0 px-0'
          )}
          onClick={handleUseTemplate}
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create resume'}
          <ArrowRight
            aria-hidden='true'
            className='size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0'
          />
        </Button>
      </div>
    </article>
  );
};
