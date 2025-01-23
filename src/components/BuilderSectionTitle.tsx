'use client';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { builderSectionTitleClassNames, cn } from '@/lib/utils';
import { observer } from 'mobx-react-lite';
import { DEX_Section } from '@/lib/schema';

interface BuilderSectionTitleProps {
  sectionId: DEX_Section['id'];
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
