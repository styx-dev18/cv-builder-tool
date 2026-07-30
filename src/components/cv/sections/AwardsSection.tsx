import type { CVSection } from '@/types/cv'
import { Separator } from '@/components/ui/separator'
import { DateChipField } from './DateChipField'
import { EntryDeleteButton } from './EntryDeleteButton'
import { InputField, TextareaField } from './Field'
import { PLACEHOLDERS } from './placeholders'
import { SectionEditFooter } from './SectionEditFooter'
import { useSectionDraft } from './useSectionDraft'

interface Props {
  section: CVSection<'awards'>
  isEditing: boolean
  onStopEdit: () => void
}

export function AwardsSection({ section, isEditing, onStopEdit }: Props) {
  const {
    draftItems,
    errors,
    patchDraft,
    addDraftItem,
    removeDraftItem,
    handleSave,
    handleCancel,
  } = useSectionDraft(section.id, 'awards', section.items, isEditing, onStopEdit)

  if (isEditing) {
    return (
      <div className="flex flex-col gap-5">
        {draftItems.map((item, index) => {
          const itemErrors = errors[index] ?? {}
          return (
          <div key={item.id}>
            {index > 0 && <Separator className="mb-5" />}
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Title"
                    htmlFor={`${item.id}-title`}
                    required
                    value={item.title}
                    error={itemErrors.title}
                    onChange={(e) =>
                      patchDraft(item.id, { title: e.target.value })
                    }
                  />
                  <InputField
                    label="Issuer"
                    htmlFor={`${item.id}-issuer`}
                    value={item.issuer}
                    onChange={(e) =>
                      patchDraft(item.id, { issuer: e.target.value })
                    }
                  />
                </div>
                <DateChipField
                  label="Date"
                  htmlFor={`${item.id}-date`}
                  placeholder="Month Year"
                  value={item.date}
                  onChange={(value) => patchDraft(item.id, { date: value })}
                />
                <TextareaField
                  label="Description"
                  htmlFor={`${item.id}-description`}
                  rows={2}
                  value={item.description}
                  onChange={(e) =>
                    patchDraft(item.id, { description: e.target.value })
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

  return (
    <div className="flex flex-col gap-2">
      <h2 className="border-b border-border pb-1 text-sm font-bold uppercase">
        {section.title}
      </h2>
      {section.items.map((item) => (
        <div key={item.id}>
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-semibold">
              {item.title || (
                <span className="font-normal text-muted-foreground">
                  {PLACEHOLDERS.awards.title}
                </span>
              )}
              {item.issuer && ` · ${item.issuer}`}
            </p>
            {item.date && <p className="shrink-0 font-semibold">{item.date}</p>}
          </div>
          {item.description && (
            <p className="text-sm text-muted-foreground">{item.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}
