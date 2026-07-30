import type { ReactNode } from 'react'
import { ChevronDown, ChevronUp, Pencil, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  isEditing: boolean
  isFirst: boolean
  isLast: boolean
  onEdit: () => void
  onStopEdit: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  children: ReactNode
}

export function SectionWrapper({
  isEditing,
  isFirst,
  isLast,
  onEdit,
  onStopEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
  children,
}: SectionWrapperProps) {
  return (
    <div
      className={cn(
        'group relative rounded-lg border border-transparent p-4 transition-colors',
        isEditing
          ? 'bg-muted/30'
          : 'hover:bg-muted/90',
      )}
    >
      <div
        className={cn(
          'absolute -top-4 right-3 z-10 flex items-center gap-0.5 rounded-md border border-border bg-popover p-0.5 opacity-0 shadow-sm transition-opacity',
          isEditing ? 'opacity-100' : 'group-hover:opacity-100',
        )}
      >
        {isEditing ? (
          <ActionButton label="Done" onClick={onStopEdit}>
            <X className="size-4" />
          </ActionButton>
        ) : (
          <ActionButton label="Edit section" onClick={onEdit}>
            <Pencil className="size-4" />
          </ActionButton>
        )}
        <ActionButton
          label="Move up"
          onClick={onMoveUp}
          disabled={isFirst}
        >
          <ChevronUp className="size-4" />
        </ActionButton>
        <ActionButton
          label="Move down"
          onClick={onMoveDown}
          disabled={isLast}
        >
          <ChevronDown className="size-4" />
        </ActionButton>
        <ActionButton label="Delete section" onClick={onDelete} destructive>
          <Trash2 className="size-4" />
        </ActionButton>
      </div>
      {children}
    </div>
  )
}

function ActionButton({
  label,
  onClick,
  disabled,
  destructive,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  destructive?: boolean
  children: ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          onClick={onClick}
          aria-label={label}
          className={destructive ? 'hover:text-destructive' : undefined}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
