import { ArrowLeftIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useLayoutEffect } from 'react';
import { AddSectionWidget } from '@/components/documentBuilder/AddSectionWidget';
import { DocumentBuilderViewToggle } from '@/components/documentBuilder/builderViewOptions/DocumentBuilderViewToggle';
import { DocumentBuilderHeader } from '@/components/documentBuilder/DocumentBuilderHeader';
import { DocumentSectionNavigation } from '@/components/documentBuilder/DocumentSectionNavigation';
import { DocumentSections } from '@/components/documentBuilder/DocumentSections';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';
import { cn } from '@/lib/utils/stringUtils';
import { DocumentBuilderSettingsWidget } from './DocumentBuilderSettingsWidget';
import { ImproveResumeWidget } from './resumeScore/ImproveResumeWidget';

type DocumentBuilderClientProps = Readonly<{
  onReturnToDocuments: () => void;
}>;

export const DocumentBuilderClient = observer(
  ({ onReturnToDocuments }: DocumentBuilderClientProps) => {
    const view = builderSession.UIStore.currentView;

    useLayoutEffect(() => {
      if (view !== BUILDER_CURRENT_VIEWS.BUILDER) {
        return;
      }
      window.scrollTo({
        top: builderSession.UIStore.editorScrollY,
        behavior: 'instant',
      });
      const rememberPosition = () =>
        builderSession.UIStore.rememberEditorScroll(window.scrollY);
      window.addEventListener('scroll', rememberPosition, { passive: true });
      return () => window.removeEventListener('scroll', rememberPosition);
    }, [view]);

    const handleBack = () => {
      onReturnToDocuments();
    };

    return (
      <TooltipProvider>
        <main
          aria-label='Resume editor'
          className={cn(
            'bg-background relative min-h-dvh w-full px-4 pb-[max(2rem,env(safe-area-inset-bottom))] md:px-8 xl:w-1/2 xl:border-r xl:border-border/60',
            view === BUILDER_CURRENT_VIEWS.BUILDER && 'w-full xl:w-1/2',
            view === BUILDER_CURRENT_VIEWS.PREVIEW && 'hidden xl:block'
          )}
        >
          <div className='bg-background/95 sticky top-0 z-40 -mx-4 border-b border-border/60 backdrop-blur-sm md:-mx-8'>
            <div className='mx-auto grid max-w-2xl grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-1.5 px-3 py-2.5 md:gap-3 md:px-0 md:py-3 xl:grid-cols-[auto_minmax(0,1fr)_auto]'>
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
              <DocumentBuilderViewToggle />
              <DocumentBuilderSettingsWidget />
            </div>
            <DocumentSectionNavigation />
          </div>

          <div className='mx-auto mt-4 max-w-2xl md:mt-5'>
            <ImproveResumeWidget />
          </div>

          <div className='mx-auto mt-4 grid max-w-2xl gap-8 pb-10 md:mt-6 md:gap-10'>
            <DocumentSections />
            <AddSectionWidget />
          </div>
        </main>
      </TooltipProvider>
    );
  }
);
