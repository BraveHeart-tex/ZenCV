'use client';
import {
  documentBuilderStore,
  TOGGLE_ITEM_WAIT_MS,
} from '@/lib/stores/documentBuilderStore';
import { observer } from 'mobx-react-lite';
import { Button } from '../ui/button';
import {
  getItemContainerId,
  getSectionContainerId,
} from '@/lib/utils/stringUtils';
import {
  CONTAINER_TYPES,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import { getTriggerContent } from '@/lib/helpers/documentBuilderHelpers';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-m';

const CLASSNAME_TOGGLE_WAIT_MS = 1000 as const;

const highlightedElementClassName = 'highlighted-element';

const ResumeOverview = observer(() => {
  const handleScrollToSection = (sectionId: DEX_Section['id']) => {
    const container = document.getElementById(getSectionContainerId(sectionId));

    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });

      container.classList.add(highlightedElementClassName);
      setTimeout(() => {
        container.classList.remove(highlightedElementClassName);
      }, CLASSNAME_TOGGLE_WAIT_MS);
    }
  };

  const handleScrollToItem = (itemId: DEX_Item['id']) => {
    const container = document.getElementById(getItemContainerId(itemId));
    if (!container) return;

    if (documentBuilderStore.collapsedItemId !== itemId) {
      documentBuilderStore.toggleItem(itemId);
    }

    setTimeout(() => {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
      container.classList.add(highlightedElementClassName);
    }, TOGGLE_ITEM_WAIT_MS);

    setTimeout(() => {
      container.classList.remove(highlightedElementClassName);
    }, CLASSNAME_TOGGLE_WAIT_MS);
  };

  return (
    <div className="group fixed right-0 top-0 z-[500] flex h-full items-start">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0, x: -20 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="min-h-32 bg-popover group-hover:opacity-100 p-3 ml-2 border rounded-md shadow-sm"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="text-muted-foreground pb-2 text-sm font-medium"
          >
            Overview
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex flex-col gap-1.5"
          >
            {documentBuilderStore.sections.map((section, index) => {
              const items = documentBuilderStore
                .getItemsBySectionId(section.id)
                .filter(
                  (item) => item.containerType === CONTAINER_TYPES.COLLAPSIBLE,
                );
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1), duration: 0.2 }}
                >
                  <Button
                    className="hover:bg-muted/70 w-full justify-start px-1.5 text-sm font-normal"
                    variant="ghost"
                    onClick={() => {
                      handleScrollToSection(section.id);
                    }}
                  >
                    {section.title}
                  </Button>
                  {items.length > 0 && (
                    <div className="flex flex-col gap-0.5 pl-2">
                      {items.map((item, itemIndex) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.1 * (index + 1) + 0.05 * itemIndex,
                            duration: 0.2,
                          }}
                        >
                          <Button
                            className="hover:bg-muted/70 w-full justify-start px-1.5 text-xs font-normal text-muted-foreground"
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
      </AnimatePresence>
    </div>
  );
});

export default ResumeOverview;
