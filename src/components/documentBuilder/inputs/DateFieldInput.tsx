'use client';
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

const DateFieldInput = observer(({ fieldId }: { fieldId: DEX_Field['id'] }) => {
  const field = builderRootStore.fieldStore.getFieldById(fieldId)!;
  const htmlInputId = getFieldHtmlId(field);

  const month = useMemo(() => {
    return field.value && field.value !== PRESENT
      ? getMonthFromFieldValue(field.value)
      : CURRENT_MONTH;
  }, [field.value]);

  const year = useMemo(() => {
    return field.value && field.value !== PRESENT
      ? getYearFromFieldValue(field.value)
      : CURRENT_YEAR;
  }, [field.value]);

  const isPresent = field.value === PRESENT;

  const isError =
    field.value && field.value !== PRESENT && !isValidDateFormat(field.value);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = action(async () => {
    const value = field.value;
    await builderRootStore.fieldStore.setFieldValue(
      field.id,
      isValidDateFormat(value) ? value : '',
    );
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Label htmlFor={htmlInputId}>{field.name}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="xsIcon"
              className="h-[14px] hidden lg:inline-flex"
            >
              {isError ? (
                <CircleAlert className="stroke-destructive" />
              ) : (
                <CircleHelp />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            className={cn(
              isError && 'bg-destructive text-destructive-foreground',
            )}
          >
            {isError && <div>Invalid date format</div>}
            <div>
              Use &#39;Feb, {new Date().getFullYear()}&#39; for month and year.
              <br />
              &#39;{new Date().getFullYear()}&#39; for year only, <br />
              Leave blank to hide the date.
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="relative">
        <Input
          ref={inputRef}
          id={htmlInputId}
          type="text"
          value={field.value || ''}
          onChange={action(async (event) => {
            await builderRootStore.fieldStore.setFieldValue(
              field.id,
              event.target.value,
              false,
            );
          })}
          data-1p-ignore="true"
          data-lpignore="true"
          data-protonpass-ignore="true"
          data-bwignore="true"
          onBlur={handleBlur}
          className={cn('pl-10', isError && 'focus-visible:ring-destructive')}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="top-1/2 bg-muted text-muted-foreground absolute left-0 p-1 -translate-y-1/2 rounded-md"
            >
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2 rounded-md">
            <div className="grid gap-2">
              <div className="flex items-center justify-between w-full">
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={isPresent}
                  onClick={action(async () => {
                    await builderRootStore.fieldStore.setFieldValue(
                      field.id,
                      `${month} ${year - 1}`,
                    );
                  })}
                >
                  <ChevronLeftIcon />
                </Button>
                <span className="text-primary-foreground bg-primary tabular-nums px-2 py-1 text-sm rounded-md">
                  {year}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={isPresent}
                  onClick={action(async () => {
                    await builderRootStore.fieldStore.setFieldValue(
                      field.id,
                      `${month} ${year + 1}`,
                    );
                  })}
                >
                  <ChevronRightIcon />
                </Button>
              </div>
              <div className="place-items-center grid w-full grid-cols-4 gap-2 mx-auto">
                {MONTHS.map((monthItem) => (
                  <Button
                    variant={month === monthItem ? 'default' : 'ghost'}
                    className="h-8"
                    key={monthItem}
                    disabled={isPresent}
                    onClick={action(async () => {
                      await builderRootStore.fieldStore.setFieldValue(
                        field?.id,
                        `${monthItem} ${year}`,
                      );
                    })}
                  >
                    <p>{monthItem}</p>
                  </Button>
                ))}
              </div>
              <div className="flex items-center justify-between w-full gap-1 mt-4">
                <div className="flex items-center gap-1">
                  <Switch
                    checked={isPresent}
                    onCheckedChange={action(async (checked) => {
                      await builderRootStore.fieldStore.setFieldValue(
                        field?.id,
                        checked ? PRESENT : '',
                      );
                    })}
                  />
                  <Label className="text-sm">Present</Label>
                </div>
                <PopoverClose asChild>
                  <Button
                    variant="outline"
                    className="self-end ml-auto"
                    size="sm"
                  >
                    Close
                  </Button>
                </PopoverClose>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
});

export default DateFieldInput;
