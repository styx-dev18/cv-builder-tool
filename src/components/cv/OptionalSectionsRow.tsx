import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCVStore } from '@/store/cvStore'
import { OPTIONAL_SECTION_TYPES, SECTION_LABELS } from '@/types/cv'

export function OptionalSectionsRow() {
  const sections = useCVStore((s) => s.cv.sections)
  const addSection = useCVStore((s) => s.addSection)

  const addedTypes = new Set(sections.map((s) => s.type))
  const available = OPTIONAL_SECTION_TYPES.filter(
    (type) => !addedTypes.has(type),
  )

  if (available.length === 0) return null

  return (
    <div className="flex flex-wrap justify-center gap-2 border-t border-border pt-4">
      {available.map((type) => (
        <Button
          key={type}
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => addSection(type)}
        >
          <Plus className="size-3.5" />
          Add {SECTION_LABELS[type]}
        </Button>
      ))}
    </div>
  )
}
