import { ArrowLeftIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { AddSectionWidget } from '@/components/documentBuilder/AddSectionWidget';
import { DocumentBuilderHeader } from '@/components/documentBuilder/DocumentBuilderHeader';
import { DocumentSections } from '@/components/documentBuilder/DocumentSections';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';
import { cn } from '@/lib/utils/stringUtils';
import { DocumentBuilderSettingsWidget } from './DocumentBuilderSettingsWidget';
import { ImproveResumeWidget } from './resumeScore/ImproveResumeWidget';

export const DocumentBuilderClient = observer(() => {
  const navigate = useNavigate();
  const view = builderRootStore.UIStore.currentView;

  const handleBack = () => {
    navigate('/documents');
  };

  return (
    <TooltipProvider>
      <main
        aria-label='Resume editor'
        className={cn(
          'bg-background hide-scrollbar relative min-h-screen w-full px-3 pb-36 md:px-8 xl:w-1/2 xl:border-r xl:pb-10',
          view === BUILDER_CURRENT_VIEWS.BUILDER && 'w-full xl:w-1/2',
          view === BUILDER_CURRENT_VIEWS.PREVIEW && 'hidden xl:block'
        )}
      >
        <div className='bg-background/95 supports-[backdrop-filter]:bg-background/85 sticky top-0 z-40 -mx-3 border-b backdrop-blur md:-mx-8'>
          <div className='mx-auto flex max-w-2xl items-center justify-between gap-2 px-3 py-2.5 md:gap-3 md:px-0 md:py-3'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label='Back to documents'
                  className='size-10 shrink-0 md:size-9'
                  onClick={handleBack}
                  size='icon'
                  variant='outline'
                >
                  <ArrowLeftIcon aria-hidden='true' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>Back to documents</TooltipContent>
            </Tooltip>
            <DocumentBuilderHeader />
            <DocumentBuilderSettingsWidget />
          </div>
        </div>

        <div className='mx-auto mt-4 max-w-2xl md:mt-5'>
          <ImproveResumeWidget />
        </div>

        <div className='mx-auto mt-6 grid max-w-2xl gap-7 pb-10 md:mt-8 md:gap-8'>
          <DocumentSections />
          <AddSectionWidget />
        </div>
      </main>
    </TooltipProvider>
  );
});
