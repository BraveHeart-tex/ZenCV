import { PopoverClose } from '@radix-ui/react-popover';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlert,
  CircleHelp,
} from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { MONTHS } from '@/lib/constants';
import {
  CURRENT_MONTH,
  CURRENT_YEAR,
  getMonthFromFieldValue,
  getYearFromFieldValue,
  isValidDateFormat,
} from '@/lib/helpers/dateInputHelpers';
import { getFieldHtmlId } from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { cn } from '@/lib/utils/stringUtils';

const PRESENT = 'Present';

export const DateFieldInput = observer(
  ({ fieldId }: { fieldId: DEX_Field['id'] }) => {
    const field = builderRootStore.fieldStore.getFieldById(fieldId);
    const htmlInputId = field ? getFieldHtmlId(field) : '';
    const inputRef = useRef<HTMLInputElement>(null);

    const month = useMemo(() => {
      if (!field?.value) return CURRENT_MONTH;
      return field.value && field.value !== PRESENT
        ? getMonthFromFieldValue(field.value)
        : CURRENT_MONTH;
    }, [field?.value]);

    const year = useMemo(() => {
      if (!field?.value) return CURRENT_YEAR;
      return field.value && field.value !== PRESENT
        ? getYearFromFieldValue(field.value)
        : CURRENT_YEAR;
    }, [field?.value]);

    if (!field) return null;

    const isPresent = field?.value === PRESENT;
    const isError =
      field.value && field.value !== PRESENT && !isValidDateFormat(field.value);

    const handleBlur = action(async () => {
      const value = field.value;
      await builderRootStore.fieldStore.setFieldValue(
        field.id,
        isValidDateFormat(value) ? value : ''
      );
    });

    return (
      <div className='flex flex-col gap-2'>
        {/* Label row */}
        <div className='flex items-center gap-1'>
          <Label htmlFor={htmlInputId}>{field.name}</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='xsIcon'
                className='h-[14px] hidden lg:inline-flex'
              >
                {isError ? (
                  <CircleAlert className='stroke-destructive' />
                ) : (
                  <CircleHelp />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                isError && 'bg-destructive text-destructive-foreground'
              )}
            >
              {isError && <div>Invalid date format</div>}
              <div>
                Use &#39;Feb, {new Date().getFullYear()}&#39; for month and
                year.
                <br />
                &#39;{new Date().getFullYear()}&#39; for year only,
                <br />
                Leave blank to hide the date.
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Input + popover */}
        <div className='relative'>
          <Input
            ref={inputRef}
            id={htmlInputId}
            type='text'
            value={field.value || ''}
            onChange={action(async (event) => {
              await builderRootStore.fieldStore.setFieldValue(
                field.id,
                event.target.value,
                false
              );
            })}
            data-1p-ignore='true'
            data-lpignore='true'
            data-protonpass-ignore='true'
            data-bwignore='true'
            onBlur={handleBlur}
            placeholder={isPresent ? 'Present' : 'e.g. Mar 2023'}
            className={cn(
              'pl-10',
              isPresent && 'text-muted-foreground italic',
              isError && 'focus-visible:ring-destructive border-destructive/50'
            )}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size='icon'
                variant='ghost'
                className='absolute left-0 top-1/2 -translate-y-1/2 p-1 rounded-md bg-muted text-muted-foreground hover:text-foreground'
              >
                <CalendarIcon className='w-4 h-4' />
              </Button>
            </PopoverTrigger>

            <PopoverContent className='w-64 p-0 overflow-hidden' align='start'>
              {/* Present toggle banner */}
              <div className='flex items-center justify-between px-3 py-2.5 bg-muted/40 border-b border-border/40'>
                <div className='flex items-center gap-2'>
                  <Switch
                    checked={isPresent}
                    onCheckedChange={action(async (checked) => {
                      await builderRootStore.fieldStore.setFieldValue(
                        field?.id,
                        checked ? PRESENT : ''
                      );
                    })}
                  />
                  <Label className='text-sm cursor-pointer'>
                    Currently here
                  </Label>
                </div>
                {isPresent && (
                  <span className='text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full'>
                    Present
                  </span>
                )}
              </div>

              <div
                className={cn(
                  'p-3 space-y-3 transition-opacity',
                  isPresent && 'opacity-40 pointer-events-none'
                )}
              >
                {/* Year navigation */}
                <div className='flex items-center justify-between'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-7 w-7'
                    disabled={isPresent}
                    onClick={action(async () => {
                      await builderRootStore.fieldStore.setFieldValue(
                        field.id,
                        `${month} ${year - 1}`
                      );
                    })}
                  >
                    <ChevronLeftIcon className='w-4 h-4' />
                  </Button>
                  <span className='text-sm font-semibold tabular-nums'>
                    {year}
                  </span>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-7 w-7'
                    disabled={isPresent || year >= CURRENT_YEAR}
                    onClick={action(async () => {
                      await builderRootStore.fieldStore.setFieldValue(
                        field.id,
                        `${month} ${year + 1}`
                      );
                    })}
                  >
                    <ChevronRightIcon className='w-4 h-4' />
                  </Button>
                </div>

                {/* Month grid */}
                <div className='grid grid-cols-4 gap-1'>
                  {MONTHS.map((monthItem) => {
                    const isSelected = month === monthItem;
                    const isFuture =
                      year === CURRENT_YEAR &&
                      MONTHS.indexOf(monthItem) > MONTHS.indexOf(CURRENT_MONTH);
                    return (
                      <Button
                        key={monthItem}
                        variant={isSelected ? 'default' : 'ghost'}
                        className={cn(
                          'h-7 text-xs px-0',
                          isFuture && 'opacity-30'
                        )}
                        disabled={isPresent || isFuture}
                        onClick={action(async () => {
                          await builderRootStore.fieldStore.setFieldValue(
                            field?.id,
                            `${monthItem} ${year}`
                          );
                        })}
                      >
                        {monthItem}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className='px-3 pb-3 flex justify-end'>
                <PopoverClose asChild>
                  <Button variant='outline' size='sm'>
                    Done
                  </Button>
                </PopoverClose>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }
);
