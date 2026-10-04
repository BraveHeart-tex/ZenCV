import { observer } from 'mobx-react-lite';
import { AnimatePresence, useReducedMotion } from 'motion/react';
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
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { MobileTemplatePickerItem } from './MobileTemplatePickerItem';

export const MobileTemplatePickerContent = observer(() => {
  const isOpen = builderSession.UIStore.isMobileTemplateSelectorVisible;
  const [api, setApi] = useState<CarouselApi>();
  const prefersReducedMotion = useReducedMotion();

  // scroll to selected template when picker opens
  useEffect(() => {
    if (!isOpen || !api) {
      return;
    }
    const selectedIndex = templateOptionsWithImages.findIndex(
      (t) => t.value === builderSession.document?.templateType
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
            className='bg-background xl:hidden max-h-[90dvh] overflow-y-auto border-t border-border rounded-t-md shadow-overlay pt-3'
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.22, ease: 'easeOut' }
            }
          >
            <div className='space-y-4 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-sm font-semibold'>Templates</h3>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-muted-foreground h-8 px-3 text-xs'
                  onClick={() => {
                    builderSession.UIStore.toggleTemplateSelectorBottomMenu();
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
