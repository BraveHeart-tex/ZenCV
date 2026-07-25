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
          'bg-background hide-scrollbar relative min-h-screen w-full px-3 pb-28 md:px-8 xl:w-1/2 xl:pb-8',
          view === BUILDER_CURRENT_VIEWS.BUILDER && 'w-full xl:w-1/2',
          view === BUILDER_CURRENT_VIEWS.PREVIEW && 'hidden xl:block'
        )}
      >
        <div className='bg-background/95 supports-[backdrop-filter]:bg-background/85 sticky top-0 z-40 -mx-3 flex items-center justify-between gap-3 border-b px-3 py-3 backdrop-blur md:-mx-8 md:px-8'>
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

        <div className='mx-auto mt-3 max-w-2xl'>
          <ImproveResumeWidget />
        </div>

        <div className='mx-auto mt-5 grid max-w-2xl gap-5 pb-8 md:mt-7 md:gap-6'>
          <DocumentSections />
          <AddSectionWidget />
        </div>
      </main>
    </TooltipProvider>
  );
});
