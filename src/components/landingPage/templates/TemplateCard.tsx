'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TemplateImageDialog from './TemplateImageDialog';
import { TemplateOption } from '@/lib/types/documentBuilder.types';
import { useNavigate } from 'react-router';
import { createAndNavigateToDocument } from '@/lib/helpers/documentBuilderHelpers';

interface TemplateCardProps {
  template: TemplateOption;
}

const TemplateCard = ({ template }: TemplateCardProps) => {
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
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <TemplateImageDialog template={template} />
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold">{template.name}</h3>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleUseTemplate}
          >
            Use this template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
