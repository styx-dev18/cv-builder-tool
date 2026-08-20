import type { CVSection, ExperienceItem } from '@/types/cv'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { generateJobDescription } from '@/services/aiService'
import type { FieldErrors } from '@/schemas/cvSchemas'
import { MonthYearDateField } from './MonthYearDateField'
import { EntryDeleteButton } from './EntryDeleteButton'
import { InputField } from './Field'
import { RichTextEditor } from './RichTextEditor'
import { useAiGenerate } from './useAiGenerate'
import { PLACEHOLDERS } from './placeholders'
import { SectionEditFooter } from './SectionEditFooter'
import { useSectionDraft } from './useSectionDraft'

interface Props {
  section: CVSection<'experience'>
  isEditing: boolean
  onStopEdit: () => void
}

export function ExperienceSection({ section, isEditing, onStopEdit }: Props) {
  const {
    draftItems,
    errors,
    patchDraft,
    addDraftItem,
    removeDraftItem,
    handleSave,
    handleCancel,
  } = useSectionDraft(section.id, 'experience', section.items, isEditing, onStopEdit)

  if (isEditing) {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="border-b border-border pb-1 text-sm font-bold uppercase">
          {section.title}
        </h2>
        {draftItems.map((item, index) => (
          <ExperienceItemEditor
            key={item.id}
            item={item}
            errors={errors[index] ?? {}}
            showDivider={index > 0}
            showDelete={draftItems.length > 1}
            onChange={(patch) => patchDraft(item.id, patch)}
            onDelete={() => removeDraftItem(item.id)}
          />
        ))}
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
        const hasDate = item.startDate || item.endDate || item.current
        return (
          <div key={item.id} className="mb-1 ml-2">
            <div className="flex font-bold text-sm items-baseline justify-between gap-2">
              <p>
                {item.position ? (
                  item.position
                ) : (
                  <span className="text-muted-foreground">
                    {PLACEHOLDERS.experience.position}
                  </span>
                )}
              </p>
              <p className="shrink-0">
                {hasDate ? (
                  <>
                    {item.startDate}
                    {(item.startDate || item.endDate || item.current) && ' – '}
                    {item.current ? 'Present' : item.endDate}
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    {PLACEHOLDERS.experience.dateRange}
                  </span>
                )}
              </p>
            </div>
            <div className="flex text-sm font-bold items-baseline justify-between gap-2">
              <p>
                {item.company ? (
                    `${item.company}`
                  ) : (
                    <span className="shrink-0 text-muted-foreground">
                      {PLACEHOLDERS.experience.company}
                    </span>
                  )}
              </p>
              <p>
                {item.location ?
                  (
                    `${item.location}`
                  ) :
                  (<span className="shrink-0 text-muted-foreground">{PLACEHOLDERS.experience.location}</span>)
                }
              </p>
            </div>
            {item.description ? (
              <div
                className="prose prose-sm max-w-none text-sm [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {PLACEHOLDERS.experience.description}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ExperienceItemEditor({
  item,
  errors,
  showDivider,
  showDelete,
  onChange,
  onDelete,
}: {
  item: ExperienceItem
  errors: FieldErrors<ExperienceItem>
  showDivider: boolean
  showDelete: boolean
  onChange: (patch: Partial<ExperienceItem>) => void
  onDelete: () => void
}) {
  const { generating, run } = useAiGenerate(() =>
    generateJobDescription({ company: item.company, position: item.position }),
  )

  return (
    <div>
      {showDivider && <Separator className="mb-5" />}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <InputField
            label="Company Name"
            htmlFor={`${item.id}-company`}
            required
            className="flex-1"
            value={item.company}
            error={errors.company}
            onChange={(e) => onChange({ company: e.target.value })}
          />
          {showDelete && <EntryDeleteButton onClick={onDelete} />}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`${item.id}-current`}
            checked={item.current}
            onCheckedChange={(checked) =>
              onChange({ current: checked === true })
            }
          />
          <Label htmlFor={`${item.id}-current`} className="text-sm font-normal">
            I am currently working in this role
          </Label>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <InputField
            label="Position"
            htmlFor={`${item.id}-position`}
            required
            value={item.position}
            error={errors.position}
            onChange={(e) => onChange({ position: e.target.value })}
          />
          <InputField
            label="City, Country"
            htmlFor={`${item.id}-location`}
            required
            value={item.location}
            error={errors.location}
            onChange={(e) => onChange({ location: e.target.value })}
          />
          <MonthYearDateField
            label="Start Date"
            htmlFor={`${item.id}-startDate`}
            required
            placeholder="MM/YYYY"
            value={item.startDate}
            error={errors.startDate}
            onChange={(value) => onChange({ startDate: value })}
          />
          {!item.current && (
            <MonthYearDateField
              label="End Date"
              htmlFor={`${item.id}-endDate`}
              placeholder="MM/YYYY"
              value={item.endDate}
              onChange={(value) => onChange({ endDate: value })}
            />
          )}
        </div>
        <RichTextEditor
          label="Job Descriptions"
          required
          content={item.description}
          error={errors.description}
          onChange={(html) => onChange({ description: html })}
          onGenerate={() => run((html) => onChange({ description: html }))}
          generateLabel="Generate Job Descriptions"
          generating={generating}
        />
      </div>
    </div>
  )
}
