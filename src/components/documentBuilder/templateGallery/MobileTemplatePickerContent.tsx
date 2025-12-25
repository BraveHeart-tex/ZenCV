import { observer } from 'mobx-react-lite';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-m';
import { templateOptionsWithImages } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { MobileTemplatePickerItem } from './MobileTemplatePickerItem';

export const MobileTemplatePickerContent = observer(() => {
  const isOpen = builderRootStore.UIStore.isMobileTemplateSelectorVisible;

  return (
    <div className='fixed bottom-0 left-0 right-0'>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className='bg-background xl:hidden px-4 py-6 border-t'
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>Template</h3>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    builderRootStore.UIStore.toggleTemplateSelectorBottomMenu();
                  }}
                >
                  Close
                </Button>
              </div>
              <div className='relative'>
                <Carousel
                  opts={{
                    align: 'start',
                  }}
                  className='w-full'
                >
                  <CarouselContent className='px-2'>
                    {templateOptionsWithImages.map((template) => (
                      <MobileTemplatePickerItem
                        template={template}
                        key={template.value}
                      />
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className='sm:flex hidden' />
                  <CarouselNext className='sm:flex hidden' />
                </Carousel>
              </div>
            </div>
          </motion.div>
        ) : (
          'not open'
        )}
      </AnimatePresence>
    </div>
  );
});
