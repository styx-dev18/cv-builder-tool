import { z } from 'zod'
import type { SectionItemMap, SectionType } from '@/types/cv'
import { SECTION_LABELS } from '@/types/cv'

const required = (fieldLabel: string) =>
  z.string().trim().min(1, `${fieldLabel} is required`)

const optional = z.string()

const personalInfoItemSchema = z.object({
  id: z.string(),
  fullName: required('Full name'),
  location: optional,
  email: required('Email').pipe(z.email('Enter a valid email')),
  phone: required('Phone number'),
  linkedin: optional,
  github: optional,
  otherLink: optional,
})

const summaryItemSchema = z.object({
  id: z.string(),
  content: optional,
})

const experienceItemSchema = z.object({
  id: z.string(),
  company: required('Company name'),
  position: required('Position'),
  location: required('Location'),
  startDate: required('Start date'),
  endDate: optional,
  current: z.boolean(),
  description: required('Job description'),
})

const educationItemSchema = z.object({
  id: z.string(),
  school: required('School'),
  degree: required('Degree'),
  honors: optional,
  startDate: required('Start date'),
  endDate: required('End date'),
  gpa: optional,
})

const skillsItemSchema = z.object({
  id: z.string(),
  category: required('Category'),
  skills: required('Skills'),
})

const certificationItemSchema = z.object({
  id: z.string(),
  name: required('Certification name'),
  date: optional,
})

const languageItemSchema = z.object({
  id: z.string(),
  language: required('Language'),
  proficiency: optional,
})

const projectItemSchema = z.object({
  id: z.string(),
  name: required('Project name'),
  link: optional,
  description: optional,
})

const publicationItemSchema = z.object({
  id: z.string(),
  title: required('Title'),
  publisher: optional,
  date: optional,
  link: optional,
})

const awardItemSchema = z.object({
  id: z.string(),
  title: required('Title'),
  issuer: optional,
  date: optional,
  description: optional,
})

const referenceItemSchema = z.object({
  id: z.string(),
  name: required('Name'),
  relationship: optional,
  email: optional,
  phone: optional,
})

const volunteeringItemSchema = z.object({
  id: z.string(),
  organization: required('Organization'),
  role: required('Role'),
  startDate: optional,
  endDate: optional,
  description: optional,
})

export const sectionItemSchemas = {
  personalInfo: personalInfoItemSchema,
  summary: summaryItemSchema,
  experience: experienceItemSchema,
  education: educationItemSchema,
  skills: skillsItemSchema,
  certifications: certificationItemSchema,
  languages: languageItemSchema,
  projects: projectItemSchema,
  publications: publicationItemSchema,
  awards: awardItemSchema,
  references: referenceItemSchema,
  volunteering: volunteeringItemSchema,
} satisfies { [T in SectionType]: z.ZodType<SectionItemMap[T]> }

export type FieldErrors<T> = Partial<Record<keyof T, string>>

export function validateItem<T extends SectionType>(
  type: T,
  item: SectionItemMap[T],
): FieldErrors<SectionItemMap[T]> {
  const schema = sectionItemSchemas[type]
  const result = schema.safeParse(item)
  if (result.success) return {}

  const errors: FieldErrors<SectionItemMap[T]> = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof SectionItemMap[T] | undefined
    if (key && !errors[key]) errors[key] = issue.message
  }
  return errors
}

export function validateItems<T extends SectionType>(
  type: T,
  items: SectionItemMap[T][],
): FieldErrors<SectionItemMap[T]>[] {
  return items.map((item) => validateItem(type, item))
}

export function hasAnyErrors(errorsList: FieldErrors<object>[]): boolean {
  return errorsList.some((errors) => Object.keys(errors).length > 0)
}

const sectionTypeSchema = z.enum(
  Object.keys(SECTION_LABELS) as [SectionType, ...SectionType[]],
)

const cvSectionSchema = z.object({
  id: z.string(),
  type: sectionTypeSchema,
  title: z.string(),
  items: z.array(z.record(z.string(), z.unknown())),
})

export const cvSchema = z.object({
  id: z.string(),
  title: z.string(),
  sections: z.array(cvSectionSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  schemaVersion: z.number(),
})

export type ParsedCV = z.infer<typeof cvSchema>
