import { observer } from 'mobx-react-lite';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-m';
import { useEffect, useState } from 'react';
import { templateOptionsWithImages } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { MobileTemplatePickerItem } from './MobileTemplatePickerItem';

export const MobileTemplatePickerContent = observer(() => {
  const isOpen = builderRootStore.UIStore.isMobileTemplateSelectorVisible;
  const [api, setApi] = useState<CarouselApi>();

  // scroll to selected template when picker opens
  useEffect(() => {
    if (!isOpen || !api) {
      return;
    }
    const selectedIndex = templateOptionsWithImages.findIndex(
      (t) => t.value === builderRootStore.documentStore.document?.templateType
    );
    if (selectedIndex !== -1) {
      // slight delay to let animation complete
      setTimeout(() => api.scrollTo(selectedIndex, true), 350);
    }
  }, [isOpen, api]);

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50'>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className='bg-background xl:hidden border-t rounded-t-2xl shadow-lg pt-3'
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className='px-4 pb-6 pt-2 space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-sm font-semibold'>Choose Template</h3>
                  <p className='text-xs text-muted-foreground'>
                    {templateOptionsWithImages.length} templates available
                  </p>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-muted-foreground h-8 px-3 text-xs'
                  onClick={() => {
                    builderRootStore.UIStore.toggleTemplateSelectorBottomMenu();
                  }}
                >
                  Done
                </Button>
              </div>

              <div className='relative'>
                <Carousel
                  setApi={setApi}
                  opts={{ align: 'start', dragFree: true }}
                >
                  <CarouselContent className='-ml-2'>
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
        ) : null}
      </AnimatePresence>
    </div>
  );
});
