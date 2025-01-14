'use client';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { builderSectionTitleClassNames, cn } from '@/lib/utils';
import { observer } from 'mobx-react-lite';

interface BuilderSectionTitleProps {
  sectionId: number;
  className?: string;
}

const BuilderSectionTitle = observer(
  ({ sectionId, className }: BuilderSectionTitleProps) => {
    const section = documentBuilderStore.getSectionById(sectionId)!;

    return (
      <h3 className={cn(builderSectionTitleClassNames, className)}>
        {section.title}
      </h3>
    );
  },
);

export default BuilderSectionTitle;
