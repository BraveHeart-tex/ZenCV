'use client';
import { PlusIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import type { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { scrollItemIntoView } from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

interface AddNewItemButtonProps {
  sectionId: DEX_Section['id'];
}

export const AddNewItemButton = observer(
  ({ sectionId }: AddNewItemButtonProps) => {
    const handleAddItem = action(async () => {
      const itemId =
        await builderRootStore.itemStore.addNewItemEntry(sectionId);
      if (!itemId) return;
      scrollItemIntoView(itemId);
    });

    return (
      <Button
        className='flex items-center justify-start w-full gap-1 mt-1 font-medium'
        variant='ghost'
        onClick={handleAddItem}
      >
        <PlusIcon /> Add new entry
      </Button>
    );
  }
);
