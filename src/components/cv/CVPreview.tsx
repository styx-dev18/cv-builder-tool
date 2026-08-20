import { useCVStore } from '@/store/cvStore'
import type { AnyCVSection } from '@/types/cv'
import { SectionWrapper } from './SectionWrapper'
import { AddSectionMenu } from './AddSectionMenu'
import { OptionalSectionsRow } from './OptionalSectionsRow'
import { PersonalInfoSection } from './sections/PersonalInfoSection'
import { SummarySection } from './sections/SummarySection'
import { ExperienceSection } from './sections/ExperienceSection'
import { EducationSection } from './sections/EducationSection'
import { SkillsSection } from './sections/SkillsSection'
import { CertificationsSection } from './sections/CertificationsSection'
import { LanguagesSection } from './sections/LanguagesSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { PublicationsSection } from './sections/PublicationsSection'
import { AwardsSection } from './sections/AwardsSection'
import { ReferencesSection } from './sections/ReferencesSection'
import { VolunteeringSection } from './sections/VolunteeringSection'

function renderSection(
  section: AnyCVSection,
  isEditing: boolean,
  onStopEdit: () => void,
) {
  switch (section.type) {
    case 'personalInfo':
      return (
        <PersonalInfoSection
          section={section as never}
          isEditing={isEditing}
          onStopEdit={onStopEdit}
        />
      )
    case 'summary':
      return (
        <SummarySection
          section={section as never}
          isEditing={isEditing}
          onStopEdit={onStopEdit}
        />
      )
    case 'experience':
      return (
        <ExperienceSection
          section={section as never}
          isEditing={isEditing}
          onStopEdit={onStopEdit}
        />
      )
    case 'education':
      return (
        <EducationSection
          section={section as never}
          isEditing={isEditing}
          onStopEdit={onStopEdit}
        />
      )
    case 'skills':
      return (
        <SkillsSection
          section={section as never}
          isEditing={isEditing}
          onStopEdit={onStopEdit}
        />
      )
    case 'certifications':
      return (
        <CertificationsSection
          section={section as never}
          isEditing={isEditing}
          onStopEdit={onStopEdit}
        />
      )
    case 'languages':
      return (
        <LanguagesSection
          section={section as never}
          isEditing={isEditing}
          onStopEdit={onStopEdit}
        />
      )
    case 'projects':
      return (
        <ProjectsSection
          section={section as never}
          isEditing={isEditing}
          onStopEdit={onStopEdit}
        />
      )
    case 'publications':
      return (
        <PublicationsSection
          section={section as never}
          isEditing={isEditing}
          onStopEdit={onStopEdit}
        />
      )
    case 'awards':
      return (
        <AwardsSection
          section={section as never}
          isEditing={isEditing}
          onStopEdit={onStopEdit}
        />
      )
    case 'references':
      return (
        <ReferencesSection
          section={section as never}
          isEditing={isEditing}
          onStopEdit={onStopEdit}
        />
      )
    case 'volunteering':
      return (
        <VolunteeringSection
          section={section as never}
          isEditing={isEditing}
          onStopEdit={onStopEdit}
        />
      )
    default:
      return null
  }
}

export function CVPreview() {
  const sections = useCVStore((s) => s.cv.sections)
  const editingSectionIds = useCVStore((s) => s.editingSectionIds)
  const startEditingSection = useCVStore((s) => s.startEditingSection)
  const stopEditingSection = useCVStore((s) => s.stopEditingSection)
  const moveSectionUp = useCVStore((s) => s.moveSectionUp)
  const moveSectionDown = useCVStore((s) => s.moveSectionDown)
  const removeSection = useCVStore((s) => s.removeSection)

  return (
    <div className="flex flex-col gap-4 w-236.25 rounded-xl bg-card p-6 shadow-sm">
      <div className="flex flex-col">
        {sections.map((section, index) => {
          const isEditing = editingSectionIds.has(section.id)
          return (
            <SectionWrapper
              key={section.id}
              isEditing={isEditing}
              isFirst={index === 0}
              isLast={index === sections.length - 1}
              onEdit={() => startEditingSection(section.id)}
              onMoveUp={() => moveSectionUp(section.id)}
              onMoveDown={() => moveSectionDown(section.id)}
              onDelete={() => removeSection(section.id)}
            >
              {renderSection(section, isEditing, () =>
                stopEditingSection(section.id),
              )}
            </SectionWrapper>
          )
        })}
      </div>
      <div className="flex flex-col items-center gap-3">
        <AddSectionMenu />
        <OptionalSectionsRow />
      </div>
    </div>
  )
}
