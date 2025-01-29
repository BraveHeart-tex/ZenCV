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
        <motion.div className="fixed right-0 flex flex-col gap-2">
          {sectionsWithItems.map((section) => {
            return (
              <motion.div
                key={`trigger-${section.id}`}
                className="w-full h-12 transition-all"
              >
                {section.items.filter(
                  (item) => item.containerType === CONTAINER_TYPES.COLLAPSIBLE,
                ).length > 0 && (
                  <div className="flex flex-col gap-0.5 pl-2 h-5 bg-muted w-10">
                    {section.items.map((item) => (
                      <motion.div
                        key={`trigger-${item.id}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
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
