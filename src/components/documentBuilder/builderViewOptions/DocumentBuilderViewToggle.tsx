'use client';

import { File } from 'lucide-react';
import { action } from 'mobx';
import { AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react';
import * as motion from 'motion/react-m';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';

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

export const DocumentBuilderViewToggle = () => {
  const view = builderRootStore.UIStore.currentView;
  const [shouldShowButtonText, setShouldShowButtonText] = useState(false);
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setShouldShowButtonText(latest === 1 || latest === 0);
  });

  if (view === BUILDER_CURRENT_VIEWS.PREVIEW) {
    return null;
  }

  return (
    <Button
      className='right-5 bottom-2 xl:hidden hover:bg-opacity-95 py-7 fixed z-50 flex items-center gap-2 px-5 text-base transition-all ease-in-out rounded-full'
      size='lg'
      onClick={action(() => {
        builderRootStore.UIStore.currentView = BUILDER_CURRENT_VIEWS.PREVIEW;
      })}
    >
      <AnimatePresence initial={false}>
        {shouldShowButtonText && (
          <motion.div
            {...motionConfig}
            className='text-primary-foreground font-medium'
          >
            Preview & Download
          </motion.div>
        )}
      </AnimatePresence>
      <File size={24} />
    </Button>
  );
};
