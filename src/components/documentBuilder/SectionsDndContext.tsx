'use client';
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
import type { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

interface SectionsDndContextProps {
  children: React.ReactNode;
  sectionIds: DEX_Section['id'][];
}

export const SectionsDndContext = ({
  children,
  sectionIds,
}: SectionsDndContextProps) => {
  const handleDragEnd = action(async (event: DragEndEvent) => {
    const activeId = event.active.id;
    const overId = event?.over?.id;

    if (!overId || activeId === overId) return;

    const activeIndex = sectionIds.indexOf(activeId as DEX_Section['id']);
    const overIndex = sectionIds.indexOf(overId as DEX_Section['id']);

    if (activeIndex === -1 || overIndex === -1) return;

    const newSections = arrayMove(sectionIds, activeIndex, overIndex);

    await builderRootStore.sectionStore.reOrderSections(newSections);
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
        items={sectionIds}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
};
