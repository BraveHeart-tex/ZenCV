import type { TemplateOptionWithVariants } from '../appHome/resumeTemplates/resumeTemplates.constants';

export function TemplateImage({
  template,
  variant = 'card',
  imgProps,
}: {
  template: TemplateOptionWithVariants;
  variant?: 'card' | 'hover' | 'modal';
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}) {
  const webpSrc = template.images[variant];
  const avifSrc = webpSrc.replace('.webp', '.avif');

  return (
    <picture>
      <source srcSet={avifSrc} type='image/avif' />
      <source srcSet={webpSrc} type='image/webp' />
      <img
        {...imgProps}
        src={webpSrc}
        alt={template.name}
        loading='lazy'
        fetchPriority='low'
      />
    </picture>
  );
}
