import { Button } from '@/components/ui/button';
import * as motion from 'motion/react-m';
import { templateOptionsWithImages } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import MobileTemplatePickerItem from './MobileTemplatePickerItem';
import { observer } from 'mobx-react-lite';

interface MobileTemplatePickerContentProps {
  setOpen: (open: boolean) => void;
}

const MobileTemplatePickerContent = observer(
  ({ setOpen }: MobileTemplatePickerContentProps) => {
    return (
      <motion.div className="bg-background fixed bottom-0 left-0 right-0 z-50 px-4 py-6 border-t">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Template</h3>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
          <div className="relative">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {templateOptionsWithImages.map((template) => (
                  <MobileTemplatePickerItem
                    template={template}
                    key={template.value}
                  />
                ))}
              </CarouselContent>
              <CarouselPrevious className="sm:flex hidden" />
              <CarouselNext className="sm:flex hidden" />
            </Carousel>
          </div>
        </div>
      </motion.div>
    );
  },
);

export default MobileTemplatePickerContent;
