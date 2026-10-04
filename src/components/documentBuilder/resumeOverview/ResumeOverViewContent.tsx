import { observer } from 'mobx-react-lite';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-m';
import { Button } from '@/components/ui/button';
import { isCollapsibleItem } from '@/lib/builderDocument/builderDocument';
import { scrollItemIntoView } from '@/lib/helpers/documentBuilderHelpers';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { highlightedElementClassName } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  cn,
  getItemContainerId,
  getSectionContainerId,
} from '@/lib/utils/stringUtils';
import { getCollapsibleItemContent } from '../collapsibleItemContainer/getCollapsibleItemContent';
import type { FocusState } from './ResumeOverview';

interface ResumeOverViewContentProps {
  visible: boolean;
  focusState: FocusState;
}

export const ResumeOverViewContent = observer(
  ({ visible, focusState }: ResumeOverViewContentProps) => {
    const sectionsWithItems = builderSession.document?.sections ?? [];

    const handleScrollToSection = (sectionId: number) => {
      const container = document.getElementById(
        getSectionContainerId(sectionId)
      );
      if (!container) {
        return;
      }
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

    const handleScrollToItem = (itemId: number) => {
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
            id='resume-overview-panel'
            role='region'
            aria-label='Resume overview'
            className='bg-popover w-64 overflow-hidden rounded-md border border-border shadow-overlay'
          >
            <div className='border-b border-border/60 px-3 py-2.5'>
              <p className='text-sm font-medium'>Resume overview</p>
            </div>

            <div className='flex flex-col py-1.5 max-h-[50vh] overflow-y-auto'>
              {sectionsWithItems.map((section) => {
                const isSectionFocused =
                  focusState.sectionId === getSectionContainerId(section.id);
                const collapsibleItems =
                  section.items.filter(isCollapsibleItem);

                return (
                  <div key={section.id}>
                    <Button
                      className={cn(
                        'h-9 w-full justify-start rounded-none px-3 text-sm font-medium transition-colors motion-reduce:transition-none',
                        'hover:bg-muted/60',
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
                                'h-8 w-full justify-start truncate rounded-none py-1 pl-6 pr-3 text-xs font-normal transition-colors motion-reduce:transition-none',
                                'hover:bg-muted/60',
                                isItemFocused
                                  ? 'text-foreground'
                                  : 'text-muted-foreground/70 hover:text-muted-foreground'
                              )}
                              variant='ghost'
                              onClick={() => handleScrollToItem(item.id)}
                            >
                              <span className='truncate'>
                                {getCollapsibleItemContent(item.id).title}
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
