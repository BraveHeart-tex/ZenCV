'use client';
import { Document } from '@/lib/schema';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useTransition } from 'react';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { observer } from 'mobx-react-lite';
import { showErrorToast } from '@/components/ui/sonner';
import DocumentBuilderHeader from '@/components/DocumentBuilderHeader';

const DocumentBuilderClient = observer(
  ({ documentId }: { documentId: Document['id'] }) => {
    const router = useRouter();
    const [, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const view =
      (searchParams.get('view') as 'builder' | 'preview') || 'builder';

    useEffect(() => {
      if (!documentId) return;
      startTransition(async () => {
        const result = await documentBuilderStore.initializeStore(documentId);
        if (result?.error) {
          showErrorToast(result.error);
          router.push('/documents');
        }
      });
    }, [documentId, router]);

    return (
      <TooltipProvider>
        <div
          className={cn(
            'bg-background min-h-screen px-6 md:p-12 py-14 h-screen relative w-1/2 hide-scrollbar',
            view === 'builder' && 'w-full xl:w-1/2',
            view === 'preview' && 'hidden xl:block',
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={'/documents'}
                className={cn(
                  buttonVariants({
                    variant: 'outline',
                    className: 'absolute top-2 left-2',
                  }),
                )}
              >
                <ArrowLeft />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Documents page</p>
            </TooltipContent>
          </Tooltip>
          <div className="max-w-screen-2xl flex items-center justify-center mx-auto">
            <DocumentBuilderHeader />
          </div>
        </div>
      </TooltipProvider>
    );
  },
);

export default DocumentBuilderClient;
