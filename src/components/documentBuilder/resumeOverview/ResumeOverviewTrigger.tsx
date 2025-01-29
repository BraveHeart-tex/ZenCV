'use client';
import { CONTAINER_TYPES } from '@/lib/client-db/clientDbSchema';
import { type SectionWithItems } from '@/lib/types';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-m';
import { type Dispatch, type SetStateAction, useEffect } from 'react';
import {
  cn,
  getItemContainerId,
  getSectionContainerId,
} from '@/lib/utils/stringUtils';
import type { FocusState } from './ResumeOverview';

interface ResumeOverviewTriggerProps {
  visible: boolean;
  sectionsWithItems: SectionWithItems[];

  focusState: FocusState;
  setFocusState: Dispatch<SetStateAction<FocusState>>;
}

const ResumeOverviewTrigger = ({
  sectionsWithItems,
  visible,
  focusState,
  setFocusState,
}: ResumeOverviewTriggerProps) => {
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elementId = entry.target.id;

          if (elementId.startsWith('section-')) {
            setFocusState((prev) => ({
              ...prev,
              sectionId: elementId,
            }));
          } else if (elementId.startsWith('item-')) {
            setFocusState((prev) => ({
              ...prev,
              itemId: elementId,
            }));
          }
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sectionsWithItems.forEach((section) => {
      const sectionElement = document.getElementById(
        getSectionContainerId(section.id),
      );
      if (sectionElement) {
        observer.observe(sectionElement);
      }

      section.items.forEach((item) => {
        const itemElement = document.getElementById(
          getItemContainerId(item.id),
        );
        if (itemElement) {
          observer.observe(itemElement);
        }
      });
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionsWithItems]);

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
                  focusState.sectionId === getSectionContainerId(section.id) &&
                    'opacity-100',
                )}
              >
                <div className="bg-muted-foreground w-6 h-[3.5px] rounded-sm" />
                {section.items.filter(
                  (item) => item.containerType === CONTAINER_TYPES.COLLAPSIBLE,
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
};

export default ResumeOverviewTrigger;
