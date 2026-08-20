import { ApiCVRepository } from './apiCVRepository'
import type { CVRepository } from './cvRepository'

export type { CVRepository, CVSummary } from './cvRepository'

export const cvRepository: CVRepository = new ApiCVRepository()
