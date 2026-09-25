import { SlidersHorizontalIcon } from 'lucide-react';
import { action } from 'mobx';
import { Button } from '@/components/ui/button';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

export const MobileTemplatePickerTrigger = () => {
  return (
    <Button
      variant='ghost'
      size='icon'
      aria-label='Toggle template selector bottom menu'
      className='xl:hidden'
      onClick={action(() => {
        builderSession.UIStore.toggleTemplateSelectorBottomMenu();
      })}
    >
      <SlidersHorizontalIcon />
    </Button>
  );
};
