import type { CV } from '@/types/cv'
import { cvSchema } from '@/schemas/cvSchemas'
import { duplicateCV } from '@/utils/cvFactory'
import type { CVRepository, CVSummary } from './cvRepository'

const STORAGE_KEY = 'cv-builder:cvs'
const STORAGE_VERSION = 1

interface StoredShapeV1 {
  version: 1
  cvs: Record<string, CV>
}

type StoredShape = StoredShapeV1

function isProbablyStoredShape(value: unknown): value is { version: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'version' in value &&
    typeof (value as { version: unknown }).version === 'number'
  )
}

function migrate(raw: unknown): StoredShape {
  if (!isProbablyStoredShape(raw)) {
    return { version: STORAGE_VERSION, cvs: {} }
  }
  // No migrations needed yet; STORAGE_VERSION is 1 and this is the first shape.
  // Future migrations: switch/chain on raw.version here, producing StoredShapeV1.
  return raw as StoredShape
}

function probeStorageAvailable(): boolean {
  try {
    const testKey = `${STORAGE_KEY}:__probe__`
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export class LocalStorageCVRepository implements CVRepository {
  readonly isAvailable: boolean

  constructor() {
    this.isAvailable = probeStorageAvailable()
  }

  private readAll(): StoredShape {
    if (!this.isAvailable) return { version: STORAGE_VERSION, cvs: {} }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return { version: STORAGE_VERSION, cvs: {} }

      const parsed = migrate(JSON.parse(raw))
      return parsed
    } catch {
      return { version: STORAGE_VERSION, cvs: {} }
    }
  }

  private writeAll(shape: StoredShape): void {
    if (!this.isAvailable) return

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shape))
    } catch (err) {
      const isQuotaError =
        err instanceof DOMException &&
        (err.name === 'QuotaExceededError' ||
          err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
      throw new Error(
        isQuotaError
          ? 'Storage is full. Delete an old CV to free up space.'
          : 'Could not save your CV to this browser.',
      )
    }
  }

  async list(): Promise<CVSummary[]> {
    const { cvs } = this.readAll()
    return Object.values(cvs)
      .map(({ id, title, createdAt, updatedAt }) => ({
        id,
        title,
        createdAt,
        updatedAt,
      }))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }

  async get(id: string): Promise<CV | null> {
    const { cvs } = this.readAll()
    return cvs[id] ?? null
  }

  async save(cv: CV): Promise<CV> {
    const shape = this.readAll()
    const existing = shape.cvs[cv.id]
    const now = new Date().toISOString()

    const toStore: CV = {
      ...cv,
      createdAt: existing?.createdAt ?? cv.createdAt ?? now,
      updatedAt: now,
    }

    const result = cvSchema.safeParse(toStore)
    if (!result.success) {
      throw new Error('CV data is invalid and was not saved.')
    }

    shape.cvs[cv.id] = toStore
    this.writeAll(shape)
    return toStore
  }

  async remove(id: string): Promise<void> {
    const shape = this.readAll()
    delete shape.cvs[id]
    this.writeAll(shape)
  }

  async duplicate(id: string, newTitle?: string): Promise<CV> {
    const existing = await this.get(id)
    if (!existing) throw new Error('CV not found')

    const copy = duplicateCV(existing, newTitle)
    return this.save(copy)
  }

  async downloadPdf(): Promise<Blob> {
    throw new Error(
      'Downloading a PDF requires signing in — it is not available in offline mode.',
    )
  }
}
