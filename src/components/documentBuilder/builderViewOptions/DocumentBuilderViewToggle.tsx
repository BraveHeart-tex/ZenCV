import { Eye } from 'lucide-react';
import { action } from 'mobx';
import { Button } from '@/components/ui/button';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';

export const DocumentBuilderViewToggle = () => {
  const view = builderSession.UIStore.currentView;

  if (view === BUILDER_CURRENT_VIEWS.PREVIEW) {
    return null;
  }

  return (
    <Button
      aria-label='Open resume preview'
      className='h-9 shrink-0 gap-1.5 px-2 text-xs xl:hidden'
      size='sm'
      variant='ghost'
      onClick={action(() => {
        builderSession.UIStore.currentView = BUILDER_CURRENT_VIEWS.PREVIEW;
      })}
    >
      <Eye aria-hidden='true' className='size-4' />
      <span className='font-medium'>Preview</span>
    </Button>
  );
};
