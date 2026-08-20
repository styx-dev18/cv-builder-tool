import type { CVSection } from '@/types/cv'
import { Separator } from '@/components/ui/separator'
import { DateChipField } from './DateChipField'
import { EntryDeleteButton } from './EntryDeleteButton'
import { InputField } from './Field'
import { PLACEHOLDERS } from './placeholders'
import { SectionEditFooter } from './SectionEditFooter'
import { useSectionDraft } from './useSectionDraft'

interface Props {
  section: CVSection<'publications'>
  isEditing: boolean
  onStopEdit: () => void
}

export function PublicationsSection({ section, isEditing, onStopEdit }: Props) {
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
    'publications',
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
                  label="Title"
                  htmlFor={`${item.id}-title`}
                  required
                  className="col-span-2"
                  value={item.title}
                  error={itemErrors.title}
                  onChange={(e) => patchDraft(item.id, { title: e.target.value })}
                />
                <InputField
                  label="Publisher"
                  htmlFor={`${item.id}-publisher`}
                  value={item.publisher}
                  onChange={(e) =>
                    patchDraft(item.id, { publisher: e.target.value })
                  }
                />
                <DateChipField
                  label="Date"
                  htmlFor={`${item.id}-date`}
                  placeholder="Month Year"
                  value={item.date}
                  onChange={(value) => patchDraft(item.id, { date: value })}
                />
                <InputField
                  label="Link"
                  htmlFor={`${item.id}-link`}
                  placeholder="https://…"
                  className="col-span-2"
                  value={item.link}
                  onChange={(e) => patchDraft(item.id, { link: e.target.value })}
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
        <div key={item.id} className="ml-2 mb-1 flex items-baseline justify-between gap-2">
          <div>
            <p className="font-semibold">
              {item.title || (
                <span className="font-normal text-muted-foreground">
                  {PLACEHOLDERS.publications.title}
                </span>
              )}
            </p>
            {item.publisher && (
              <p className="text-sm text-muted-foreground">{item.publisher}</p>
            )}
          </div>
          {item.date && <p className="shrink-0 font-semibold">{item.date}</p>}
        </div>
      ))}
    </div>
  )
}
