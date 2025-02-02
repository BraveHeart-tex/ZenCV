'use client';
import { Button } from '../../ui/button';
import {
  CONTAINER_TYPES,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import {
  getTriggerContent,
  scrollItemIntoView,
} from '@/lib/helpers/documentBuilderHelpers';
import {
  getSectionContainerId,
  getItemContainerId,
  cn,
} from '@/lib/utils/stringUtils';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-m';
import { FocusState } from './ResumeOverview';
import { observer } from 'mobx-react-lite';
import { highlightedElementClassName } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

interface ResumeOverViewContentProps {
  visible: boolean;
  focusState: FocusState;
}

const ResumeOverViewContent = observer(
  ({ visible, focusState }: ResumeOverViewContentProps) => {
    const sectionsWithItems = builderRootStore.sectionStore.sectionsWithItems;

    const handleScrollToSection = (sectionId: DEX_Section['id']) => {
      const container = document.getElementById(
        getSectionContainerId(sectionId),
      );
      if (!container) return;

      container.scrollIntoView({ behavior: 'instant', block: 'center' });

      const checkScrollCompletion = () => {
        const rect = container.getBoundingClientRect();
        const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;

        if (isInView) {
          container.classList.add(highlightedElementClassName);

          setTimeout(() => {
            container.classList.remove(highlightedElementClassName);
          }, 500);
        } else {
          requestAnimationFrame(checkScrollCompletion);
        }
      };

      requestAnimationFrame(checkScrollCompletion);
    };

    const handleScrollToItem = (itemId: DEX_Item['id']) => {
      scrollItemIntoView(itemId);
    };

    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-popover group-hover:opacity-100 w-[20rem] p-3 ml-2 border rounded-md shadow-sm"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="text-muted-foreground pb-2 text-sm font-medium"
            >
              Resume Overview
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex flex-col gap-1.5 max-h-[50vh] overflow-auto"
            >
              {sectionsWithItems.map((section) => {
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      className="hover:bg-muted/70 justify-start px-1.5 text-sm font-normal text-ellipsis overflow-hidden w-full"
                      variant="ghost"
                      onClick={() => {
                        handleScrollToSection(section.id);
                      }}
                    >
                      {section.title}
                    </Button>
                    {section.items.length > 0 && (
                      <div className="flex flex-col gap-0.5 pl-2">
                        {section.items
                          .filter(
                            (item) =>
                              item.containerType ===
                              CONTAINER_TYPES.COLLAPSIBLE,
                          )
                          .map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.2,
                              }}
                            >
                              <Button
                                className={cn(
                                  'hover:bg-muted/70 justify-start px-1.5 text-xs font-normal text-muted-foreground overflow-hidden truncate w-full',
                                  focusState.itemId ===
                                    getItemContainerId(item.id) &&
                                    'text-blue-500 hover:text-blue-500',
                                )}
                                variant="ghost"
                                onClick={() => {
                                  handleScrollToItem(item.id);
                                }}
                              >
                                {getTriggerContent(item.id).title}
                              </Button>
                            </motion.div>
                          ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);

export default ResumeOverViewContent;
