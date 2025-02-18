import { Button } from '@/components/ui/button';
import { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { observer } from 'mobx-react-lite';
import { useAiSuggestionHelpers } from './useAiSuggestionHelpers';
import { useRef } from 'react';
import { Loader2Icon } from 'lucide-react';

interface SummaryAiSuggestionWidgetProps {
  summaryField: DEX_Field;
}

const SummaryAiSuggestionWidget = observer(
  ({ summaryField }: SummaryAiSuggestionWidgetProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { handleWriteProfileSummary, isLoading } = useAiSuggestionHelpers();

    return (
      <>
        <div className="space-y-1" ref={ref}>
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Professional Summary
          </h3>
          <p className="text-muted-foreground text-sm">
            {summaryField?.value ? 'Improve your' : 'Generate a brand-new'}{' '}
            summary with AI
          </p>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2Icon className="animate-spin" />
            <p className="text-muted-foreground">AI is generating...</p>
          </div>
        ) : (
          <div className="grid">
            {summaryField?.value ? (
              <Button
                variant="outline"
                onClick={handleWriteProfileSummary}
                disabled={isLoading}
              >
                Improve
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleWriteProfileSummary}
                disabled={isLoading}
              >
                Generate
              </Button>
            )}
          </div>
        )}
      </>
    );
  },
);

export default SummaryAiSuggestionWidget;
