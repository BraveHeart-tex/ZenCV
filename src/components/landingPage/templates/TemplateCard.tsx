import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TemplateOptionWithVariants } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { Button } from '@/components/ui/button';
import { createAndNavigateToDocument } from '@/lib/misc/createAndNavigateToDocument';
import { TemplateImageDialog } from './TemplateImageDialog';

interface TemplateCardProps {
  template: TemplateOptionWithVariants;
}

export const TemplateCard = ({ template }: TemplateCardProps) => {
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
    <div className='group overflow-hidden rounded-xl border border-border/70 bg-card transition-[background-color,border-color,box-shadow] duration-200 hover:border-foreground/15 motion-reduce:transition-none'>
      <div className='overflow-hidden'>
        <div className='transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100'>
          <TemplateImageDialog template={template} />
        </div>
      </div>
      <div className='p-4 space-y-3'>
        <h3 className='text-sm font-semibold tracking-tight'>
          {template.name}
        </h3>
        <Button
          variant='outline'
          size='sm'
          aria-label={`Use ${template.name} template`}
          className='w-full min-h-11 gap-2 transition-colors group-hover:border-foreground/30'
          onClick={handleUseTemplate}
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Use template'}
          <ArrowRight className='size-3.5' />
        </Button>
      </div>
    </div>
  );
};
