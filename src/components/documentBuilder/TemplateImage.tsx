import type { TemplateOptionWithVariants } from '../appHome/resumeTemplates/resumeTemplates.constants';

type RequireKeys<T extends object, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;

export function TemplateImage({
  template,
  variant = 'card',
  imgProps,
}: {
  template: TemplateOptionWithVariants;
  variant?: 'card' | 'hover' | 'modal';
  imgProps: RequireKeys<
    React.ImgHTMLAttributes<HTMLImageElement>,
    'width' | 'height'
  >;
}) {
  const webpSrc = template.images[variant];
  const avifSrc = webpSrc.replace('.webp', '.avif');

  return (
    <picture>
      <source srcSet={avifSrc} type='image/avif' />
      <source srcSet={webpSrc} type='image/webp' />
      <img
        {...imgProps}
        width={imgProps.width}
        height={imgProps.height}
        src={webpSrc}
        alt={template.name}
        loading='lazy'
        fetchPriority='low'
      />
    </picture>
  );
}
