import { PaletteIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ACCENT_COLOR_PRESETS,
  ACCENT_COLOR_SUPPORTED_TEMPLATES,
} from '@/lib/constants/accentColors';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { cn } from '@/lib/utils/stringUtils';

export const AccentColorPicker = observer(() => {
  const document = builderSession.document;

  if (
    !document ||
    !ACCENT_COLOR_SUPPORTED_TEMPLATES.has(document.templateType)
  ) {
    return null;
  }

  const currentColor = document.accentColor;

  const handleColorChange = async (color: string) => {
    await document.changeAccent(color);
  };

  const isCustomColor = !ACCENT_COLOR_PRESETS.some(
    (p) => p.value === currentColor
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label='Change accent color'
          title='Accent color'
          variant='outline'
          size='sm'
          className='h-11 gap-2 sm:h-9'
        >
          <span
            className='w-3.5 h-3.5 rounded-full border border-border/40 shrink-0'
            style={{ backgroundColor: currentColor }}
          />
          <PaletteIcon className='w-3.5 h-3.5' />
          <span className='hidden sm:inline text-xs'>Accent</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-auto p-3' align='end' side='bottom'>
        <div className='flex flex-col gap-3'>
          <p className='text-xs font-semibold tracking-wide uppercase text-muted-foreground'>
            Accent color
          </p>

          <div className='grid grid-cols-4 gap-2'>
            {ACCENT_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type='button'
                aria-label={preset.label}
                aria-pressed={currentColor === preset.value}
                title={preset.label}
                onClick={() => handleColorChange(preset.value)}
                className={cn(
                  'flex size-11 items-center justify-center rounded-md transition-colors duration-[var(--duration-quick)] hover:bg-muted/50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none',
                  currentColor === preset.value && 'bg-muted/50'
                )}
              >
                <span
                  aria-hidden='true'
                  className={cn(
                    'size-7 rounded-full border-2 transition-transform duration-[var(--duration-quick)] motion-reduce:transition-none',
                    currentColor === preset.value
                      ? 'scale-105 border-foreground'
                      : 'border-transparent'
                  )}
                  style={{ backgroundColor: preset.value }}
                />
              </button>
            ))}

            {/* Custom color */}
            <label
              htmlFor='custom-accent-color'
              title='Custom color'
              className={cn(
                'relative flex size-11 cursor-pointer items-center justify-center rounded-md transition-colors duration-[var(--duration-quick)] hover:bg-muted/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background motion-reduce:transition-none',
                isCustomColor ? 'bg-muted/50' : 'bg-transparent'
              )}
            >
              <span
                aria-hidden='true'
                className={cn(
                  'size-7 rounded-full border-2 transition-transform duration-[var(--duration-quick)] motion-reduce:transition-none',
                  isCustomColor
                    ? 'scale-105 border-foreground'
                    : 'border-border/50'
                )}
                style={{
                  background: isCustomColor
                    ? currentColor
                    : 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
                }}
              />
              <input
                id='custom-accent-color'
                type='color'
                aria-label='Custom accent color'
                value={currentColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className='absolute inset-0 size-full cursor-pointer opacity-0'
              />
            </label>
          </div>

          {/* Current color hex display */}
          <div className='flex items-center gap-2 pt-1 border-t border-border/40'>
            <span
              className='w-4 h-4 rounded-sm border border-border/40 shrink-0'
              style={{ backgroundColor: currentColor }}
            />
            <span className='text-xs text-muted-foreground font-mono tabular-nums'>
              {currentColor.toUpperCase()}
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});
