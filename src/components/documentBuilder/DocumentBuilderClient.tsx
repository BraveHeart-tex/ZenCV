'use client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { observer } from 'mobx-react-lite';
import DocumentBuilderHeader from '@/components/documentBuilder/DocumentBuilderHeader';
import DocumentSections from '@/components/documentBuilder/DocumentSections';
import AddSectionWidget from '@/components/documentBuilder/AddSectionWidget';
import { cn } from '@/lib/utils/stringUtils';
import ImproveResumeWidget from './resumeScore/ImproveResumeWidget';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';

const DocumentBuilderClient = observer(() => {
  const navigate = useNavigate();
  const view = builderRootStore.UIStore.currentView;

  return (
    <TooltipProvider>
      <div
        className={cn(
          'bg-background min-h-screen px-6 md:p-12 py-14 relative w-1/2 hide-scrollbar',
          view === BUILDER_CURRENT_VIEWS.BUILDER && 'w-full xl:w-1/2',
          view === BUILDER_CURRENT_VIEWS.PREVIEW && 'hidden xl:block',
        )}
      >
        <Button
          onClick={() => {
            navigate('/documents');
            builderRootStore.resetState();
          }}
          variant="outline"
          className="top-2 left-2 absolute"
        >
          Documents
        </Button>

        <div className="max-w-screen-2xl mx-auto">
          <DocumentBuilderHeader />
        </div>
        <div
          className={
            'max-w-screen-2xl bg-popover sticky top-0 z-50 flex items-center justify-between mx-auto'
          }
        >
          <ImproveResumeWidget />
        </div>

        <div className="max-w-screen-2xl grid gap-6 pb-8 mx-auto mt-4">
          <DocumentSections />
          <AddSectionWidget />
        </div>
      </div>
    </TooltipProvider>
  );
});

export default DocumentBuilderClient;
