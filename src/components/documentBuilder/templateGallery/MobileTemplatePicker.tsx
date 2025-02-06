import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { SlidersHorizontalIcon } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import MobileTemplatePickerContent from './MobileTemplatePickerContent';

const MobileTemplatePicker = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)', false);

  if (!isMobile) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label="Toggle template selector bottom menu"
      >
        <SlidersHorizontalIcon />
      </Button>
      <AnimatePresence>
        {open && <MobileTemplatePickerContent setOpen={setOpen} />}
      </AnimatePresence>
    </>
  );
};

export default MobileTemplatePicker;
