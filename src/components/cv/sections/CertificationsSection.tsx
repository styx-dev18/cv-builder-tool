import type { CVSection } from '@/types/cv'
import { Separator } from '@/components/ui/separator'
import { DateChipField } from './DateChipField'
import { EntryDeleteButton } from './EntryDeleteButton'
import { InputField } from './Field'
import { PLACEHOLDERS } from './placeholders'
import { SectionEditFooter } from './SectionEditFooter'
import { useSectionDraft } from './useSectionDraft'

interface Props {
  section: CVSection<'certifications'>
  isEditing: boolean
  onStopEdit: () => void
}

export function CertificationsSection({ section, isEditing, onStopEdit }: Props) {
  const {
    draftItems,
    errors,
    patchDraft,
    addDraftItem,
    removeDraftItem,
    handleSave,
    handleCancel,
  } = useSectionDraft(
    section.id,
    'certifications',
    section.items,
    isEditing,
    onStopEdit,
  )

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
                  label="Certification Name"
                  htmlFor={`${item.id}-name`}
                  required
                  value={item.name}
                  error={itemErrors.name}
                  onChange={(e) => patchDraft(item.id, { name: e.target.value })}
                />
                <DateChipField
                  label="Date"
                  htmlFor={`${item.id}-date`}
                  placeholder="Month Year"
                  value={item.date}
                  onChange={(value) => patchDraft(item.id, { date: value })}
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
    <div className="flex flex-col gap-1">
      <h2 className="border-b border-border pb-1 text-sm font-bold uppercase">
        {section.title}
      </h2>
      {section.items.map((item) => (
        <div key={item.id} className="flex items-baseline justify-between gap-2">
          <p className="font-semibold">
            {item.name || (
              <span className="font-normal text-muted-foreground">
                {PLACEHOLDERS.certifications.name}
              </span>
            )}
          </p>
          {item.date && <p className="shrink-0 font-semibold">{item.date}</p>}
        </div>
      ))}
    </div>
  )
}
