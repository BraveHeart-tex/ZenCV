'use client';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import ResumeOverViewContent from './ResumeOverViewContent';
import ResumeOverviewTrigger from './ResumeOverviewTrigger';

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
        setFocusState={setFocusState}
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
