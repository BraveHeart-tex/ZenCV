import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TemplateOptionWithVariants } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { Button } from '@/components/ui/button';
import { createAndNavigateToDocument } from '@/lib/misc/createAndNavigateToDocument';
import { TemplateImageDialog } from './TemplateImageDialog';

interface TemplateCardProps {
  template: TemplateOptionWithVariants;
  previewSizes?: string;
  headingLevel?: 2 | 3;
}

export const TemplateCard = ({
  template,
  previewSizes = '300px',
  headingLevel = 3,
}: TemplateCardProps) => {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const navigate = useNavigate();
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
    <article className='group flex h-full flex-col'>
      <div className='overflow-hidden border border-border/70 bg-card'>
        <TemplateImageDialog template={template} previewSizes={previewSizes} />
      </div>
      <div className='flex flex-1 flex-col justify-between gap-3 pt-4'>
        <div>
          <Heading className='text-xl font-semibold tracking-[-0.025em]'>
            {template.name}
          </Heading>
          <p className='mt-1 text-xs leading-relaxed text-muted-foreground'>
            {template.layoutDescription}
          </p>
        </div>
        <Button
          variant='ghost'
          size='sm'
          aria-label={`Create resume with ${template.name} template`}
          className='-ml-3 min-h-11 w-fit justify-start gap-2 px-3 text-sm font-medium transition-colors group-hover:text-foreground'
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
