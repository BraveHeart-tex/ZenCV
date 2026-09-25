import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { action } from 'mobx';
import type React from 'react';
import type { SectionId } from '@/lib/builderDocument/builderDocument';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

interface SectionsDndContextProps {
  children: React.ReactNode;
  sectionIds: readonly SectionId[];
}

export const SectionsDndContext = ({
  children,
  sectionIds,
}: SectionsDndContextProps) => {
  const handleDragEnd = action(async (event: DragEndEvent) => {
    const activeId = event.active.id;
    const overId = event?.over?.id;

    if (!overId || activeId === overId) {
      return;
    }

    const activeIndex = sectionIds.indexOf(activeId as SectionId);
    const overIndex = sectionIds.indexOf(overId as SectionId);

    if (activeIndex === -1 || overIndex === -1) {
      return;
    }

    const newSections = arrayMove([...sectionIds], activeIndex, overIndex);
    const reorderedVisibleSections = [...newSections] as SectionId[];
    const visibleSectionIds = new Set(sectionIds);
    const allSectionsWithHiddenPositionsPreserved = (
      builderRootStore.document?.sections ?? []
    )
      .map((section) => section.id)
      .map((sectionId) =>
        visibleSectionIds.has(sectionId)
          ? (reorderedVisibleSections.shift() ?? sectionId)
          : sectionId
      );

    await builderRootStore.document?.reorderSections(
      allSectionsWithHiddenPositionsPreserved
    );
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={[...sectionIds]}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
};
