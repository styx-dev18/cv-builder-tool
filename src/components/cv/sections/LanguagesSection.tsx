import type { CVSection } from '@/types/cv'
import { Separator } from '@/components/ui/separator'
import { EntryDeleteButton } from './EntryDeleteButton'
import { InputField } from './Field'
import { PLACEHOLDERS } from './placeholders'
import { SectionEditFooter } from './SectionEditFooter'
import { useSectionDraft } from './useSectionDraft'

interface Props {
  section: CVSection<'languages'>
  isEditing: boolean
  onStopEdit: () => void
}

export function LanguagesSection({ section, isEditing, onStopEdit }: Props) {
  const {
    draftItems,
    errors,
    patchDraft,
    addDraftItem,
    removeDraftItem,
    handleSave,
    handleCancel,
  } = useSectionDraft(section.id, 'languages', section.items, isEditing, onStopEdit)

  if (isEditing) {
    return (
      <div className="flex flex-col gap-5">
        {draftItems.map((item, index) => {
          const itemErrors = errors[index] ?? {}
          return (
          <div key={item.id}>
            {index > 0 && <Separator className="mb-5" />}
            <div className="flex items-start gap-2">
              <div className="grid flex-1 grid-cols-2 gap-3">
                <InputField
                  label="Language"
                  htmlFor={`${item.id}-language`}
                  required
                  value={item.language}
                  error={itemErrors.language}
                  onChange={(e) =>
                    patchDraft(item.id, { language: e.target.value })
                  }
                />
                <InputField
                  label="Proficiency"
                  htmlFor={`${item.id}-proficiency`}
                  placeholder="Native proficiency"
                  value={item.proficiency}
                  onChange={(e) =>
                    patchDraft(item.id, { proficiency: e.target.value })
                  }
                />
              </div>
              {draftItems.length > 1 && (
                <EntryDeleteButton onClick={() => removeDraftItem(item.id)} />
              )}
            </div>
          </div>
          )
        })}
        <SectionEditFooter
          onAdd={addDraftItem}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </div>
    )
  }

  const languages = section.items.filter((item) => item.language)

  return (
    <div className="flex flex-col gap-1">
      <h2 className="border-b border-border pb-1 text-sm font-bold uppercase">
        {section.title}
      </h2>
      <p className="text-sm">
        {languages.length > 0 ? (
          languages.map((item, index) => (
            <span key={item.id}>
              {index > 0 && ' · '}
              <span className="font-semibold">{item.language}</span>
              {item.proficiency && ` (${item.proficiency})`}
            </span>
          ))
        ) : (
          <span className="text-muted-foreground">
            {PLACEHOLDERS.languages.language} (
            {PLACEHOLDERS.languages.proficiency})
          </span>
        )}
      </p>
    </div>
  )
}
