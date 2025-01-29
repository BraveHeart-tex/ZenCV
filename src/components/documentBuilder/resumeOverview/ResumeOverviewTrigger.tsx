'use client';
import { CONTAINER_TYPES } from '@/lib/client-db/clientDbSchema';
import { SectionWithItems } from '@/lib/types';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-m';

interface ResumeOverviewTriggerProps {
  visible: boolean;
  sectionsWithItems: SectionWithItems[];
}

const ResumeOverviewTrigger = ({
  sectionsWithItems,
  visible,
}: ResumeOverviewTriggerProps) => {
  return (
    <AnimatePresence>
      {!visible && (
        <motion.div className="fixed right-5 top-[25%] flex flex-col gap-2">
          {sectionsWithItems.map((section) => {
            return (
              <motion.div key={`trigger-${section.id}`} className="space-y-2">
                <div className="bg-muted-foreground w-6 h-[3.5px] rounded-sm" />
                {section.items.filter(
                  (item) => item.containerType === CONTAINER_TYPES.COLLAPSIBLE,
                ).length > 0 && (
                  <div className="flex flex-col gap-2 pl-2">
                    {section.items.map((item) => (
                      <motion.div
                        key={`trigger-${item.id}`}
                        className="bg-muted-foreground w-4 h-[3.5px] rounded-sm"
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResumeOverviewTrigger;
