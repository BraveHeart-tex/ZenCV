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
          'bg-background relative min-h-screen w-1/2 px-3 pb-20 md:px-8 xl:pb-8 hide-scrollbar',
          view === BUILDER_CURRENT_VIEWS.BUILDER && 'w-full xl:w-1/2',
          view === BUILDER_CURRENT_VIEWS.PREVIEW && 'hidden xl:block'
        )}
      >
        <div className='bg-background sticky top-0 z-40 -mx-3 flex items-center justify-between gap-3 border-b px-3 py-3 md:-mx-8 md:px-8'>
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

        <div className='mx-auto mt-2 max-w-2xl'>
          <ImproveResumeWidget />
        </div>

        <div className='mx-auto mt-6 grid max-w-2xl gap-6 pb-8 md:mt-8'>
          <DocumentSections />
          <AddSectionWidget />
        </div>
      </main>
    </TooltipProvider>
  );
});
