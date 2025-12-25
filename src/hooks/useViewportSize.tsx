import { useEffect, useState } from 'react';

type ViewportSize = {
  width: number;
  height: number;
};

const visualViewport =
  typeof document !== 'undefined' ? window.visualViewport : null;

export const useViewportSize = () => {
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState<ViewportSize>(() =>
    !mounted ? { width: 0, height: 0 } : getViewportSize()
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onResize = () => {
      setSize((size) => {
        const newSize = getViewportSize();
        if (newSize.width === size.width && newSize.height === size.height) {
          return size;
        }
        return newSize;
      });
    };

    if (!visualViewport) {
      window.addEventListener('resize', onResize);
    } else {
      visualViewport.addEventListener('resize', onResize);
    }

    return () => {
      if (!visualViewport) {
        window.removeEventListener('resize', onResize);
      } else {
        visualViewport.removeEventListener('resize', onResize);
      }
    };
  }, []);

  return size;
};

function getViewportSize(): ViewportSize {
  return {
    width: visualViewport?.width || window.innerWidth,
    height: visualViewport?.height || window.innerHeight,
  };
}
