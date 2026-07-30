import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EntryDeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="mt-5 shrink-0 hover:text-destructive"
      aria-label="Remove entry"
      onClick={onClick}
    >
      <Trash2 className="size-4" />
    </Button>
  )
}
