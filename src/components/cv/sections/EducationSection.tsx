import type { CVSection } from '@/types/cv'
import { Separator } from '@/components/ui/separator'
import { MonthYearDateField } from './MonthYearDateField'
import { EntryDeleteButton } from './EntryDeleteButton'
import { InputField } from './Field'
import { PLACEHOLDERS } from './placeholders'
import { SectionEditFooter } from './SectionEditFooter'
import { useSectionDraft } from './useSectionDraft'

interface Props {
  section: CVSection<'education'>
  isEditing: boolean
  onStopEdit: () => void
}

export function EducationSection({ section, isEditing, onStopEdit }: Props) {
  const {
    draftItems,
    errors,
    patchDraft,
    addDraftItem,
    removeDraftItem,
    handleSave,
    handleCancel,
  } = useSectionDraft(section.id, 'education', section.items, isEditing, onStopEdit)

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
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <InputField
                  label="Educational Institution Name"
                  htmlFor={`${item.id}-school`}
                  required
                  className="flex-1"
                  value={item.school}
                  error={itemErrors.school}
                  onChange={(e) =>
                    patchDraft(item.id, { school: e.target.value })
                  }
                />
                {draftItems.length > 1 && (
                  <EntryDeleteButton onClick={() => removeDraftItem(item.id)} />
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                <InputField
                  label="Degree"
                  htmlFor={`${item.id}-degree`}
                  required
                  value={item.degree}
                  error={itemErrors.degree}
                  onChange={(e) =>
                    patchDraft(item.id, { degree: e.target.value })
                  }
                />
                <InputField
                  label="Honors / Awards"
                  htmlFor={`${item.id}-honors`}
                  value={item.honors}
                  onChange={(e) =>
                    patchDraft(item.id, { honors: e.target.value })
                  }
                />
                <MonthYearDateField
                  label="Start Date"
                  htmlFor={`${item.id}-startDate`}
                  required
                  placeholder="MM/YYYY"
                  value={item.startDate}
                  error={itemErrors.startDate}
                  onChange={(value) => patchDraft(item.id, { startDate: value })}
                />
                <MonthYearDateField
                  label="End Date"
                  htmlFor={`${item.id}-endDate`}
                  required
                  placeholder="MM/YYYY"
                  value={item.endDate}
                  error={itemErrors.endDate}
                  onChange={(value) => patchDraft(item.id, { endDate: value })}
                />
              </div>
              <InputField
                label="GPA"
                htmlFor={`${item.id}-gpa`}
                placeholder="3.75 of 4.0"
                className="max-w-52"
                value={item.gpa}
                onChange={(e) => patchDraft(item.id, { gpa: e.target.value })}
              />
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
        const hasDate = item.startDate || item.endDate
        return (
          <div key={item.id} className="ml-2 mb-1">
            <div className="flex items-start text-sm justify-between gap-2">
              <div>
                <p className="font-bold">
                  {item.degree || (
                    <span className="text-muted-foreground">
                      {PLACEHOLDERS.education.degree}
                    </span>
                  )}
                </p>
                <p className="text-sm">
                  {item.school || (
                    <span className="text-muted-foreground">
                      {PLACEHOLDERS.education.school}
                    </span>
                  )}
                </p>
                {item.honors && (
                  <p className="text-sm text-muted-foreground">{item.honors}</p>
                )}
              </div>
              <div className="shrink-0 text-right text-sm">
                <p>
                  {hasDate ? (
                    <>
                      {item.startDate}
                      {(item.startDate || item.endDate) && ' - '}
                      {item.endDate}
                    </>
                  ) : (
                    PLACEHOLDERS.education.dateRange
                  )}
                </p>
                {item.gpa && (
                  <p>
                    <span className="font-semibold">GPA:</span> {item.gpa}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
