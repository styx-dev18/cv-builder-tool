export type SectionType =
  | 'personalInfo'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'languages'
  | 'projects'
  | 'publications'
  | 'awards'
  | 'references'
  | 'volunteering'

export interface PersonalInfoItem {
  id: string
  fullName: string
  location: string
  email: string
  phone: string
  linkedin: string
  github: string
  otherLink: string
}

export interface SummaryItem {
  id: string
  content: string
}

export interface ExperienceItem {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface EducationItem {
  id: string
  school: string
  degree: string
  honors: string
  startDate: string
  endDate: string
  gpa: string
}

export interface SkillsItem {
  id: string
  category: string
  skills: string
}

export interface CertificationItem {
  id: string
  name: string
  date: string
}

export interface LanguageItem {
  id: string
  language: string
  proficiency: string
}

export interface ProjectItem {
  id: string
  name: string
  link: string
  description: string
}

export interface PublicationItem {
  id: string
  title: string
  publisher: string
  date: string
  link: string
}

export interface AwardItem {
  id: string
  title: string
  issuer: string
  date: string
  description: string
}

export interface ReferenceItem {
  id: string
  name: string
  relationship: string
  email: string
  phone: string
}

export interface VolunteeringItem {
  id: string
  organization: string
  role: string
  startDate: string
  endDate: string
  description: string
}

export interface SectionItemMap {
  personalInfo: PersonalInfoItem
  summary: SummaryItem
  experience: ExperienceItem
  education: EducationItem
  skills: SkillsItem
  certifications: CertificationItem
  languages: LanguageItem
  projects: ProjectItem
  publications: PublicationItem
  awards: AwardItem
  references: ReferenceItem
  volunteering: VolunteeringItem
}

export interface CVSection<T extends SectionType = SectionType> {
  id: string
  type: T
  title: string
  items: SectionItemMap[T][]
}

export type AnyCVSection = CVSection<SectionType>

export interface CV {
  id: string
  title: string
  sections: AnyCVSection[]
}

export const SECTION_LABELS: Record<SectionType, string> = {
  personalInfo: 'Personal Info',
  summary: 'Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  certifications: 'Certifications',
  languages: 'Languages',
  projects: 'Projects',
  publications: 'Publications',
  awards: 'Awards',
  references: 'References',
  volunteering: 'Organizational & Volunteer Experiences',
}

export const OPTIONAL_SECTION_TYPES: SectionType[] = [
  'certifications',
  'languages',
  'publications',
  'awards',
  'references',
  'volunteering',
]
