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
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { cn } from '@/lib/utils/stringUtils';

export const AccentColorPicker = observer(() => {
  const { document } = builderRootStore.documentStore;

  if (
    !document ||
    !ACCENT_COLOR_SUPPORTED_TEMPLATES.has(document.templateType)
  ) {
    return null;
  }

  const currentColor = builderRootStore.documentStore.accentColor;

  const handleColorChange = async (color: string) => {
    await builderRootStore.documentStore.updateAccentColor(color);
  };

  const isCustomColor = !ACCENT_COLOR_PRESETS.some(
    (p) => p.value === currentColor
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2 h-9'>
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
          <p className='text-xs font-semibold tracking-widest uppercase text-muted-foreground/60'>
            Accent color
          </p>

          <div className='grid grid-cols-4 gap-2'>
            {ACCENT_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type='button'
                title={preset.label}
                onClick={() => handleColorChange(preset.value)}
                className={cn(
                  'w-7 h-7 rounded-full border-2 transition-all duration-150 hover:scale-110',
                  currentColor === preset.value
                    ? 'border-foreground scale-110'
                    : 'border-transparent'
                )}
                style={{ backgroundColor: preset.value }}
              />
            ))}

            {/* Custom color */}
            <label
              title='Custom color'
              className={cn(
                'relative w-7 h-7 rounded-full border-2 cursor-pointer transition-all duration-150 hover:scale-110 overflow-hidden',
                isCustomColor
                  ? 'border-foreground scale-110'
                  : 'border-border/50'
              )}
              style={{
                backgroundColor: isCustomColor ? currentColor : undefined,
              }}
            >
              {!isCustomColor && (
                <div
                  className='absolute inset-0 rounded-full'
                  style={{
                    background:
                      'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
                  }}
                />
              )}
              <input
                type='color'
                value={currentColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
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
