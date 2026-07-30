import { useState } from 'react'
import type { CVSection, PersonalInfoItem } from '@/types/cv'
import { useCVStore } from '@/store/cvStore'
import { Button } from '@/components/ui/button'
import { validateItem, type FieldErrors } from '@/schemas/cvSchemas'
import { InputField } from './Field'
import { PLACEHOLDERS } from './placeholders'

interface Props {
  section: CVSection<'personalInfo'>
  isEditing: boolean
  onStopEdit: () => void
}

export function PersonalInfoSection({ section, isEditing, onStopEdit }: Props) {
  const updateItem = useCVStore((s) => s.updateItem)
  const item = section.items[0]

  const [draft, setDraft] = useState<PersonalInfoItem>(item)
  const [wasEditing, setWasEditing] = useState(isEditing)
  const [errors, setErrors] = useState<FieldErrors<PersonalInfoItem>>({})

  if (isEditing && !wasEditing) {
    setWasEditing(true)
    setDraft(item)
    setErrors({})
  } else if (!isEditing && wasEditing) {
    setWasEditing(false)
  }

  if (isEditing) {
    function setField<K extends keyof PersonalInfoItem>(
      key: K,
      value: PersonalInfoItem[K],
    ) {
      setDraft((prev) => ({ ...prev, [key]: value }))
      setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
    }

    function handleSave() {
      const nextErrors = validateItem('personalInfo', draft)
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors)
        return
      }
      updateItem(section.id, item.id, draft)
      setErrors({})
      onStopEdit()
    }

    function handleCancel() {
      setDraft(item)
      setErrors({})
      onStopEdit()
    }

    return (
      <div className="flex flex-col gap-4">
        <InputField
          label="Full Name"
          htmlFor={`${item.id}-fullName`}
          required
          value={draft.fullName}
          error={errors.fullName}
          onChange={(e) => setField('fullName', e.target.value)}
        />
        <div className="grid grid-cols-4 gap-3">
          <InputField
            label="Your Location"
            htmlFor={`${item.id}-location`}
            placeholder="City, State/Country"
            value={draft.location}
            onChange={(e) => setField('location', e.target.value)}
          />
          <InputField
            label="Email"
            htmlFor={`${item.id}-email`}
            type="email"
            required
            value={draft.email}
            error={errors.email}
            onChange={(e) => setField('email', e.target.value)}
          />
          <InputField
            label="Phone Number"
            htmlFor={`${item.id}-phone`}
            required
            value={draft.phone}
            error={errors.phone}
            onChange={(e) => setField('phone', e.target.value)}
          />
          <InputField
            label="LinkedIn"
            htmlFor={`${item.id}-linkedin`}
            placeholder="linkedin.com/in/your_linkedin"
            value={draft.linkedin}
            onChange={(e) => setField('linkedin', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 gap-3">
          <InputField
            label="Github"
            htmlFor={`${item.id}-github`}
            placeholder="github.com/your_github"
            value={draft.github}
            onChange={(e) => setField('github', e.target.value)}
          />
          <InputField
            label="Other Link"
            htmlFor={`${item.id}-otherLink`}
            placeholder="otherlink.com"
            value={draft.otherLink}
            onChange={(e) => setField('otherLink', e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-4 pt-2">
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

  const links = [
    { value: item.email, placeholder: PLACEHOLDERS.personalInfo.email, required: true },
    { value: item.phone, placeholder: PLACEHOLDERS.personalInfo.phone, required: true },
    { value: item.linkedin, required: false },
    { value: item.github, required: false },
    { value: item.otherLink, required: false },
  ].filter((link) => link.required || link.value)

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-3xl font-bold">
        {item.fullName.toLocaleUpperCase() || (
          <span className="text-muted-foreground">
            {PLACEHOLDERS.personalInfo.fullName}
          </span>
        )}
      </h1>
      {item.location && (
        <p className="text-sm text-muted-foreground">{item.location}</p>
      )}
      <p className="mt-1 flex flex-wrap items-center justify-center gap-x-1.5 text-sm text-muted-foreground">
        {links.map((link, index) => (
          <span key={link.value || `placeholder-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <span>&middot;</span>}
            <span
              className={
                link.value
                  ? 'text-primary underline-offset-4 hover:underline'
                  : 'text-muted-foreground'
              }
            >
              {link.value || link.placeholder}
            </span>
          </span>
        ))}
      </p>
    </div>
  )
}
