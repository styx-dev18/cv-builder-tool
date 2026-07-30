import type {
  AnyCVSection,
  CV,
  SectionItemMap,
  SectionType,
} from '@/types/cv'
import { SECTION_LABELS } from '@/types/cv'

function nanoid(): string {
  return crypto.randomUUID()
}

export function createEmptyItem<T extends SectionType>(
  type: T,
): SectionItemMap[T] {
  const id = nanoid()

  switch (type) {
    case 'personalInfo':
      return {
        id,
        fullName: '',
        location: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        otherLink: '',
      } satisfies SectionItemMap['personalInfo'] as SectionItemMap[T]
    case 'summary':
      return {
        id,
        content: '',
      } satisfies SectionItemMap['summary'] as SectionItemMap[T]
    case 'experience':
      return {
        id,
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      } satisfies SectionItemMap['experience'] as SectionItemMap[T]
    case 'education':
      return {
        id,
        school: '',
        degree: '',
        honors: '',
        startDate: '',
        endDate: '',
        gpa: '',
      } satisfies SectionItemMap['education'] as SectionItemMap[T]
    case 'skills':
      return {
        id,
        category: '',
        skills: '',
      } satisfies SectionItemMap['skills'] as SectionItemMap[T]
    case 'certifications':
      return {
        id,
        name: '',
        date: '',
      } satisfies SectionItemMap['certifications'] as SectionItemMap[T]
    case 'languages':
      return {
        id,
        language: '',
        proficiency: '',
      } satisfies SectionItemMap['languages'] as SectionItemMap[T]
    case 'projects':
      return {
        id,
        name: '',
        link: '',
        description: '',
      } satisfies SectionItemMap['projects'] as SectionItemMap[T]
    case 'publications':
      return {
        id,
        title: '',
        publisher: '',
        date: '',
        link: '',
      } satisfies SectionItemMap['publications'] as SectionItemMap[T]
    case 'awards':
      return {
        id,
        title: '',
        issuer: '',
        date: '',
        description: '',
      } satisfies SectionItemMap['awards'] as SectionItemMap[T]
    case 'references':
      return {
        id,
        name: '',
        relationship: '',
        email: '',
        phone: '',
      } satisfies SectionItemMap['references'] as SectionItemMap[T]
    case 'volunteering':
      return {
        id,
        organization: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
      } satisfies SectionItemMap['volunteering'] as SectionItemMap[T]
    default: {
      const exhaustive: never = type
      throw new Error(`Unknown section type: ${exhaustive}`)
    }
  }
}

export function createSection(type: SectionType): AnyCVSection {
  return {
    id: nanoid(),
    type,
    title: SECTION_LABELS[type],
    items: [createEmptyItem(type)],
  }
}

export function createEmptyCV(title = 'Untitled CV'): CV {
  return {
    id: nanoid(),
    title,
    sections: [
      createSection('personalInfo'),
      createSection('summary'),
      createSection('experience'),
      createSection('education'),
      createSection('skills'),
      createSection('projects'),
    ],
  }
}
