import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { templateOptionsWithImages } from '../../appHome/resumeTemplates/resumeTemplates.constants';
import { TemplateCard } from './TemplateCard';

export const Templates = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    slidesToScroll: 1,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    updateScrollState();
    emblaApi.on('select', updateScrollState);
    emblaApi.on('reInit', updateScrollState);

    return () => {
      emblaApi.off('select', updateScrollState);
      emblaApi.off('reInit', updateScrollState);
    };
  }, [emblaApi, updateScrollState]);

  return (
    <section id='templates' className='w-full py-16 md:py-24 lg:py-28'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='mb-10 flex items-end justify-between gap-4'>
          <div className='space-y-3'>
            <p className='text-xs font-semibold uppercase tracking-widest text-muted-foreground/70'>
              Templates
            </p>
            <h2 className='text-balance text-3xl font-bold tracking-tight md:text-4xl'>
              Pick your style.
            </h2>
            <p className='max-w-md text-base text-muted-foreground'>
              Five polished layouts for different roles, levels, and personal
              taste.
            </p>
          </div>

          <div className='flex shrink-0 items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              aria-label='Previous template'
              className='h-8 w-8'
              onClick={scrollPrev}
              disabled={!canScrollPrev}
            >
              <ChevronLeft className='size-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              aria-label='Next template'
              className='h-8 w-8'
              onClick={scrollNext}
              disabled={!canScrollNext}
            >
              <ChevronRight className='size-4' />
            </Button>
          </div>
        </div>

        <div className='overflow-hidden' ref={emblaRef}>
          <div className='flex gap-5'>
            {templateOptionsWithImages.map((template) => (
              <div key={template.name} className='w-70 flex-none sm:w-75'>
                <TemplateCard template={template} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
