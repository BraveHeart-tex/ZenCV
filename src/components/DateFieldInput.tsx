'use client';
import { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { Input } from '@/components/ui/input';
import { action } from 'mobx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { MONTHS } from '@/lib/constants';
import { PopoverClose } from '@radix-ui/react-popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  CURRENT_MONTH,
  CURRENT_YEAR,
  getMonthFromFieldValue,
  getYearFromFieldValue,
} from '@/lib/dateInputHelpers';

const DateFieldInput = observer(({ fieldId }: { fieldId: number }) => {
  const field = documentBuilderStore.getFieldById(fieldId)!;
  const htmlInputId = `${field.itemId}-${field.name}`;

  const [isPresent, setIsPresent] = useState(field.value === 'Present');
  const [month, setMonth] = useState(
    field.value && field.value !== 'Present'
      ? getMonthFromFieldValue(field.value)
      : CURRENT_MONTH,
  );
  const [year, setYear] = useState(
    field.value && field.value !== 'Present'
      ? getYearFromFieldValue(field.value)
      : CURRENT_YEAR,
  );

  const inputRef = useRef<HTMLInputElement>(null);

  // const handleChange = action(async (event: ChangeEvent<HTMLInputElement>) => {
  //   const inputValue = event.target.value;
  //   await documentBuilderStore.setFieldValue(fieldId, inputValue);
  //   return;
  // });

  const handleBlur = () => {};

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={htmlInputId}
        type="text"
        defaultValue={field.value || ''}
        // onInput={(event) => {}}
        onBlur={handleBlur}
        placeholder="MM/YYYY or YYYY"
        maxLength={7}
        className="pl-10"
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
                onClick={() => {
                  setYear(year - 1);
                  // setFieldValue(field?.id, `${month} ${year - 1}`);
                }}
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
                onClick={() => {
                  setYear(year + 1);
                  // setFieldValue(field?.id, `${month} ${year + 1}`);
                }}
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
                    setMonth(monthItem);
                    await documentBuilderStore.setFieldValue(
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
                    setIsPresent(checked);
                    if (checked) {
                      setYear(CURRENT_YEAR);
                      setMonth(CURRENT_MONTH);
                      await documentBuilderStore.setFieldValue(
                        field?.id,
                        'Present',
                      );
                    }
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
  );
});

export default DateFieldInput;
