import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SectionEditFooterProps {
  addLabel?: string
  onAdd: () => void
  onCancel: () => void
  onSave: () => void
}

export function SectionEditFooter({
  addLabel = 'Add More',
  onAdd,
  onCancel,
  onSave,
}: SectionEditFooterProps) {
  return (
    <div className="flex items-center justify-between">
      <Button type="button" variant="outline" size="sm" onClick={onAdd}>
        <Plus className="size-3.5" />
        {addLabel}
      </Button>
      <div className="flex gap-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  )
}
