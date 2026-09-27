import {
  type ItemId,
  WorkExperienceItemModel,
} from '@/lib/builderDocument/builderDocument';
import { getTriggerContent } from '@/lib/helpers/documentBuilderHelpers';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

export const getCollapsibleItemContent = (itemId: ItemId) => {
  const item = builderSession.getItem(itemId);

  if (item instanceof WorkExperienceItemModel) {
    return {
      title: item.entry.heading,
      description: item.entry.dateDescription,
    };
  }

  if (item?.sectionKey === 'websitesSocialLinks') {
    const values = builderSession.resumeDocumentSnapshot?.sections
      .find((section) => section.sectionKey === 'websitesSocialLinks')
      ?.items.find((entry) => entry.id === itemId)?.values;
    return {
      title: values?.label || '(Untitled)',
      description: values?.link || '',
    };
  }

  return getTriggerContent(itemId);
};
