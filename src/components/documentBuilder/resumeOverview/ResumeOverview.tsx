import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import {
  getItemContainerId,
  getSectionContainerId,
} from '@/lib/utils/stringUtils';
import { ResumeOverViewContent } from './ResumeOverViewContent';
import { ResumeOverviewTrigger } from './ResumeOverviewTrigger';

export interface FocusState {
  sectionId: string | null;
  itemId: string | null;
}

export const ResumeOverview = observer(() => {
  const [visible, setVisible] = useState(false);
  const [focusState, setFocusState] = useState<FocusState>({
    sectionId: null,
    itemId: null,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    if (window.innerWidth < 768) {
      controller.abort();
    }

    const disposeAutorun = autorun(() => {
      if (window.innerWidth < 768) {
        controller.abort();
        return;
      }

      const items =
        builderSession.document?.sections.flatMap((section) => section.items) ??
        [];

      const handleScroll = () => {
        const viewportCenter = window.innerHeight / 2;
        let closestItem: { id: string; distance: number } | null = null;

        builderSession.UIStore.itemRefs.forEach((el) => {
          if (!el) {
            return;
          }

          const rect = el.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - elementCenter);

          if (!closestItem || distance < closestItem.distance) {
            closestItem = { id: el.id, distance };
          }
        });

        if (!closestItem) {
          return;
        }

        const { id: closestItemId } = closestItem;

        const foundItem = items.find(
          (item) => getItemContainerId(item.id) === closestItemId
        );

        if (!foundItem) {
          return;
        }

        setFocusState({
          sectionId: getSectionContainerId(foundItem.sectionId),
          itemId: closestItemId,
        });
      };

      window.addEventListener('scroll', handleScroll, {
        signal: controller.signal,
        passive: true,
      });
    });

    return () => {
      controller.abort();
      disposeAutorun();
    };
  }, []);

  return (
    <article
      className='fixed right-[calc(50%_+_0.5rem)] top-[25%] z-50 hidden flex-row-reverse items-start gap-2 xl:flex'
      onMouseEnter={() => {
        setVisible(true);
      }}
      onMouseLeave={() => {
        setVisible(false);
      }}
      onFocus={() => {
        setVisible(true);
      }}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;
        if (
          !(nextTarget instanceof Node) ||
          !event.currentTarget.contains(nextTarget)
        ) {
          setVisible(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setVisible(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <ResumeOverviewTrigger
        visible={visible}
        onToggle={() => setVisible((current) => !current)}
        triggerRef={triggerRef}
      />
      <ResumeOverViewContent focusState={focusState} visible={visible} />
    </article>
  );
});
