'use client';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
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

const highlightClassNames = [
  'bg-muted',
  'transition-all',
  'ease-in-out',
  'rounded-md',
];

const CLASSNAME_TOGGLE_WAIT_MS = 1000 as const;

const ResumeOverview = observer(() => {
  const handleScrollToSection = (sectionId: DEX_Section['id']) => {
    const container = document.getElementById(getSectionContainerId(sectionId));

    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });

      container.classList.add(...highlightClassNames);
      setTimeout(() => {
        container.classList.remove(...highlightClassNames);
      }, CLASSNAME_TOGGLE_WAIT_MS);
    }
  };

  const handleScrollToItem = (itemId: DEX_Item['id']) => {
    const container = document.getElementById(getItemContainerId(itemId));

    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });

      container.classList.add(...highlightClassNames);
      setTimeout(() => {
        container.classList.remove(...highlightClassNames);
      }, CLASSNAME_TOGGLE_WAIT_MS);
    }
  };

  return (
    <div className="fixed top-0 left-0 min-h-32 p-2 rounded-md z-[500] bg-popover shadow-sm border">
      <div className="flex flex-col gap-2">
        {documentBuilderStore.sections.map((section) => {
          const items = documentBuilderStore
            .getItemsBySectionId(section.id)
            .filter(
              (item) => item.containerType === CONTAINER_TYPES.COLLAPSIBLE,
            );
          return (
            <div key={section.id}>
              <Button
                className="hover:bg-muted justify-start w-full px-1"
                variant="ghost"
                onClick={() => {
                  handleScrollToSection(section.id);
                }}
              >
                {section.title}
              </Button>
              {items.length > 0 && (
                <div className="flex flex-col pl-2">
                  {items.map((item) => (
                    <Button
                      key={item.id}
                      className="hover:bg-muted justify-start w-full px-1"
                      variant={'ghost'}
                      onClick={() => {
                        handleScrollToItem(item.id);
                      }}
                    >
                      {getTriggerContent(item.id).title}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ResumeOverview;
