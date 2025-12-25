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
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import type { SectionWithParsedMetadata } from '@/lib/types/documentBuilder.types';

interface SectionsDndContextProps {
  children: React.ReactNode;
  sections: SectionWithParsedMetadata[];
}

export const SectionsDndContext = ({
  children,
  sections,
}: SectionsDndContextProps) => {
  const handleDragEnd = action(async (event: DragEndEvent) => {
    const activeId = event.active.id;
    const overId = event?.over?.id;

    if (!overId || activeId === overId) return;

    const activeIndex = sections.findIndex(
      (section) => section.id === activeId
    );
    const overIndex = sections.findIndex((section) => section.id === overId);

    if (activeIndex === -1 || overIndex === -1) return;

    const newSections = arrayMove(sections, activeIndex, overIndex);

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
      <SortableContext items={sections} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};
