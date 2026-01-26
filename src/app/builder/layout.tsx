import type { PropsWithChildren } from 'react';
import { DocumentBuilderResetter } from '@/components/documentBuilder/DocumentBuilderResetter';

export default function BuilderLayout({ children }: PropsWithChildren) {
  return (
    <>
      <DocumentBuilderResetter />
      {children}
    </>
  );
}
