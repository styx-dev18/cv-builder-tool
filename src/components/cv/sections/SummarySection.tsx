import { useState } from 'react'
import type { CVSection } from '@/types/cv'
import { useCVStore } from '@/store/cvStore'
import { Button } from '@/components/ui/button'
import { generateSummary } from '@/services/aiService'
import { PLACEHOLDERS } from './placeholders'
import { RichTextEditor } from './RichTextEditor'
import { useAiGenerate } from './useAiGenerate'

interface Props {
  section: CVSection<'summary'>
  isEditing: boolean
  onStopEdit: () => void
}

export function SummarySection({ section, isEditing, onStopEdit }: Props) {
  const updateItem = useCVStore((s) => s.updateItem)
  const item = section.items[0]

  const [draft, setDraft] = useState(item.content)
  const [wasEditing, setWasEditing] = useState(isEditing)
  const { generating, run } = useAiGenerate(() => generateSummary({}))

  if (isEditing && !wasEditing) {
    setWasEditing(true)
    setDraft(item.content)
  } else if (!isEditing && wasEditing) {
    setWasEditing(false)
  }

  if (isEditing) {
    function handleSave() {
      updateItem(section.id, item.id, { content: draft })
      onStopEdit()
    }

    function handleCancel() {
      setDraft(item.content)
      onStopEdit()
    }

    return (
      <div className="flex flex-col gap-4">
        <RichTextEditor
          label="Summary"
          content={draft}
          onChange={setDraft}
          onGenerate={() => run(setDraft)}
          generateLabel="Generate Summary"
          generating={generating}
        />
        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {item.content ? (
        <div
          className="prose prose-sm max-w-none text-sm [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          {PLACEHOLDERS.summary.content}
        </p>
      )}
    </div>
  )
}
