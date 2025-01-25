'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { Editor } from '@tiptap/react';
import {
  Bold,
  ChevronDownIcon,
  HeadingIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  PilcrowIcon,
  Redo,
  Undo,
  UnlinkIcon,
} from 'lucide-react';
import { useCallback, useRef } from 'react';
import { HEADING_OPTIONS } from '@/components/richTextEditor/constants';
import { cn } from '@/lib/utils/stringUtils';

interface RichTextEditorMenubarProps {
  editor: Editor | null;
}

const RichTextEditorMenubar = ({ editor }: RichTextEditorMenubarProps) => {
  const linkRef = useRef<HTMLInputElement>(null);

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = linkRef.current?.value;
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border-muted-foreground/50 editor-input-menubar flex flex-wrap gap-2 p-2 border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <div className="flex items-center">
              <HeadingIcon className="size-4" />
              <ChevronDownIcon className="size-3" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {HEADING_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.level}
              style={{
                fontSize: `${18 - option.level * 1.2}px`,
              }}
              className={cn(
                editor.isActive('heading', {
                  level: option.level,
                }) && 'bg-secondary/90',
              )}
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: option.level })
                  .run();
              }}
            >
              <option.icon />
              <span>Heading {option.level}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={
          editor.isActive('paragraph') ? ' bg-gray-200 dark:bg-gray-700' : ''
        }
      >
        <PilcrowIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={
          editor.isActive('bold') ? ' bg-gray-200 dark:bg-gray-700' : ''
        }
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          editor.isActive('italic') ? ' bg-gray-200 dark:bg-gray-700' : ''
        }
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={
          editor.isActive('bulletList') ? ' bg-gray-200 dark:bg-gray-700' : ''
        }
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive('orderedList') ? ' bg-gray-200 dark:bg-gray-700' : ''
        }
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            type="button"
            size="icon"
            className={
              editor.isActive('orderedList')
                ? ' bg-gray-200 dark:bg-gray-700'
                : ''
            }
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href;
              setTimeout(() => {
                if (!linkRef.current || !previousUrl) return;
                linkRef.current.value = previousUrl;
              });
            }}
          >
            <LinkIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="grid gap-2">
          <div className="flex flex-col gap-1">
            <Label>Link</Label>
            <Input
              ref={linkRef}
              type="text"
              onKeyDown={(e) => {
                const key = e.key;
                if (key === 'Enter') {
                  e.preventDefault();
                  setLink();
                }
              }}
            />
          </div>
          <Button
            type="button"
            onClick={() => {
              setLink();
            }}
          >
            Save
          </Button>
        </PopoverContent>
      </Popover>
      {editor.isActive('link') ? (
        <Button
          variant="outline"
          type="button"
          size="icon"
          onClick={() => editor?.chain().focus().unsetLink().run()}
        >
          <UnlinkIcon className="w-4 h-4" />
        </Button>
      ) : null}
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default RichTextEditorMenubar;
