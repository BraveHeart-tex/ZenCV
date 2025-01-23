'use client';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { action } from 'mobx';
import { DEX_Section } from '@/lib/schema';

interface AddNewItemButtonProps {
  sectionId: DEX_Section['id'];
}

const AddNewItemButton = observer(({ sectionId }: AddNewItemButtonProps) => {
  const handleAddItem = action(async () => {
    await documentBuilderStore.addNewItemEntry(sectionId);
  });

  return (
    <Button
      className="flex items-center justify-start w-full gap-1 mt-1 font-medium"
      variant="ghost"
      onClick={handleAddItem}
    >
      <PlusIcon /> Add new entry
    </Button>
  );
});

export default AddNewItemButton;
