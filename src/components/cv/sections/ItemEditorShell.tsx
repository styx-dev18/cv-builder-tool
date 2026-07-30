import type { ReactNode } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface ItemEditorShellProps {
  items: { id: string }[]
  renderItem: (itemId: string, index: number) => ReactNode
  onAddItem: () => void
  onRemoveItem: (itemId: string) => void
  addLabel: string
}

export function ItemEditorShell({
  items,
  renderItem,
  onAddItem,
  onRemoveItem,
  addLabel,
}: ItemEditorShellProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <div key={item.id}>
          {index > 0 && <Separator className="mb-4" />}
          <div className="flex items-start gap-2">
            <div className="flex-1">{renderItem(item.id, index)}</div>
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="mt-5 shrink-0 hover:text-destructive"
                aria-label="Remove entry"
                onClick={() => onRemoveItem(item.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={onAddItem}
      >
        <Plus className="size-3.5" />
        {addLabel}
      </Button>
    </div>
  )
}
