import type { CVSection } from '@/types/cv'
import { Separator } from '@/components/ui/separator'
import { DateChipField } from './DateChipField'
import { EntryDeleteButton } from './EntryDeleteButton'
import { InputField, TextareaField } from './Field'
import { PLACEHOLDERS } from './placeholders'
import { SectionEditFooter } from './SectionEditFooter'
import { useSectionDraft } from './useSectionDraft'

interface Props {
  section: CVSection<'volunteering'>
  isEditing: boolean
  onStopEdit: () => void
}

export function VolunteeringSection({ section, isEditing, onStopEdit }: Props) {
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
    'volunteering',
    section.items,
    isEditing,
    onStopEdit,
  )

  if (isEditing) {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="border-b border-border pb-1 text-sm font-bold uppercase">
          {section.title}
        </h2>
        {draftItems.map((item, index) => {
          const itemErrors = errors[index] ?? {}
          return (
          <div key={item.id}>
            {index > 0 && <Separator className="mb-5" />}
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Organization"
                    htmlFor={`${item.id}-organization`}
                    required
                    value={item.organization}
                    error={itemErrors.organization}
                    onChange={(e) =>
                      patchDraft(item.id, { organization: e.target.value })
                    }
                  />
                  <InputField
                    label="Role"
                    htmlFor={`${item.id}-role`}
                    required
                    value={item.role}
                    error={itemErrors.role}
                    onChange={(e) =>
                      patchDraft(item.id, { role: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <DateChipField
                    label="Start Date"
                    htmlFor={`${item.id}-startDate`}
                    placeholder="Month Year"
                    value={item.startDate}
                    onChange={(value) =>
                      patchDraft(item.id, { startDate: value })
                    }
                  />
                  <DateChipField
                    label="End Date"
                    htmlFor={`${item.id}-endDate`}
                    placeholder="Month Year"
                    value={item.endDate}
                    onChange={(value) => patchDraft(item.id, { endDate: value })}
                  />
                </div>
                <TextareaField
                  label="Description"
                  htmlFor={`${item.id}-description`}
                  rows={3}
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
    <div className="flex flex-col gap-3">
      <h2 className="border-b border-border pb-1 text-sm font-bold uppercase">
        {section.title}
      </h2>
      {section.items.map((item) => (
        <div key={item.id} className="ml-2 mb-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-semibold">
              {item.role || (
                <span className="font-normal text-muted-foreground">
                  {PLACEHOLDERS.volunteering.role}
                </span>
              )}
              {item.organization ? (
                ` · ${item.organization}`
              ) : (
                <span className="font-normal text-muted-foreground">
                  {` · ${PLACEHOLDERS.volunteering.organization}`}
                </span>
              )}
            </p>
            {(item.startDate || item.endDate) && (
              <p className="shrink-0 text-xs text-muted-foreground">
                {item.startDate}
                {' – '}
                {item.endDate}
              </p>
            )}
          </div>
          {item.description && (
            <p className="mt-1 text-sm whitespace-pre-wrap">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
