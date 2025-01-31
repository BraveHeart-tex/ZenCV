'use client';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import { observer } from 'mobx-react-lite';
import { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { cn } from '@/lib/utils/stringUtils';

import { builderSectionTitleClassNames } from '@/lib/stores/documentBuilder/documentBuilder.constants';

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
