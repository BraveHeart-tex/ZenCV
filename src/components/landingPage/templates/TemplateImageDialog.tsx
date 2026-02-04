import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Image
          src={template.image}
          alt={`${template.name} template`}
          width={300}
          height={400}
          className='object-cover w-full cursor-pointer'
          onClick={() => setIsOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className='max-w-[90vw] lg:max-w-[70vw] max-h-[90vh] w-full h-full overflow-y-auto'>
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>{template.name}</DialogTitle>
            <DialogDescription>{template.description}</DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
        <div className='lg:flex-row bg-background flex flex-col w-full h-full'>
          <div className='lg:w-1/2 w-full h-[40vh] lg:h-[80vh]'>
            <Image
              src={template.image}
              alt={`${template.name} template image`}
              width={1920}
              height={1080}
              className='object-contain w-full h-full'
            />
          </div>
          <div className='lg:w-1/2 lg:p-6 flex flex-col w-full h-full p-2'>
            <div className='flex-1 min-h-0'>
              <h2 className='lg:mb-4 lg:text-2xl mb-2 text-xl font-bold'>
                {template.name}
              </h2>
              <p className='text-muted-foreground lg:mb-6 mb-4 text-sm'>
                {template.description}
              </p>
              <div className='flex flex-wrap items-center gap-2'>
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className='bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-full'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className='mt-auto space-y-2'>
              <Button className='w-full' onClick={handleUseTemplate}>
                Use this template
              </Button>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
