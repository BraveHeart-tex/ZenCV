'use client';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [visible, setVisible] = useState(false);
  const [focusState, setFocusState] = useState<FocusState>({
    sectionId: null,
    itemId: null,
  });

  useEffect(
    () =>
      autorun(() => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }

        const items = documentBuilderStore.items;

        const observerCallback: IntersectionObserverCallback = (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const elementId = entry.target.id;

              const foundItem = items.find(
                (item) => getItemContainerId(item.id) === elementId,
              );

              if (!foundItem) return;

              setFocusState((prev) => ({
                ...prev,
                sectionId: getSectionContainerId(foundItem?.sectionId),
                itemId: elementId,
              }));
            }
          });
        };

        const observerOptions = {
          root: null,
          rootMargin: '0px',
          threshold: 0.1,
        };

        observerRef.current = new IntersectionObserver(
          observerCallback,
          observerOptions,
        );

        items.forEach((item) => {
          const itemElement = documentBuilderStore.refs.get(
            getItemContainerId(item.id),
          );

          if (itemElement) {
            observerRef?.current?.observe(itemElement);
          }
        });
      }),
    [],
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

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
