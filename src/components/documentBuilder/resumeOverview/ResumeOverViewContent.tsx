import { observer } from 'mobx-react-lite';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-m';
import { Button } from '@/components/ui/button';
import {
  CONTAINER_TYPES,
  type DEX_Item,
  type DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import {
  getTriggerContent,
  scrollItemIntoView,
} from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { highlightedElementClassName } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  cn,
  getItemContainerId,
  getSectionContainerId,
} from '@/lib/utils/stringUtils';
import type { FocusState } from './ResumeOverview';

interface ResumeOverViewContentProps {
  visible: boolean;
  focusState: FocusState;
}

export const ResumeOverViewContent = observer(
  ({ visible, focusState }: ResumeOverViewContentProps) => {
    const sectionsWithItems = builderRootStore.sectionStore.sectionsWithItems;

    const handleScrollToSection = (sectionId: DEX_Section['id']) => {
      const container = document.getElementById(
        getSectionContainerId(sectionId)
      );
      if (!container) return;
      container.scrollIntoView({ behavior: 'instant', block: 'center' });
      const checkScrollCompletion = () => {
        const rect = container.getBoundingClientRect();
        const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
        if (isInView) {
          container.classList.add(highlightedElementClassName);
          setTimeout(
            () => container.classList.remove(highlightedElementClassName),
            500
          );
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
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='bg-popover/95 backdrop-blur-sm w-64 mr-3 border border-border/60 rounded-lg shadow-lg overflow-hidden'
          >
            <div className='px-3 py-2.5 border-b border-border/40'>
              <p className='text-xs font-semibold tracking-widest uppercase text-muted-foreground/60'>
                Overview
              </p>
            </div>

            <div className='flex flex-col py-1.5 max-h-[50vh] overflow-y-auto'>
              {sectionsWithItems.map((section) => {
                const isSectionFocused =
                  focusState.sectionId === getSectionContainerId(section.id);
                const collapsibleItems = section.items.filter(
                  (item) => item.containerType === CONTAINER_TYPES.COLLAPSIBLE
                );

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Button
                      className={cn(
                        'justify-start w-full px-3 h-8 text-sm font-medium rounded-none',
                        'hover:bg-muted/60 transition-colors',
                        isSectionFocused
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                      variant='ghost'
                      onClick={() => handleScrollToSection(section.id)}
                    >
                      {section.title}
                    </Button>

                    {collapsibleItems.length > 0 && (
                      <div className='flex flex-col mb-0.5 gap-1'>
                        {collapsibleItems.map((item) => {
                          const isItemFocused =
                            focusState.itemId === getItemContainerId(item.id);
                          return (
                            <Button
                              key={item.id}
                              className={cn(
                                'justify-start w-full pl-6 pr-3 h-7 text-xs font-normal rounded-none',
                                'hover:bg-muted/60 transition-colors truncate',
                                isItemFocused
                                  ? 'text-foreground'
                                  : 'text-muted-foreground/70 hover:text-muted-foreground'
                              )}
                              variant='ghost'
                              onClick={() => handleScrollToItem(item.id)}
                            >
                              <span className='truncate'>
                                {getTriggerContent(item.id).title}
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
