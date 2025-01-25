import { useFieldMapper } from '@/hooks/useFieldMapper';
import useLocalStorage from '@/hooks/useLocalStorage';
import { MAX_VISIBLE_FIELDS } from '@/lib/constants';
import { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-m';
import { Button } from './ui/button';

import { cn } from '@/lib/utils/stringUtils';

const ARE_EXTRA_FIELDS_HIDDEN_KEY = 'areExtraFieldsHidden';

const HidableFieldContainer = observer(
  ({ fields }: { fields: DEX_Field[] }) => {
    const { renderFields } = useFieldMapper();
    const [areExtraFieldsHidden, setAreExtraFieldsHidden] = useLocalStorage(
      ARE_EXTRA_FIELDS_HIDDEN_KEY,
      true,
    );

    const baseFields = fields.slice(0, MAX_VISIBLE_FIELDS);
    const extraFields = fields.slice(MAX_VISIBLE_FIELDS);

    return (
      <div className="lg:grid-cols-2 grid grid-cols-1 gap-6 pt-2">
        {renderFields(baseFields)}
        <div className="lg:col-span-2">
          <AnimatePresence>
            {areExtraFieldsHidden ? null : (
              <motion.div
                className="lg:grid-cols-2 grid grid-cols-1 gap-6"
                initial={{ height: 0 }}
                animate={{
                  height: 'auto',
                  opacity: 1,
                  transition: { duration: 0.3 },
                }}
                exit={{ height: 0, opacity: 0 }}
              >
                {renderFields(extraFields)}
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="outline"
            className={cn(
              'text-primary flex items-center gap-1',
              !areExtraFieldsHidden && 'mt-6',
            )}
            onClick={() => {
              setAreExtraFieldsHidden(!areExtraFieldsHidden);
            }}
          >
            <span>
              {areExtraFieldsHidden ? 'Show' : 'Hide'} additional details
            </span>
            {areExtraFieldsHidden ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </Button>
        </div>
      </div>
    );
  },
);

export default HidableFieldContainer;
