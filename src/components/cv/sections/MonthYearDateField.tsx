import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { format, isValid, parse } from 'date-fns'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

interface MonthYearDateFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
}

function parseValue(value: string): { year: number; monthIndex: number } | null {
  const parsed = parse(value, 'MM/yyyy', new Date())
  if (!isValid(parsed)) return null
  return { year: parsed.getFullYear(), monthIndex: parsed.getMonth() }
}

export function MonthYearDateField({
  label,
  htmlFor,
  required,
  placeholder,
  value,
  onChange,
  error,
}: MonthYearDateFieldProps) {
  const [open, setOpen] = useState(false)
  const selected = parseValue(value)
  const [viewYear, setViewYear] = useState(selected?.year ?? new Date().getFullYear())

  return (
    <div>
      <Label htmlFor={htmlFor} className="mb-1.5 text-xs text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (next) setViewYear(selected?.year ?? new Date().getFullYear())
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            id={htmlFor}
            className={cn(
              'flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-2.5 text-sm',
              error && 'border-destructive',
            )}
          >
            <span className={cn(!value && 'text-muted-foreground')}>
              {value || placeholder}
            </span>
            {value && (
              <span
                role="button"
                tabIndex={0}
                aria-label={`Clear ${label}`}
                className="flex size-4 items-center justify-center rounded-sm hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation()
                    onChange('')
                  }
                }}
              >
                <X className="size-3" />
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="mb-2 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Previous year"
              onClick={() => setViewYear((y) => y - 1)}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <span className="text-sm font-medium">{viewYear}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Next year"
              onClick={() => setViewYear((y) => y + 1)}
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS.map((month, index) => {
              const isSelected =
                selected?.year === viewYear && selected?.monthIndex === index
              return (
                <Button
                  key={month}
                  type="button"
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    onChange(format(new Date(viewYear, index, 1), 'MM/yyyy'))
                    setOpen(false)
                  }}
                >
                  {month}
                </Button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
