import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LandingSectionIntro } from '@/components/landingPage/LandingSectionIntro';
import { Button } from '@/components/ui/button';
import { templateOptionsWithImages } from '../../appHome/resumeTemplates/resumeTemplates.constants';
import { TemplateCard } from './TemplateCard';

export const Templates = () => {
  const railRef = useRef<HTMLElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const updateScrollState = useCallback(() => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const startInset = Number.parseFloat(
      window.getComputedStyle(rail).paddingLeft
    );
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setCanScrollPrev(rail.scrollLeft > startInset + 1);
    setCanScrollNext(rail.scrollLeft < maxScroll - 1);
  }, []);

  const scrollByCard = useCallback(
    (direction: -1 | 1) => {
      const rail = railRef.current;
      const firstSlide = rail?.querySelector<HTMLElement>(
        '[data-template-slide]'
      );
      if (!rail || !firstSlide) {
        return;
      }

      const track = rail.firstElementChild;
      const gap = Number.parseFloat(
        track ? window.getComputedStyle(track).columnGap : '0'
      );
      rail.scrollBy({
        left:
          direction * (firstSlide.offsetWidth + (Number.isNaN(gap) ? 0 : gap)),
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    },
    [shouldReduceMotion]
  );

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    updateScrollState();
    rail.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(updateScrollState);
    resizeObserver?.observe(rail);
    if (rail.firstElementChild) {
      resizeObserver?.observe(rail.firstElementChild);
    }

    return () => {
      rail.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      resizeObserver?.disconnect();
    };
  }, [updateScrollState]);

  return (
    <section
      id='templates'
      aria-labelledby='templates-title'
      className='scroll-mt-28 border-t border-border/70 px-[var(--page-gutter)] py-20 sm:py-24 lg:py-28'
    >
      <div className='mx-auto max-w-7xl'>
        <LandingSectionIntro
          titleId='templates-title'
          title='Pick your style.'
          description='Five polished layouts for different roles, levels, and personal taste.'
        />

        <div className='mb-5 mt-8 flex items-center justify-between gap-4 sm:mb-6 sm:mt-10'>
          <p className='text-sm text-muted-foreground'>
            Swipe or scroll to explore all five layouts.
          </p>
          <div className='flex shrink-0 items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              aria-label='Previous resume templates'
              className='size-11'
              onClick={() => scrollByCard(-1)}
              disabled={!canScrollPrev}
            >
              <ChevronLeft aria-hidden='true' className='size-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              aria-label='Next resume templates'
              className='size-11'
              onClick={() => scrollByCard(1)}
              disabled={!canScrollNext}
            >
              <ChevronRight aria-hidden='true' className='size-4' />
            </Button>
          </div>
        </div>

        <section
          ref={railRef}
          aria-label='Five resume templates'
          aria-roledescription='carousel'
          className='-mx-[var(--page-gutter)] snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-[var(--page-gutter)] pb-3 pt-1'
        >
          <ul className='flex list-none gap-6'>
            {templateOptionsWithImages.map((template) => (
              <li
                key={template.name}
                data-template-slide
                className='w-[min(82vw,18rem)] shrink-0 snap-start sm:w-[min(40vw,17rem)] lg:w-[15rem] xl:w-[13.5rem]'
              >
                <TemplateCard template={template} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
};
