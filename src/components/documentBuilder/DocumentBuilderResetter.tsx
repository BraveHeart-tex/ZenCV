import { startTransition, useEffect } from 'react';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

export const DocumentBuilderResetter = () => {
  useEffect(() => {
    return () => {
      startTransition(() => {
        builderSession.resetState();
        builderSession.dispose();
      });
    };
  }, []);
  return null;
};
