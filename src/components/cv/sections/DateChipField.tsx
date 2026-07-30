import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface DateChipFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
}

export function DateChipField({
  label,
  htmlFor,
  required,
  placeholder,
  value,
  onChange,
  error,
}: DateChipFieldProps) {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  return (
    <div>
      <Label htmlFor={htmlFor} className="mb-1.5 text-xs text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {value && !editing ? (
        <div className="flex h-8 items-center justify-between gap-2 rounded-lg border border-border bg-background px-2.5 text-sm">
          <button
            type="button"
            className="flex-1 text-left"
            onClick={() => setEditing(true)}
          >
            {value}
          </button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Clear ${label}`}
            onClick={() => onChange('')}
          >
            <X className="size-3" />
          </Button>
        </div>
      ) : (
        <Input
          ref={inputRef}
          id={htmlFor}
          placeholder={placeholder}
          aria-invalid={!!error}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
        />
      )}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
