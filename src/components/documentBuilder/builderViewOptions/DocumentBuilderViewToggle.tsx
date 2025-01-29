'use client';

import { Button } from '@/components/ui/button';
import { useDocumentBuilderSearchParams } from '@/hooks/useDocumentBuilderSearchParams';
import { File } from 'lucide-react';
import { AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react';
import { useState } from 'react';
import * as motion from 'motion/react-m';

const motionConfig = {
  initial: { opacity: 0, width: 0 },
  animate: {
    opacity: 1,
    width: 'auto',
    transition: {
      opacity: { duration: 0.15, delay: 0.15 },
      width: { duration: 0.15 },
    },
  },
  exit: {
    opacity: 0,
    width: 0,
    transition: {
      opacity: { duration: 0.15 },
      width: { duration: 0.15, delay: 0.15 },
    },
  },
  transition: { duration: 0.3 },
};

const DocumentBuilderViewToggle = () => {
  const { setView } = useDocumentBuilderSearchParams();
  const [shouldShowButtonText, setShouldShowButtonText] = useState(false);
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setShouldShowButtonText(latest === 1 || latest === 0);
  });

  return (
    <Button
      className="right-5 bottom-2 xl:hidden hover:bg-opacity-95 py-7 fixed z-50 flex items-center gap-2 px-5 text-base transition-all ease-in-out rounded-full"
      size="lg"
      onClick={() => setView('preview')}
    >
      <AnimatePresence initial={false}>
        {shouldShowButtonText && (
          <motion.div
            {...motionConfig}
            className="text-primary-foreground font-medium"
          >
            Preview & Download
          </motion.div>
        )}
      </AnimatePresence>
      <File size={24} />
    </Button>
  );
};

export default DocumentBuilderViewToggle;
