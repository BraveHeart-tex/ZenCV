'use client';
import { observer } from 'mobx-react-lite';
import type { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

import { builderSectionTitleClassNames } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { cn } from '@/lib/utils/stringUtils';

interface BuilderSectionTitleProps {
  sectionId: DEX_Section['id'];
  className?: string;
}

export const BuilderSectionTitle = observer(
  ({ sectionId, className }: BuilderSectionTitleProps) => {
    const section = builderRootStore.sectionStore.getSectionById(sectionId);

    if (!section) {
      return null;
    }

    return (
      <h3 className={cn(builderSectionTitleClassNames, className)}>
        {section.title}
      </h3>
    );
  }
);
