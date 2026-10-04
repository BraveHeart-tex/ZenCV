import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type React from 'react';
import { memo } from 'react';
import type { SectionId } from '@/lib/builderDocument/builderDocument';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { cn, getSectionContainerId } from '@/lib/utils/stringUtils';

interface DraggableSectionContainerProps {
  sectionId: SectionId;
  children?: React.ReactNode;
  className?: string;
}

export const DraggableSectionContainer = memo(
  ({ sectionId, children, className }: DraggableSectionContainerProps) => {
    const { setNodeRef, transform, transition } = useSortable({
      id: sectionId,
    });

    return (
      <section
        ref={(ref) => {
          setNodeRef(ref);
          builderSession.UIStore.setElementRef(
            getSectionContainerId(sectionId),
            ref
          );
        }}
        style={{
          transition,
          transform: CSS.Translate.toString(transform),
        }}
        id={getSectionContainerId(sectionId)}
        className={cn(
          'relative grid gap-3 border-t border-border/50 py-5 first:border-t-0 first:pt-0 group/container',
          className
        )}
      >
        {children}
      </section>
    );
  }
);

DraggableSectionContainer.displayName = 'DraggableSectionContainer';
