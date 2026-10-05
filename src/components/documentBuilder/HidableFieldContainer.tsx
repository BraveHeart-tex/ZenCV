import { ChevronDownIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useFieldMapper } from '@/hooks/useFieldMapper';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { GenericRenderPlan } from '@/lib/builderDocument/createGenericRenderPlan';

import { cn } from '@/lib/utils/stringUtils';
import { Button } from '../ui/button';

const ARE_EXTRA_FIELDS_HIDDEN_KEY = 'areExtraFieldsHidden';

export const HidableFieldContainer = observer(
  ({
    plan,
    responsiveLayout,
  }: {
    plan: GenericRenderPlan;
    responsiveLayout: boolean;
  }) => {
    const { renderFields } = useFieldMapper();
    const [areExtraFieldsHidden, setAreExtraFieldsHidden] = useLocalStorage(
      ARE_EXTRA_FIELDS_HIDDEN_KEY,
      true
    );
    const gridColumns = responsiveLayout ? 'md:grid-cols-2' : 'lg:grid-cols-2';

    return (
      <div
        className={cn('col-span-full grid grid-cols-1 gap-6 pt-2', gridColumns)}
      >
        {renderFields(plan.primary)}
        <div className='col-span-full'>
          {areExtraFieldsHidden ? null : (
            <div className={cn('grid grid-cols-1 gap-6', gridColumns)}>
              {renderFields(plan.additional)}
            </div>
          )}
          <Button
            variant='outline'
            className={cn(
              'text-primary flex items-center gap-1',
              !areExtraFieldsHidden && 'mt-6'
            )}
            onClick={() => {
              setAreExtraFieldsHidden(!areExtraFieldsHidden);
            }}
          >
            <span>
              {areExtraFieldsHidden ? 'Show' : 'Hide'} additional details
            </span>
            <ChevronDownIcon
              className={cn(
                'transition-transform duration-(--duration-quick) ease-(--ease-out-quart) motion-reduce:transition-none',
                !areExtraFieldsHidden && 'rotate-180'
              )}
            />
          </Button>
        </div>
      </div>
    );
  }
);
