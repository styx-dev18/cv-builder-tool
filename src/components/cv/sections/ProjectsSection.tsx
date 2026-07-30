import { ExternalLink } from 'lucide-react'
import type { CVSection } from '@/types/cv'
import { Separator } from '@/components/ui/separator'
import { EntryDeleteButton } from './EntryDeleteButton'
import { InputField, TextareaField } from './Field'
import { PLACEHOLDERS } from './placeholders'
import { SectionEditFooter } from './SectionEditFooter'
import { useSectionDraft } from './useSectionDraft'

interface Props {
  section: CVSection<'projects'>
  isEditing: boolean
  onStopEdit: () => void
}

export function ProjectsSection({ section, isEditing, onStopEdit }: Props) {
  const {
    draftItems,
    errors,
    patchDraft,
    addDraftItem,
    removeDraftItem,
    handleSave,
    handleCancel,
  } = useSectionDraft(section.id, 'projects', section.items, isEditing, onStopEdit)

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
                    label="Project Name"
                    htmlFor={`${item.id}-name`}
                    required
                    value={item.name}
                    error={itemErrors.name}
                    onChange={(e) =>
                      patchDraft(item.id, { name: e.target.value })
                    }
                  />
                  <InputField
                    label="Link"
                    htmlFor={`${item.id}-link`}
                    placeholder="https://…"
                    value={item.link}
                    onChange={(e) =>
                      patchDraft(item.id, { link: e.target.value })
                    }
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
        <div key={item.id}>
          <p className="flex items-center gap-1 font-semibold">
            {item.name || (
              <span className="font-normal text-muted-foreground">
                {PLACEHOLDERS.projects.name}
              </span>
            )}
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${item.name || 'project'} link`}
                className="text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="size-3.5" />
              </a>
            )}
          </p>
          {item.description && (
            <p className="pl-4 text-sm text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
