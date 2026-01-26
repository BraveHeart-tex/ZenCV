'use client';
import { startTransition, useEffect } from 'react';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

export const DocumentBuilderResetter = () => {
  useEffect(() => {
    return () => {
      startTransition(() => {
        builderRootStore.resetState();
        builderRootStore.dispose();
      });
    };
  }, []);
  return null;
};
