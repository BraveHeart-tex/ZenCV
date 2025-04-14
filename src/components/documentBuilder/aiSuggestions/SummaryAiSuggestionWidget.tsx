import { Button } from '@/components/ui/button';
import { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { observer } from 'mobx-react-lite';
import { useAiSuggestionHelpers } from './useAiSuggestionHelpers';
import { useRef, useState } from 'react';
import { Loader2Icon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CUSTOM_PROMPT_MAX_LENGTH } from '@/lib/constants';

interface SummaryAiSuggestionWidgetProps {
  summaryField: DEX_Field;
}

const SummaryAiSuggestionWidget = observer(
  ({ summaryField }: SummaryAiSuggestionWidgetProps) => {
    const [refinementPrompt, setRefinementPrompt] = useState('');

    const ref = useRef<HTMLDivElement>(null);
    const { handleWriteProfileSummary, isLoading } = useAiSuggestionHelpers();

    const handleImproveSummary = () => {
      handleWriteProfileSummary(refinementPrompt);
    };

    const shouldShowImproveContent = !!summaryField?.value;

    return (
      <>
        <div className="space-y-1" ref={ref}>
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Professional Summary
          </h3>
          <p className="text-muted-foreground text-sm">
            {shouldShowImproveContent ? 'Improve your' : 'Generate a brand-new'}{' '}
            summary with AI.
          </p>
        </div>
        {shouldShowImproveContent ? (
          <div className="space-y-1">
            <Label htmlFor="refinementPrompt">Refinement Prompt</Label>
            <Textarea
              rows={10}
              id="refinementPrompt"
              value={refinementPrompt}
              onChange={(event) => setRefinementPrompt(event.target.value)}
              maxLength={CUSTOM_PROMPT_MAX_LENGTH}
              className="resize-none"
              placeholder="Give the AI specific instructions to highlight what matters most to you."
            />
            <p className="text-muted-foreground text-xs text-right">
              {refinementPrompt.length} / {CUSTOM_PROMPT_MAX_LENGTH} characters
            </p>
          </div>
        ) : null}
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
                onClick={handleImproveSummary}
                disabled={isLoading || !refinementPrompt}
              >
                Improve
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => handleWriteProfileSummary()}
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
