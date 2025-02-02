'use client';
import { observer } from 'mobx-react-lite';
import { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { cn } from '@/lib/utils/stringUtils';

import { builderSectionTitleClassNames } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

interface BuilderSectionTitleProps {
  sectionId: DEX_Section['id'];
  className?: string;
}

const BuilderSectionTitle = observer(
  ({ sectionId, className }: BuilderSectionTitleProps) => {
    const section = builderRootStore.sectionStore.getSectionById(sectionId)!;

    return (
      <h3 className={cn(builderSectionTitleClassNames, className)}>
        {section.title}
      </h3>
    );
  },
);

export default BuilderSectionTitle;
