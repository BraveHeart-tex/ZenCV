'use client';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { action } from 'mobx';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';

const EditableDocumentTitle = observer(() => {
  const documentTitle = documentBuilderStore.document?.title;

  const [draftValue, setDraftValue] = useState(documentTitle || '');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (spanRef.current && containerRef.current) {
      const PLACEHOLDER_OFFSET_PX = 26;
      const spanWidth = spanRef.current.offsetWidth + PLACEHOLDER_OFFSET_PX;
      containerRef.current.style.width = `${spanWidth}px`;
    }
  }, [draftValue, documentTitle]);

  return (
    <div className="flex items-center justify-center w-full gap-2">
      <div className="flex items-center justify-center w-full !text-2xl font-semibold">
        <div className="inline-block h-10" ref={containerRef}>
          <span
            ref={spanRef}
            className="absolute !text-2xl font-semibold"
            style={{
              visibility: 'hidden',
            }}
          >
            {draftValue || documentTitle}
          </span>
          <Input
            ref={inputRef}
            className="focus:outline-none focus-visible:ring-0 w-full p-0 overflow-visible !text-2xl font-semibold text-center bg-transparent border-0 rounded-none shadow-none"
            placeholder={documentTitle}
            value={draftValue || documentTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                inputRef.current?.blur();
                setDraftValue('');
              }
            }}
            onChange={(e) => {
              setDraftValue(e.target.value);
            }}
            onBlur={action(async () => {
              if (!draftValue) return;
              await documentBuilderStore.renameDocument(draftValue);
              setDraftValue('');
            })}
          />
        </div>
      </div>
    </div>
  );
});

export default EditableDocumentTitle;
