import { ChevronDownIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-m';
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
          <AnimatePresence>
            {areExtraFieldsHidden ? null : (
              <motion.div
                className={cn('grid grid-cols-1 gap-6', gridColumns)}
                initial={{ height: 0 }}
                animate={{
                  height: 'auto',
                  opacity: 1,
                  transition: { duration: 0.3 },
                }}
                exit={{ height: 0, opacity: 0 }}
              >
                {renderFields(plan.additional)}
              </motion.div>
            )}
          </AnimatePresence>
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
                'transition-all duration-300',
                !areExtraFieldsHidden && 'rotate-180'
              )}
            />
          </Button>
        </div>
      </div>
    );
  }
);
