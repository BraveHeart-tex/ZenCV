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
    <div className='group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-[background-color,border-color,box-shadow] duration-200 hover:border-foreground/15 motion-reduce:transition-none'>
      <TemplateImageDialog template={template} previewSizes={previewSizes} />
      <div className='flex flex-1 flex-col justify-between gap-3 p-3 sm:p-4'>
        <div className='space-y-1'>
          <Heading className='text-sm font-semibold tracking-tight'>
            {template.name}
          </Heading>
          <p className='min-h-10 text-xs leading-5 text-muted-foreground sm:min-h-0'>
            {template.layoutDescription}
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          aria-label={`Create resume with ${template.name} template`}
          className='w-full min-h-11 gap-2 transition-colors group-hover:border-foreground/30'
          onClick={handleUseTemplate}
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Create resume'}
          <ArrowRight className='size-3.5' />
        </Button>
      </div>
    </div>
  );
};
