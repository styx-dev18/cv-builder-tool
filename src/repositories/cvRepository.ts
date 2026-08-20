import type { CV } from '@/types/cv'

export interface CVSummary {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface CVRepository {
  list(): Promise<CVSummary[]>
  get(id: string): Promise<CV | null>
  save(cv: CV): Promise<CV>
  remove(id: string): Promise<void>
  duplicate(id: string, newTitle?: string): Promise<CV>
  downloadPdf(id: string): Promise<Blob>
}
