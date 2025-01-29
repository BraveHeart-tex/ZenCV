'use client';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import ResumeOverViewContent from './ResumeOverViewContent';
import ResumeOverviewTrigger from './ResumeOverviewTrigger';

const ResumeOverview = observer(() => {
  const [visible, setVisible] = useState(false);

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
        visible={visible}
        sectionsWithItems={sectionsWithItems}
      />
      <ResumeOverViewContent
        visible={visible}
        sectionsWithItems={sectionsWithItems}
      />
    </div>
  );
});

export default ResumeOverview;
