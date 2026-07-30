import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface FieldProps {
  label: string
  htmlFor: string
  className?: string
  required?: boolean
  error?: string
}

export function InputField({
  label,
  htmlFor,
  className,
  required,
  error,
  ...inputProps
}: FieldProps & ComponentProps<'input'>) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-1.5 text-xs text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input id={htmlFor} aria-invalid={!!error} {...inputProps} />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function TextareaField({
  label,
  htmlFor,
  className,
  required,
  error,
  ...textareaProps
}: FieldProps & ComponentProps<'textarea'>) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-1.5 text-xs text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Textarea id={htmlFor} aria-invalid={!!error} {...textareaProps} />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
