import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import UnderlineExtension from '@tiptap/extension-underline'
import {
  Bold,
  ChevronDown,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Sparkles,
  Underline as UnderlineIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  label: string
  required?: boolean
  content: string
  onChange: (html: string) => void
  onGenerate?: () => void
  generateLabel?: string
  generating?: boolean
  error?: string
}

export function RichTextEditor({
  label,
  required,
  content,
  onChange,
  onGenerate,
  generateLabel = 'Generate',
  generating,
  error,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'min-h-24 rounded-b-lg border border-t-0 border-border bg-background px-3 py-2 text-sm focus:outline-none prose prose-sm max-w-none [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:pl-5 [&_ul]:pl-5',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  return (
    <div>
      <Label className="mb-1.5 text-xs text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Toolbar
        editor={editor}
        onGenerate={onGenerate}
        generateLabel={generateLabel}
        generating={generating}
      />
      <div className={cn(error && 'rounded-b-lg ring-3 ring-destructive/20')}>
        <EditorContent editor={editor} />
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

function Toolbar({
  editor,
  onGenerate,
  generateLabel,
  generating,
}: {
  editor: Editor
  onGenerate?: () => void
  generateLabel: string
  generating?: boolean
}) {
  function setLink() {
    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL', previousUrl ?? '')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-border bg-muted/40 p-1.5">
      <ToolbarToggle
        label="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </ToolbarToggle>
      <ToolbarToggle
        label="Underline"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="size-4" />
      </ToolbarToggle>
      <ToolbarToggle
        label="Italic"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </ToolbarToggle>
      <ToolbarToggle label="Link" active={editor.isActive('link')} onClick={setLink}>
        <LinkIcon className="size-4" />
      </ToolbarToggle>
      <ToolbarToggle
        label="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </ToolbarToggle>
      <ToolbarToggle
        label="Numbered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </ToolbarToggle>
      {onGenerate && (
        <Button
          type="button"
          size="sm"
          disabled={generating}
          onClick={onGenerate}
          className="ml-auto gap-1 rounded-full bg-linear-to-r from-amber-400 via-orange-400 to-purple-500 text-white hover:opacity-90"
        >
          <Sparkles className="size-3.5" />
          {generating ? 'Generating…' : generateLabel}
          <ChevronDown className="size-3.5" />
        </Button>
      )}
    </div>
  )
}

function ToolbarToggle({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string
  active: boolean
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(active && 'bg-muted text-foreground')}
    >
      {children}
    </Button>
  )
}

