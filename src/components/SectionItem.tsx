'use client';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/documentBuilderStore';

const SectionItem = observer(({ itemId }: { itemId: number }) => {
  const fields = documentBuilderStore.getFieldsByItemId(itemId);

  return <div>{JSON.stringify(fields)}</div>;
});

export default SectionItem;
