'use client';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { cn } from '@/lib/utils';
import { action } from 'mobx';
import { useRef, useEffect, useState, FormEvent } from 'react';

const CHARACTER_LIMIT = 100;

const EditableDocumentTitle = observer(() => {
  const [focused, setFocused] = useState(false);
  const documentTitle = documentBuilderStore.document?.title;
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (
      titleRef.current &&
      documentTitle !== titleRef.current.textContent?.trim()
    ) {
      titleRef.current.textContent = documentTitle || '';
    }
  }, [documentTitle]);

  const handleInput = action(async (e: FormEvent<HTMLHeadingElement>) => {
    let newTitle = e.currentTarget.textContent?.trim() || '';

    if (!newTitle) {
      e.currentTarget.innerHTML = '';
    }

    if (newTitle.length > CHARACTER_LIMIT) {
      newTitle = newTitle.slice(0, CHARACTER_LIMIT);
      e.currentTarget.textContent = newTitle;
    }

    await documentBuilderStore.renameDocument(newTitle);
  });

  return (
    <>
      <style jsx>{`
        [data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          text-align: center;
          white-space: nowrap;
        }
      `}</style>
      <h1
        ref={titleRef}
        className={cn(
          'scroll-m-20 text-2xl font-semibold tracking-tight outline-none w-full text-center border-b border-transparent transition-all hover:bg-muted flex items-center justify-center',
          focused && 'border-primary/70 hover:bg-transparent',
        )}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onKeyDown={action((e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
            setFocused(false);
          } else if (e.key === 'Escape') {
            e.currentTarget.textContent =
              documentBuilderStore.document?.title || '';
            e.currentTarget.blur();
            setFocused(false);
          } else if (e.key === 'Backspace') {
            const element = e.currentTarget;
            if (!element.textContent?.trim()) {
              element.innerHTML = '';
              e.preventDefault();
            }
          }
        })}
        data-placeholder="Enter document title..."
        style={{ position: 'relative' }}
      />
    </>
  );
});

export default EditableDocumentTitle;
