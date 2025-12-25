'use client';
import { observer } from 'mobx-react-lite';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-m';
import { CONTAINER_TYPES } from '@/lib/client-db/clientDbSchema';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import {
  cn,
  getItemContainerId,
  getSectionContainerId,
} from '@/lib/utils/stringUtils';
import type { FocusState } from './ResumeOverview';

interface ResumeOverviewTriggerProps {
  visible: boolean;

  focusState: FocusState;
}

export const ResumeOverviewTrigger = observer(
  ({ visible, focusState }: ResumeOverviewTriggerProps) => {
    const sectionsWithItems = builderRootStore.sectionStore.sectionsWithItems;

    return (
      <AnimatePresence>
        {!visible && (
          <motion.div className='fixed right-5 top-[25%] flex-col gap-2 hidden xl:flex'>
            {sectionsWithItems.map((section) => {
              return (
                <motion.div
                  key={`section-trigger-${section.id}`}
                  className={cn(
                    'space-y-2 opacity-50',
                    focusState.sectionId ===
                      getSectionContainerId(section.id) && 'opacity-100'
                  )}
                >
                  <div className='bg-muted-foreground w-6 h-[3.5px] rounded-sm' />
                  {section.items.filter(
                    (item) => item.containerType === CONTAINER_TYPES.COLLAPSIBLE
                  ).length > 0 && (
                    <div className='flex flex-col gap-2 pl-2'>
                      {section.items.map((item) => (
                        <motion.div
                          key={`item-trigger-${item.id}`}
                          className={cn(
                            'bg-muted-foreground w-4 h-[3.5px] rounded-sm transition-opacity duration-200',
                            focusState.itemId === getItemContainerId(item.id)
                              ? 'opacity-100'
                              : 'opacity-50'
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
  }
);
