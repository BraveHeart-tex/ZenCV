'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createAndNavigateToDocument } from '@/lib/helpers/documentBuilderHelpers';
import type { TemplateOption } from '@/lib/types/documentBuilder.types';
import { TemplateImageDialog } from './TemplateImageDialog';

interface TemplateCardProps {
  template: TemplateOption;
}

export const TemplateCard = ({ template }: TemplateCardProps) => {
  const router = useRouter();
  const handleUseTemplate = async () => {
    await createAndNavigateToDocument({
      title: 'Untitled',
      templateType: template.value,
      onSuccess(documentId) {
        router.push(`/builder/${documentId}`);
      },
    });
  };

  return (
    <Card className='overflow-hidden'>
      <CardContent className='p-0'>
        <TemplateImageDialog template={template} />
        <div className='p-4'>
          <h3 className='mb-2 text-lg font-semibold'>{template.name}</h3>
          <Button
            variant='outline'
            className='w-full'
            onClick={handleUseTemplate}
          >
            Use this template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
