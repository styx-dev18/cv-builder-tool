import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useCVStore } from '@/store/cvStore'
import { createEmptyCV } from '@/utils/cvFactory'

export function CVListPage() {
  const navigate = useNavigate()
  const loadCV = useCVStore((s) => s.loadCV)

  function handleCreateNewCV() {
    const cv = createEmptyCV()
    loadCV(cv)
    navigate(`/cvs/${cv.id}/edit`)
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-semibold">CV/Resume Builder</h1>
      <p className="text-muted-foreground">
        Project scaffolded successfully. Start building your CVs here.
      </p>
      <Button onClick={handleCreateNewCV}>Create New CV</Button>
    </div>
  )
}
