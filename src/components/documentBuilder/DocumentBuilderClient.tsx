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
import DocumentBuilderSettingsWidget from './DocumentBuilderSettingsWidget';
import TailorForJobPostingBanner from './resumeScore/TailorForJobPostingBanner';
import { ArrowLeftIcon } from 'lucide-react';

const DocumentBuilderClient = observer(() => {
  const navigate = useNavigate();
  const view = builderRootStore.UIStore.currentView;

  return (
    <TooltipProvider>
      <div
        className={cn(
          'bg-background min-h-screen px-2 md:px-6 md:p-12 py-14 pt-4 md:pt-4 relative w-1/2 hide-scrollbar',
          view === BUILDER_CURRENT_VIEWS.BUILDER && 'w-full xl:w-1/2',
          view === BUILDER_CURRENT_VIEWS.PREVIEW && 'hidden xl:block',
        )}
      >
        <div className="flex items-center justify-between w-full gap-4">
          <Button
            onClick={() => {
              navigate('/documents');
              builderRootStore.resetState();
            }}
            size="icon"
            variant="outline"
          >
            <ArrowLeftIcon />
          </Button>
          <DocumentBuilderHeader />
          <DocumentBuilderSettingsWidget />
        </div>

        <div
          className={
            'max-w-screen-2xl bg-popover sticky top-0 z-50 flex items-center justify-between mx-auto'
          }
        >
          <ImproveResumeWidget />
        </div>
        <TailorForJobPostingBanner />

        <div className="max-w-screen-2xl grid gap-6 pb-8 mx-auto mt-4">
          <DocumentSections />
          <AddSectionWidget />
        </div>
      </div>
    </TooltipProvider>
  );
});

export default DocumentBuilderClient;
