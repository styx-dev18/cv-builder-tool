import type { CVSection } from '@/types/cv'
import { Separator } from '@/components/ui/separator'
import { EntryDeleteButton } from './EntryDeleteButton'
import { InputField } from './Field'
import { PLACEHOLDERS } from './placeholders'
import { SectionEditFooter } from './SectionEditFooter'
import { useSectionDraft } from './useSectionDraft'

interface Props {
  section: CVSection<'references'>
  isEditing: boolean
  onStopEdit: () => void
}

export function ReferencesSection({ section, isEditing, onStopEdit }: Props) {
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
    'references',
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
              <div className="grid flex-1 grid-cols-2 gap-3">
                <InputField
                  label="Name"
                  htmlFor={`${item.id}-name`}
                  required
                  value={item.name}
                  error={itemErrors.name}
                  onChange={(e) => patchDraft(item.id, { name: e.target.value })}
                />
                <InputField
                  label="Relationship / Title"
                  htmlFor={`${item.id}-relationship`}
                  value={item.relationship}
                  onChange={(e) =>
                    patchDraft(item.id, { relationship: e.target.value })
                  }
                />
                <InputField
                  label="Email"
                  htmlFor={`${item.id}-email`}
                  type="email"
                  value={item.email}
                  onChange={(e) =>
                    patchDraft(item.id, { email: e.target.value })
                  }
                />
                <InputField
                  label="Phone"
                  htmlFor={`${item.id}-phone`}
                  value={item.phone}
                  onChange={(e) =>
                    patchDraft(item.id, { phone: e.target.value })
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
      {section.items.map((item) => {
        const contact = [item.email, item.phone].filter(Boolean).join(' · ')
        return (
          <div key={item.id} className="ml-2 mb-1">
            <p className="font-semibold">
              {item.name || (
                <span className="font-normal text-muted-foreground">
                  {PLACEHOLDERS.references.name}
                </span>
              )}
              {item.relationship && ` · ${item.relationship}`}
            </p>
            {contact && (
              <p className="text-sm text-muted-foreground">{contact}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
