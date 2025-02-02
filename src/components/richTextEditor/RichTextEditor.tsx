'use client';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Ref, useImperativeHandle, useRef } from 'react';
import RichTextEditorMenubar from '@/components/richTextEditor/RichTextEditorMenubar';

export interface RichTextEditorProps {
  initialValue?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
  ref?: Ref<HTMLDivElement>;
  id?: string;
}

const RichTextEditor = ({
  initialValue,
  placeholder,
  onChange,
  ref,
  id,
}: RichTextEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      if (!onChange) return;
      const content = editor.getText() ? editor.getHTML() : '';
      onChange(content);
    },
  });

  useImperativeHandle(ref, () => ({
    ...({} as HTMLDivElement),
    focus: () => {
      if (editor) {
        editor.commands.focus();
      }
    },
    scrollIntoView: () => {
      if (editor) {
        editor.commands.blur();
        const editorElement = containerRef.current as HTMLElement;
        editorElement.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    },
    getBoundingClientRect(): DOMRect {
      if (editor) {
        const editorElement = editor.view.dom as HTMLElement;
        return editorElement.getBoundingClientRect();
      }

      return new DOMRect(0, 0, 0, 0);
    },
  }));

  return (
    <div className="w-full" ref={containerRef}>
      <div className="border-muted-foreground/50 bg-background editor-input-container rounded-md">
        <RichTextEditorMenubar editor={editor} />
        <div className="min-h-[200px] overflow-auto">
          <EditorContent
            id={id}
            ref={ref}
            editor={editor}
            className="max-w-none"
          />
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;

RichTextEditor.displayName = 'RichTextEditor';
