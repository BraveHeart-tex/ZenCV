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
import type { DEX_Item } from '@/lib/client-db/clientDbSchema';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

interface ItemsDndContextProps {
  children: React.ReactNode;
  items: DEX_Item['id'][];
}

export const ItemsDndContext = ({ children, items }: ItemsDndContextProps) => {
  const handleDragEnd = action(async (event: DragEndEvent) => {
    const activeId = event.active.id;
    const overId = event?.over?.id;

    if (!overId || activeId === overId) return;

    const activeIndex = items.indexOf(activeId as DEX_Item['id']);
    const overIndex = items.indexOf(overId as DEX_Item['id']);

    if (activeIndex === -1 || overIndex === -1) return;

    const newItems = arrayMove(items, activeIndex, overIndex);
    await builderRootStore.itemStore.reOrderSectionItems(newItems);
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
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};
