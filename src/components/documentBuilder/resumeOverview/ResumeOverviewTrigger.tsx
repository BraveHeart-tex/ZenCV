'use client';
import { CONTAINER_TYPES } from '@/lib/client-db/clientDbSchema';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-m';
import {
  cn,
  getItemContainerId,
  getSectionContainerId,
} from '@/lib/utils/stringUtils';
import type { FocusState } from './ResumeOverview';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { observer } from 'mobx-react-lite';

interface ResumeOverviewTriggerProps {
  visible: boolean;

  focusState: FocusState;
}

const ResumeOverviewTrigger = observer(
  ({ visible, focusState }: ResumeOverviewTriggerProps) => {
    const sectionsWithItems = documentBuilderStore.sectionsWithItems;

    return (
      <AnimatePresence>
        {!visible && (
          <motion.div className="fixed right-5 top-[25%] flex flex-col gap-2">
            {sectionsWithItems.map((section) => {
              return (
                <motion.div
                  key={`trigger-${section.id}`}
                  className={cn(
                    'space-y-2 opacity-50',
                    focusState.sectionId ===
                      getSectionContainerId(section.id) && 'opacity-100',
                  )}
                >
                  <div className="bg-muted-foreground w-6 h-[3.5px] rounded-sm" />
                  {section.items.filter(
                    (item) =>
                      item.containerType === CONTAINER_TYPES.COLLAPSIBLE,
                  ).length > 0 && (
                    <div className="flex flex-col gap-2 pl-2">
                      {section.items.map((item) => (
                        <motion.div
                          key={`trigger-${item.id}`}
                          className={cn(
                            'bg-muted-foreground w-4 h-[3.5px] rounded-sm transition-opacity duration-200',
                            focusState.itemId === getItemContainerId(item.id)
                              ? 'opacity-100'
                              : 'opacity-50',
                          )}
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
  },
);

export default ResumeOverviewTrigger;
