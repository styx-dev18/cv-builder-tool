import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCVStore } from '@/store/cvStore'
import { OPTIONAL_SECTION_TYPES, SECTION_LABELS, type SectionType } from '@/types/cv'

const SECTION_TYPES = (Object.keys(SECTION_LABELS) as SectionType[]).filter(
  (type) => !OPTIONAL_SECTION_TYPES.includes(type),
)

export function AddSectionMenu() {
  const addSection = useCVStore((s) => s.addSection)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="w-fit">
          <Plus className="size-3.5" />
          Add section
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {SECTION_TYPES.map((type) => (
          <DropdownMenuItem key={type} onSelect={() => addSection(type)}>
            {SECTION_LABELS[type]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
