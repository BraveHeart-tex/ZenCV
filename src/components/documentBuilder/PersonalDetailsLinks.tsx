import { PlusIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { showErrorToast } from '@/components/ui/sonner';
import { scrollItemIntoView } from '@/lib/helpers/documentBuilderHelpers';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import {
  INTERNAL_SECTION_TYPES,
  MAX_PERSONAL_DETAILS_LINKS,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { ItemsDndContext } from './ItemsDndContext';
import { SectionItem } from './SectionItem';

export const PersonalDetailsLinks = observer(() => {
  const [isAdding, setIsAdding] = useState(false);
  const isAddingRef = useRef(false);
  const document = builderSession.document;
  const linksSection = document?.websitesSocialLinks;
  const itemIds = linksSection?.itemIds ?? [];
  const isAtLimit = itemIds.length >= MAX_PERSONAL_DETAILS_LINKS;

  const handleAddLink = async () => {
    if (isAddingRef.current || isAtLimit) {
      return;
    }

    isAddingRef.current = true;
    setIsAdding(true);
    try {
      let itemId: number | undefined;
      if (linksSection) {
        itemId = await builderSession.addItem(linksSection.id);
      } else {
        const result = await document?.addSection({
          title: 'Links',
          defaultTitle: 'Links',
          type: INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS,
        });
        itemId = result?.success ? result.data?.itemId : undefined;
      }
      if (itemId) {
        scrollItemIntoView(itemId);
      }
    } catch {
      showErrorToast('Failed to add link.');
    } finally {
      isAddingRef.current = false;
      setIsAdding(false);
    }
  };

  return (
    <div className='mt-6 border-t pt-6'>
      <div className='mb-3 space-y-1'>
        <h3 className='font-semibold text-lg'>Links</h3>
        <p className='text-muted-foreground text-sm'>
          Add up to {MAX_PERSONAL_DETAILS_LINKS} professional links to your
          contact details.
        </p>
      </div>

      {itemIds.length ? (
        <div className='space-y-2'>
          <ItemsDndContext items={[...itemIds]}>
            {itemIds.map((itemId) => (
              <SectionItem itemId={itemId} key={itemId} />
            ))}
          </ItemsDndContext>
        </div>
      ) : (
        <p className='text-muted-foreground py-2 text-sm'>
          No professional links added.
        </p>
      )}

      <Button
        className='mt-1 flex w-full items-center justify-start gap-1 font-medium'
        variant='ghost'
        onClick={handleAddLink}
        disabled={isAdding || isAtLimit}
      >
        <PlusIcon />
        {isAdding
          ? 'Adding link...'
          : isAtLimit
            ? `Maximum of ${MAX_PERSONAL_DETAILS_LINKS} links reached`
            : 'Add link'}
      </Button>
    </div>
  );
});
