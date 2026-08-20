import type { CV } from '@/types/cv'
import { apiRequest, apiRequestBlob, ApiError } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import type { CVRepository, CVSummary } from './cvRepository'

function accessToken(): string | undefined {
  return useAuthStore.getState().accessToken ?? undefined
}

export class ApiCVRepository implements CVRepository {
  async list(): Promise<CVSummary[]> {
    return apiRequest<CVSummary[]>('/cvs', { accessToken: accessToken() })
  }

  async get(id: string): Promise<CV | null> {
    try {
      return await apiRequest<CV>(`/cvs/${id}`, { accessToken: accessToken() })
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null
      throw err
    }
  }

  async save(cv: CV): Promise<CV> {
    return apiRequest<CV>(`/cvs/${cv.id}`, {
      method: 'PUT',
      body: { cv },
      accessToken: accessToken(),
    })
  }

  async remove(id: string): Promise<void> {
    await apiRequest<void>(`/cvs/${id}`, { method: 'DELETE', accessToken: accessToken() })
  }

  async duplicate(id: string, newTitle?: string): Promise<CV> {
    return apiRequest<CV>(`/cvs/${id}/duplicate`, {
      method: 'POST',
      body: newTitle !== undefined ? { title: newTitle } : {},
      accessToken: accessToken(),
    })
  }

  async downloadPdf(id: string): Promise<Blob> {
    return apiRequestBlob(`/cvs/${id}/pdf`, { accessToken: accessToken() })
  }
}
