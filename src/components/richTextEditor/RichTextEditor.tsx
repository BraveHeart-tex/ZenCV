import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { type Ref, useImperativeHandle, useRef } from 'react';
import { RichTextEditorMenubar } from '@/components/richTextEditor/RichTextEditorMenubar';

interface RichTextEditorProps {
  initialValue?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
  ref?: Ref<HTMLDivElement>;
  id?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  footer: React.ReactNode;
}

export interface EditorRef extends HTMLDivElement {
  focus: () => void;
  scrollIntoView: () => void;
  getBoundingClientRect: () => DOMRect;
  setContent: (content: string) => void;
}

export const RichTextEditor = ({
  initialValue,
  placeholder,
  onChange,
  ref,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaInvalid,
  footer,
}: RichTextEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialValue,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        ...(ariaLabelledBy ? { 'aria-labelledby': ariaLabelledBy } : {}),
        ...(ariaDescribedBy ? { 'aria-describedby': ariaDescribedBy } : {}),
        'aria-invalid': String(ariaInvalid ?? false),
        role: 'textbox',
        'aria-multiline': 'true',
      },
    },
    onUpdate: ({ editor }) => {
      if (!onChange) {
        return;
      }
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
    setContent(content: string) {
      if (editor) {
        editor.commands.setContent(content);
      }
    },
  }));

  return (
    <div className='w-full' ref={containerRef}>
      <div className='border-border bg-card focus-within:border-ring focus-within:ring-ring/30 rounded-md border shadow-none transition-[border-color,box-shadow] focus-within:ring-2 motion-reduce:transition-none'>
        <RichTextEditorMenubar editor={editor} />
        <div className='min-h-[200px] overflow-auto relative pb-10'>
          <EditorContent ref={ref} editor={editor} className='max-w-none' />
          {footer}
        </div>
      </div>
    </div>
  );
};

RichTextEditor.displayName = 'RichTextEditor';
