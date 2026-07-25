import { File } from 'lucide-react';
import { action } from 'mobx';
import { Button } from '@/components/ui/button';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';

export const DocumentBuilderViewToggle = () => {
  const view = builderRootStore.UIStore.currentView;

  if (view === BUILDER_CURRENT_VIEWS.PREVIEW) {
    return null;
  }

  return (
    <Button
      aria-label='Open preview and download options'
      className='fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex h-12 items-center justify-center gap-2 rounded-lg px-5 text-base shadow-lg transition-[background-color,box-shadow] duration-200 ease-[var(--ease-out-quart)] active:shadow-md motion-reduce:transition-none sm:inset-x-auto sm:right-5 sm:w-auto xl:hidden'
      size='lg'
      onClick={action(() => {
        builderRootStore.UIStore.currentView = BUILDER_CURRENT_VIEWS.PREVIEW;
      })}
    >
      <span className='font-medium'>Preview & Download</span>
      <File aria-hidden='true' size={22} />
    </Button>
  );
};
