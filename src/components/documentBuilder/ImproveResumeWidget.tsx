import { useState } from 'react';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import * as motion from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import { Progress } from '@/components/ui/progress';

const ImproveResumeWidget = observer(() => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="w-max h-max bg-primary text-primary-foreground tabular-nums p-1 text-xs font-medium rounded-md">
                {documentBuilderStore.resumeStats.score}%
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                Your Resume Score
              </span>
            </div>

            <Button variant="outline">Improve Resume</Button>
          </div>
          <Progress value={documentBuilderStore.resumeStats.score} />
        </div>
      </CollapsibleTrigger>
      <AnimatePresence>
        {open && (
          <CollapsibleContent forceMount className="bg-popover py-4 mt-4">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <motion.div
                className="grid grid-cols-2 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {documentBuilderStore.resumeStats.suggestions.map(
                  (suggestion, index) => (
                    <motion.div
                      key={suggestion.key}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.1 + index * 0.05,
                        duration: 0.2,
                        ease: 'easeOut',
                      }}
                    >
                      <motion.span
                        className="w-max h-max tabular-nums p-1 text-xs font-medium text-white bg-green-500 rounded-md"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        {suggestion.scoreValue}%
                      </motion.span>
                      <motion.span
                        className="text-sm font-medium"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + index * 0.05 }}
                      >
                        {suggestion.label}
                      </motion.span>
                    </motion.div>
                  ),
                )}
              </motion.div>
            </motion.div>
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Collapsible>
  );
});

export default ImproveResumeWidget;
