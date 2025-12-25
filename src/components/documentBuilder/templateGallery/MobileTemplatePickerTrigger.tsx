import { SlidersHorizontalIcon } from 'lucide-react';
import { action } from 'mobx';
import { Button } from '@/components/ui/button';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

export const MobileTemplatePickerTrigger = () => {
  return (
    <Button
      variant='ghost'
      size='icon'
      aria-label='Toggle template selector bottom menu'
      className='xl:hidden'
      onClick={action(() => {
        builderRootStore.UIStore.toggleTemplateSelectorBottomMenu();
      })}
    >
      <SlidersHorizontalIcon />
    </Button>
  );
};
