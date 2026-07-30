import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CVPreview } from '@/components/cv/CVPreview'
import { useCVStore } from '@/store/cvStore'

export function CVEditorPage() {
  const navigate = useNavigate()
  const title = useCVStore((s) => s.cv.title)

  return (
    <div className="min-h-svh bg-muted/40 font-normal">
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
        </div>
      </header>
      <main className="px-6 py-10">
        <CVPreview />
      </main>
    </div>
  )
}
