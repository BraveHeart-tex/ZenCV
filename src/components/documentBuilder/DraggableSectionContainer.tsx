'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type React from 'react';
import type { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { cn, getSectionContainerId } from '@/lib/utils/stringUtils';

interface DraggableSectionContainerProps {
  sectionId: DEX_Section['id'];
  children?: React.ReactNode;
  className?: string;
}

export const DraggableSectionContainer = ({
  sectionId,
  children,
  className,
}: DraggableSectionContainerProps) => {
  const { attributes, setNodeRef, transform, transition } = useSortable({
    id: sectionId,
  });

  return (
    <section
      ref={(ref) => {
        setNodeRef(ref);
        builderRootStore.UIStore.setElementRef(
          getSectionContainerId(sectionId),
          ref
        );
      }}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      {...attributes}
      id={getSectionContainerId(sectionId)}
      className={cn('grid gap-2 relative group/container', className)}
    >
      {children}
    </section>
  );
};
