'use client';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import ResumeOverViewContent from './ResumeOverViewContent';
import ResumeOverviewTrigger from './ResumeOverviewTrigger';
import {
  getItemContainerId,
  getSectionContainerId,
  ITEM_ID_PREFIX,
  SECTION_ID_PREFIX,
} from '@/lib/utils/stringUtils';

export interface FocusState {
  sectionId: string | null;
  itemId: string | null;
}

const ResumeOverview = observer(() => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [visible, setVisible] = useState(false);
  const [focusState, setFocusState] = useState<FocusState>({
    sectionId: null,
    itemId: null,
  });

  const sectionsWithItems = documentBuilderStore.sectionsWithItems;

  useEffect(() => {
    // Cleanup previous observer if exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elementId = entry.target.id;

          setFocusState((prev) => ({
            ...prev,
            sectionId: elementId.startsWith(SECTION_ID_PREFIX)
              ? elementId
              : prev.sectionId,
            itemId: elementId.startsWith(ITEM_ID_PREFIX)
              ? elementId
              : prev.itemId,
          }));
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    observerRef.current = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sectionsWithItems.forEach((section) => {
      const sectionElement = document.getElementById(
        getSectionContainerId(section.id),
      );
      if (sectionElement) {
        observerRef?.current?.observe(sectionElement);
      }

      section.items.forEach((item) => {
        const itemElement = document.getElementById(
          getItemContainerId(item.id),
        );

        if (itemElement) {
          observerRef?.current?.observe(itemElement);
        }
      });
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sectionsWithItems]);

  return (
    <div
      className="group fixed right-0 top-0 z-[500] flex items-start"
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
