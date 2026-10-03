import { cn } from '@/lib/utils/stringUtils';

interface LandingSectionIntroProps {
  title: string;
  description: string;
  titleId?: string;
  className?: string;
}

export const LandingSectionIntro = ({
  title,
  description,
  titleId,
  className,
}: LandingSectionIntroProps) => {
  return (
    <div className={cn('mx-auto max-w-3xl space-y-5 text-center', className)}>
      <h2
        id={titleId}
        className='text-balance text-[clamp(2.25rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em]'
      >
        {title}
      </h2>
      <p className='mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg'>
        {description}
      </p>
    </div>
  );
};
