'use client';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type React from 'react';
import { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { cn, getSectionContainerId } from '@/lib/utils/stringUtils';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

interface DraggableSectionContainerProps {
  sectionId: DEX_Section['id'];
  children?: React.ReactNode;
  className?: string;
}

const DraggableSectionContainer = ({
  sectionId,
  children,
  className,
}: DraggableSectionContainerProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    isSorting,
  } = useSortable({ id: sectionId });

  const shouldShowDragButton = !isDragging && !isOver && !isSorting;

  return (
    <section
      ref={(ref) => {
        setNodeRef(ref);
        builderRootStore.UIStore.setElementRef(
          getSectionContainerId(sectionId),
          ref,
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
      {shouldShowDragButton ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                {...listeners}
                className="cursor-grab lg:pointer-events-none lg:group-hover/container:pointer-events-auto lg:opacity-0 lg:group-hover/container:opacity-100 -left-7 lg:-left-8 top-1 text-muted-foreground touch-none absolute z-10 w-8 h-8 transition-all"
              >
                <GripVertical />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Click and drag to move</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </section>
  );
};

export default DraggableSectionContainer;
