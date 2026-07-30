export interface GenerateSummaryParams {
  jobTitle?: string
  experienceHtml?: string
}

export interface GenerateJobDescriptionParams {
  company: string
  position: string
}

// Stub: no AI backend is wired up yet. Replace with a real API call
// (e.g. POST /api/v1/ai/generate-summary) once one exists.
export async function generateSummary(
  params: GenerateSummaryParams,
): Promise<string> {
  throw new Error(`AI generation is not available yet. (${JSON.stringify(params)})`)
}

export async function generateJobDescription(
  params: GenerateJobDescriptionParams,
): Promise<string> {
  throw new Error(`AI generation is not available yet. (${JSON.stringify(params)})`)
}
