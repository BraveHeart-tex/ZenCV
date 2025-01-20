'use client';
import type React from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Section } from '@/lib/schema';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { action } from 'mobx';

interface SectionsDndContextProps {
  children: React.ReactNode;
  sections: Section[];
}

const SectionsDndContext = ({
  children,
  sections,
}: SectionsDndContextProps) => {
  const handleDragEnd = action(async (event: DragEndEvent) => {
    const activeId = event.active.id;
    const overId = event?.over?.id;

    if (!overId || activeId === overId) return;

    const activeIndex = sections.findIndex(
      (section) => section.id === activeId,
    );
    const overIndex = sections.findIndex((section) => section.id === overId);

    if (activeIndex === -1 || overIndex === -1) return;

    const newSections = arrayMove(sections, activeIndex, overIndex);

    await documentBuilderStore.reOrderSections(newSections);
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
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

export default SectionsDndContext;
