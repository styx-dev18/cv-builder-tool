import type { CVSection } from '@/types/cv'
import { Separator } from '@/components/ui/separator'
import { EntryDeleteButton } from './EntryDeleteButton'
import { InputField } from './Field'
import { PLACEHOLDERS } from './placeholders'
import { SectionEditFooter } from './SectionEditFooter'
import { useSectionDraft } from './useSectionDraft'

interface Props {
  section: CVSection<'skills'>
  isEditing: boolean
  onStopEdit: () => void
}

export function SkillsSection({ section, isEditing, onStopEdit }: Props) {
  const {
    draftItems,
    errors,
    patchDraft,
    addDraftItem,
    removeDraftItem,
    handleSave,
    handleCancel,
  } = useSectionDraft(section.id, 'skills', section.items, isEditing, onStopEdit)

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
                  label="Category"
                  htmlFor={`${item.id}-category`}
                  placeholder="Front-end Development"
                  required
                  value={item.category}
                  error={itemErrors.category}
                  onChange={(e) =>
                    patchDraft(item.id, { category: e.target.value })
                  }
                />
                <InputField
                  label="Skills (comma separated)"
                  htmlFor={`${item.id}-skills`}
                  placeholder="React, TypeScript, HTML, CSS"
                  required
                  value={item.skills}
                  error={itemErrors.skills}
                  onChange={(e) =>
                    patchDraft(item.id, { skills: e.target.value })
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
          addLabel="Add More"
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
        <p key={item.id} className="text-sm">
          <span
            className={
              item.category ? 'font-semibold' : 'font-normal text-muted-foreground'
            }
          >
            {item.category || PLACEHOLDERS.skills.category}:{' '}
          </span>
          <span className={item.skills ? undefined : 'text-muted-foreground'}>
            {item.skills || PLACEHOLDERS.skills.skills}
          </span>
        </p>
      ))}
    </div>
  )
}
