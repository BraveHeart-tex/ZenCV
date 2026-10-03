import { useState } from 'react';
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
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>(
    'loading'
  );
  const webpSrc = template.images[variant];
  const sizes = imgProps.sizes ?? `${imgProps.width}px`;
  const largeSources = `${template.images.hover} 700w, ${template.images.modal} 1000w`;
  const webpSources =
    variant === 'modal'
      ? largeSources
      : `${template.images.card} 400w, ${largeSources}`;
  const avifSources = webpSources.replaceAll('.webp', '.avif');

  return (
    <picture className='relative block h-full'>
      <source srcSet={avifSources} sizes={sizes} type='image/avif' />
      <source srcSet={webpSources} sizes={sizes} type='image/webp' />
      <img
        {...imgProps}
        width={imgProps.width}
        height={imgProps.height}
        src={webpSrc}
        alt={imgProps.alt ?? template.name}
        loading={imgProps.loading ?? 'lazy'}
        fetchPriority={imgProps.fetchPriority ?? 'auto'}
        onLoad={(event) => {
          setImageState('loaded');
          imgProps.onLoad?.(event);
        }}
        onError={(event) => {
          setImageState('error');
          imgProps.onError?.(event);
        }}
      />
      {imageState !== 'loaded' && (
        <span
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 flex items-center justify-center bg-muted p-2 text-center text-xs text-muted-foreground'
        >
          {imageState === 'error'
            ? 'Preview unavailable'
            : 'Loading preview...'}
        </span>
      )}
    </picture>
  );
}
