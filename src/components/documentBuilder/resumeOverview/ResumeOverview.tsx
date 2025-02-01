'use client';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import ResumeOverViewContent from './ResumeOverViewContent';
import ResumeOverviewTrigger from './ResumeOverviewTrigger';
import {
  getItemContainerId,
  getSectionContainerId,
} from '@/lib/utils/stringUtils';
import { autorun } from 'mobx';

export interface FocusState {
  sectionId: string | null;
  itemId: string | null;
}

const ResumeOverview = observer(() => {
  const [visible, setVisible] = useState(false);
  const [focusState, setFocusState] = useState<FocusState>({
    sectionId: null,
    itemId: null,
  });

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

      const items = documentBuilderStore.items;

      const handleScroll = () => {
        const viewportCenter = window.innerHeight / 2;
        let closestItem: { id: string; distance: number } | null = null;

        documentBuilderStore.itemRefs.forEach((el) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - elementCenter);

          if (!closestItem || distance < closestItem.distance) {
            closestItem = { id: el.id, distance };
          }
        });

        if (closestItem) {
          const foundItem = items.find(
            (item) => getItemContainerId(item.id) === closestItem!.id,
          );

          if (foundItem) {
            setFocusState({
              sectionId: getSectionContainerId(foundItem?.sectionId),
              itemId: (closestItem as { id: string }).id,
            });
          }
        }
      };

      window.addEventListener('scroll', handleScroll, {
        signal: controller.signal,
      });
    });

    return () => {
      controller.abort();
      disposeAutorun();
    };
  }, []);

  return (
    <div
      className="group fixed right-0 top-[25%] z-[500] flex items-start"
      onMouseEnter={() => {
        setVisible(true);
      }}
      onMouseLeave={() => {
        setVisible(false);
      }}
    >
      <ResumeOverviewTrigger focusState={focusState} visible={visible} />
      <ResumeOverViewContent focusState={focusState} visible={visible} />
    </div>
  );
});

export default ResumeOverview;
