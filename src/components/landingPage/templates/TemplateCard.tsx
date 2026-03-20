import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createAndNavigateToDocument } from '@/lib/helpers/documentBuilderHelpers';
import type { TemplateOption } from '@/lib/types/documentBuilder.types';
import { TemplateImageDialog } from './TemplateImageDialog';

interface TemplateCardProps {
  template: TemplateOption;
}

export const TemplateCard = ({ template }: TemplateCardProps) => {
  const navigate = useNavigate();

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
    <div className='group rounded-xl border border-border/50 overflow-hidden bg-card/30 hover:border-border hover:bg-card/50 transition-all duration-300 hover:shadow-md'>
      <div className='overflow-hidden'>
        <div className='transition-transform duration-500 group-hover:scale-[1.02]'>
          <TemplateImageDialog template={template} />
        </div>
      </div>
      <div className='p-4 space-y-3'>
        <h3 className='font-semibold text-sm tracking-tight'>
          {template.name}
        </h3>
        <Button
          variant='outline'
          size='sm'
          className='w-full gap-2 group-hover:border-foreground/30 transition-colors'
          onClick={handleUseTemplate}
        >
          Use template
          <ArrowRight className='w-3.5 h-3.5' />
        </Button>
      </div>
    </div>
  );
};
