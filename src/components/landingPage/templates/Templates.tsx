import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { templateOptionsWithImages } from '../../appHome/resumeTemplates/resumeTemplates.constants';
import { TemplateCard } from './TemplateCard';

export const Templates = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id='templates' className='md:py-24 lg:py-32 w-full py-12'>
      <div className='container px-4 md:px-6 mx-auto'>
        <div className='flex items-end justify-between mb-10 gap-4'>
          <div className='space-y-3'>
            <p className='text-xs font-semibold tracking-widest uppercase text-muted-foreground/60'>
              Templates
            </p>
            <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
              Pick your style.
            </h2>
            <p className='text-muted-foreground text-base max-w-md'>
              ATS-friendly templates designed for every industry and career
              stage.
            </p>
          </div>

          <div className='flex items-center gap-2 shrink-0'>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={scrollPrev}
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={scrollNext}
            >
              <ChevronRight className='w-4 h-4' />
            </Button>
          </div>
        </div>

        <div className='overflow-hidden' ref={emblaRef}>
          <div className='flex gap-5'>
            {templateOptionsWithImages.map((template) => (
              <div key={template.name} className='flex-none w-70 sm:w-75'>
                <TemplateCard template={template} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
