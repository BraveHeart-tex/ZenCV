// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react';
import type { ComponentProps, ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Carousel } from '@/components/ui/carousel';
import { MobileTemplatePickerContent } from '../MobileTemplatePickerContent';

const mocks = vi.hoisted(() => ({
  carousel: vi.fn(),
  document: { templateType: 'second' },
}));

vi.mock('@/lib/stores/documentBuilder/builderSession', () => ({
  builderSession: {
    document: mocks.document,
    UIStore: { isMobileTemplateSelectorVisible: true },
  },
}));

vi.mock(
  '@/components/appHome/resumeTemplates/resumeTemplates.constants',
  () => ({
    templateOptionsWithImages: [{ value: 'first' }, { value: 'second' }],
  })
);

vi.mock('@/components/ui/carousel', () => ({
  Carousel: (props: ComponentProps<typeof Carousel>) => {
    mocks.carousel(props);
    return <div>{props.children}</div>;
  },
  CarouselContent: ({ children }: { children: ReactNode }) => children,
  CarouselPrevious: () => null,
  CarouselNext: () => null,
}));

vi.mock('../MobileTemplatePickerItem', () => ({
  MobileTemplatePickerItem: () => null,
}));

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
  useReducedMotion: () => false,
}));

vi.mock('motion/react-m', () => ({
  div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mocks.document.templateType = 'second';
});

describe('MobileTemplatePickerContent', () => {
  it('initializes the carousel at the selected template', () => {
    render(<MobileTemplatePickerContent />);

    expect(mocks.carousel.mock.calls[0][0].opts).toEqual({
      align: 'start',
      dragFree: true,
      startIndex: 1,
    });
  });

  it('initializes at the first slide for an unknown template', () => {
    mocks.document.templateType = 'unknown';

    render(<MobileTemplatePickerContent />);

    expect(mocks.carousel.mock.calls[0][0].opts).toEqual({
      align: 'start',
      dragFree: true,
      startIndex: 0,
    });
  });
});
