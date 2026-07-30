import { useState } from 'react'

export function useAiGenerate(generate: () => Promise<string>) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run(onSuccess: (html: string) => void) {
    setGenerating(true)
    setError(null)
    try {
      const html = await generate()
      onSuccess(html)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate.')
    } finally {
      setGenerating(false)
    }
  }

  return { generating, error, run }
}
