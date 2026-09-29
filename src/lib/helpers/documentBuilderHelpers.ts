import { showErrorToast } from '@/components/ui/sonner';
import type { ItemId } from '@/lib/builderDocument/builderDocument';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { highlightedElementClassName } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { getLuminance, hexToRgb } from '@/lib/utils/colorUtils';
import { getItemContainerId } from '@/lib/utils/stringUtils';

export const getTriggerContent = (
  itemId: number
): {
  title: string;
  description: string;
} => {
  const item = builderSession.getItem(itemId as ItemId);
  if (!item) {
    return {
      description: '',
      title: '',
    };
  }

  if (item.sectionKey === 'education') {
    return getEducationSectionTitle(itemId);
  }

  if (item.sectionKey === 'internships') {
    const values = builderSession.resumeDocumentSnapshot?.sections
      .find((section) => section.sectionKey === 'internships')
      ?.items.find((entry) => entry.id === itemId)?.values;
    const jobTitle = values?.role ?? '';
    const employer = values?.employer ?? '';
    const startDate = values?.startDate ?? '';
    const endDate = values?.endDate ?? '';
    const hasTitle = Boolean(jobTitle || employer);
    return {
      title: jobTitle
        ? employer
          ? `${jobTitle} at ${employer}`
          : jobTitle
        : employer || '(Untitled)',
      description: hasTitle
        ? `${startDate} ${startDate && endDate ? '-' : ''} ${endDate}`
        : '',
    };
  }

  switch (item.sectionKey) {
    case 'custom': {
      return getCustomSectionTitle(itemId);
    }
    case 'references': {
      return getReferencesSectionTitle(itemId);
    }
    default: {
      return { description: '', title: '' };
    }
  }
};

const getEducationSectionTitle = (itemId: number) => {
  const values = builderSession.resumeDocumentSnapshot?.sections
    .find((section) => section.sectionKey === 'education')
    ?.items.find((item) => item.id === itemId)?.values;
  const schoolTitle = values?.school ?? '';
  const degree = values?.degree ?? '';
  const startDate = values?.startDate ?? '';
  const endDate = values?.endDate ?? '';

  let triggerTitle =
    degree && schoolTitle
      ? `${degree} at ${schoolTitle}`
      : degree
        ? degree
        : schoolTitle;
  let description = `${startDate} ${startDate && endDate ? '-' : ''} ${endDate}`;
  if (!schoolTitle && !degree) {
    triggerTitle = '(Untitled)';
    description = '';
  }

  return {
    title: triggerTitle,
    description,
  };
};

const getCustomSectionTitle = (itemId: number) => {
  let values: Readonly<Record<string, string>> | undefined;
  for (const section of builderSession.resumeDocumentSnapshot?.sections ?? []) {
    if (section.sectionKey !== 'custom') {
      continue;
    }
    values = section.items.find((item) => item.id === itemId)?.values;
    if (values) {
      break;
    }
  }
  const name = values?.activityName ?? '';
  const city = values?.city ?? '';
  const startDate = values?.startDate ?? '';
  const endDate = values?.endDate ?? '';

  const triggerTitle = name
    ? city
      ? `${name}, ${city}`
      : name
    : '(Not Specified)';
  const triggerDescription = startDate
    ? endDate
      ? `${startDate} - ${endDate}`
      : startDate
    : endDate
      ? endDate
      : '';

  return {
    title: triggerTitle,
    description: triggerDescription,
  };
};

const getReferencesSectionTitle = (itemId: number) => {
  const values = builderSession.resumeDocumentSnapshot?.sections
    .find((section) => section.sectionKey === 'references')
    ?.items.find((item) => item.id === itemId)?.values;
  const referentFullName = values?.referentFullName || '(Not Specified)';
  const company = values?.company ?? '';

  return {
    title: referentFullName,
    description: company || '',
  };
};

export const getTextColorForBackground = (bgColor: string) => {
  const rgb = hexToRgb(bgColor);
  const luminance = getLuminance(rgb);

  // If the luminance is low (dark background), use light text (white), else use dark text (black)
  return luminance < 0.5 ? '#ffffff' : '#000000';
};

export const getScoreColor = (
  score: number
): {
  color: string;
  backgroundColor: string;
} => {
  let bgColor: string;

  if (score <= 24) {
    bgColor = '#d32f2f'; // Red
  } else if (score <= 49) {
    bgColor = '#f57c00'; // Orange
  } else if (score <= 74) {
    bgColor = '#fbc02d'; // Yellow
  } else {
    bgColor = '#388e3c'; // Green
  }

  const textColor = getTextColorForBackground(bgColor);
  return { backgroundColor: bgColor, color: textColor };
};

export const scrollItemIntoView = (
  itemId: number,
  onItemInView?: () => void
): void => {
  const element = builderSession.UIStore.itemRefs.get(
    getItemContainerId(itemId)
  );
  if (!element) {
    return;
  }

  if (builderSession.UIStore.collapsedItemId !== itemId) {
    builderSession.UIStore.toggleItem(itemId as ItemId);
  }

  const scrollAndHighlight = () => {
    element.scrollIntoView({ behavior: 'instant', block: 'center' });

    const checkScrollCompletion = () => {
      const rect = element.getBoundingClientRect();
      const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (isInView) {
        onItemInView?.();
        element.classList.add(highlightedElementClassName);
        setTimeout(() => {
          element.classList.remove(highlightedElementClassName);
        }, 500);
      } else {
        requestAnimationFrame(checkScrollCompletion);
      }
    };

    requestAnimationFrame(checkScrollCompletion);
  };

  setTimeout(scrollAndHighlight, 300);
};

export const downloadPDF = ({
  file,
  title,
}: {
  file: string;
  title: string;
}) => {
  const fileName = `${title}.pdf`;
  if (!file) {
    showErrorToast("File doesn't exist. Please try again.");
    return;
  }

  const link = document.createElement('a');
  link.href = file;
  link.download = fileName;
  link.click();
};
