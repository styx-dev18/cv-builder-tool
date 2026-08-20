import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CVPreview } from '@/components/cv/CVPreview'
import { useCVStore } from '@/store/cvStore'
import { useAutosaveCV } from '@/hooks/useAutosaveCV'
import { useCV, useDownloadCVPdf } from '@/hooks/useCV'

const SAVE_STATUS_LABEL: Record<string, string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'Saved',
  error: 'Could not save',
}

export function CVEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const title = useCVStore((s) => s.cv.title)
  const loadedCV = useCVStore((s) => s.cv)
  const loadCV = useCVStore((s) => s.loadCV)
  const { data: fetchedCV, isLoading, isError } = useCV(id)
  const loadedIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (fetchedCV && loadedIdRef.current !== fetchedCV.id) {
      loadedIdRef.current = fetchedCV.id
      loadCV(fetchedCV)
    }
  }, [fetchedCV, loadCV])

  const { status } = useAutosaveCV()
  const downloadPdf = useDownloadCVPdf()

  if (id && loadedCV.id !== id) {
    if (isLoading) {
      return (
        <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
          Loading CV…
        </div>
      )
    }
    if (isError || (!isLoading && !fetchedCV)) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">
            This CV couldn&apos;t be found.
          </p>
          <Button type="button" onClick={() => navigate('/')}>
            Back to CVs
          </Button>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-svh w-screen bg-muted/40 font-normal">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Back to CVs"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-sm font-medium">{title}</h1>
          <div className="ml-auto flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                downloadPdf.mutate({ id: loadedCV.id, title: loadedCV.title })
              }
              disabled={downloadPdf.isPending}
            >
              <Download className="size-4" />
              {downloadPdf.isPending ? 'Downloading…' : 'Download PDF'}
            </Button>
            <span
              className="text-xs text-muted-foreground"
              aria-live="polite"
            >
              {SAVE_STATUS_LABEL[status]}
            </span>
          </div>
        </div>
      </header>
      <main className="px-6 py-10 flex justify-center">
        <CVPreview />
      </main>
    </div>
  )
}
