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

  if (item?.sectionKey === 'courses') {
    const values = builderSession.resumeDocumentSnapshot?.sections
      .find((section) => section.sectionKey === 'courses')
      ?.items.find((entry) => entry.id === itemId)?.values;
    const course = values?.course ?? '';
    const institution = values?.institution ?? '';
    const startDate = values?.startDate ?? '';
    const endDate = values?.endDate ?? '';
    return {
      title: course
        ? institution
          ? `${course} at ${institution}`
          : course
        : institution || '(Not Specified)',
      description: startDate
        ? endDate
          ? `${startDate} - ${endDate}`
          : startDate
        : endDate,
    };
  }

  return getTriggerContent(itemId);
};
