'use client';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
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
  const [visible, setVisible] = useState(false);
  const [focusState, setFocusState] = useState<FocusState>({
    sectionId: null,
    itemId: null,
  });

  const sectionsWithItems = documentBuilderStore.sections.map((section) => {
    return {
      ...section,
      items: documentBuilderStore.getItemsBySectionId(section.id),
    };
  });

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elementId = entry.target.id;

          if (elementId.startsWith(SECTION_ID_PREFIX)) {
            setFocusState((prev) => ({
              ...prev,
              sectionId: elementId,
            }));
          } else if (elementId.startsWith(ITEM_ID_PREFIX)) {
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
    <div
      className="group fixed right-0 top-0 z-[500] flex items-start"
      onMouseEnter={() => {
        setVisible(true);
      }}
      onMouseLeave={() => {
        setVisible(false);
      }}
    >
      <ResumeOverviewTrigger
        focusState={focusState}
        visible={visible}
        sectionsWithItems={sectionsWithItems}
      />
      <ResumeOverViewContent
        focusState={focusState}
        visible={visible}
        sectionsWithItems={sectionsWithItems}
      />
    </div>
  );
});

export default ResumeOverview;
