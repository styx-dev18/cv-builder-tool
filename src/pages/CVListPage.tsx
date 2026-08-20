import '@fontsource/archivo/400.css'
import '@fontsource/archivo/600.css'
import '@fontsource/archivo/700.css'
import '@fontsource/archivo/800.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Clock, FileText, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserMenu } from '@/components/auth/UserMenu'
import { useCVStore } from '@/store/cvStore'
import { createEmptyCV } from '@/utils/cvFactory'
import { cvRepository } from '@/repositories'
import {
  useCVList,
  useDeleteCV,
  useDownloadCVPdf,
  useDuplicateCV,
  useSaveCV,
} from '@/hooks/useCV'

import type { CVSummary } from '@/repositories'

export function CVListPage() {
  const navigate = useNavigate()
  const loadCV = useCVStore((s) => s.loadCV)
  const { data: cvs, isLoading } = useCVList()
  const saveCV = useSaveCV()
  const deleteCV = useDeleteCV()
  const duplicateCV = useDuplicateCV()
  const downloadPdf = useDownloadCVPdf()
  const [renamingId, setRenamingId] = useState<string | null>(null)

  async function handleCreateNewCV() {
    const cv = createEmptyCV()
    await saveCV.mutateAsync(cv)
    loadCV(cv)
    navigate(`/cvs/${cv.id}/edit`)
  }

  async function handleOpen(id: string) {
    const cv = await cvRepository.get(id)
    if (!cv) return
    loadCV(cv)
    navigate(`/cvs/${id}/edit`)
  }

  async function handleRename(cv: CVSummary, title: string) {
    setRenamingId(null)
    if (!title.trim() || title === cv.title) return
    const full = await cvRepository.get(cv.id)
    if (!full) return
    await saveCV.mutateAsync({ ...full, title: title.trim() })
  }

  function handleDelete(cv: CVSummary) {
    if (!window.confirm(`Delete "${cv.title}"? This can't be undone.`)) return
    deleteCV.mutate(cv.id)
  }

  function handleDuplicate(cv: CVSummary) {
    duplicateCV.mutate({ id: cv.id })
  }

  function handleDownload(cv: CVSummary) {
    downloadPdf.mutate({ id: cv.id, title: cv.title })
  }

  return (
    <div
      className="min-h-svh bg-[#f3f2f2] text-[#201e1d]"
      style={{ fontFamily: "'Archivo', system-ui, sans-serif" }}
    >
      <nav className="flex items-center gap-4 border-b-2 border-[#201e1d]/40 px-4 py-3">
        <span className="mr-auto text-lg font-extrabold">CV Builder</span>
        <UserMenu />
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h1 className="text-[34px] leading-none font-extrabold">Your CVs</h1>
          <Button
            onClick={handleCreateNewCV}
            disabled={saveCV.isPending}
            className="h-auto rounded-[10px] bg-[#ec3013] px-8 py-2 font-extrabold text-[#f3f2f2] hover:bg-[#dd2b0f] active:bg-[#ae1800]"
          >
            New +
          </Button>
        </div>

        {isLoading ? null : cvs && cvs.length > 0 ? (
          <ul className="mt-6 flex flex-col">
            {cvs.map((cv) => (
              <li
                key={cv.id}
                className="grid grid-cols-[1fr_auto] items-center gap-4 border-b-2 border-[#201e1d]/40 hover:bg-[#201e1d]/3 p-4"
              >
                <button
                  type="button"
                  className="flex min-w-0 flex-col items-start gap-1 text-left"
                  onClick={() => handleOpen(cv.id)}
                >
                  {renamingId === cv.id ? (
                    <Input
                      ref={(el) => el?.focus()}
                      defaultValue={cv.title}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) => handleRename(cv, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.currentTarget.blur()
                        if (e.key === 'Escape') setRenamingId(null)
                      }}
                      className="h-auto rounded-none border-[#201e1d]/40 bg-white px-2 py-1 text-lg font-extrabold"
                    />
                  ) : (
                    <span className="truncate text-lg font-extrabold">
                      {cv.title}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-[11px] text-[#201e1d]/50">
                    <Clock className="size-3.5" />
                    Updated{' '}
                    {formatDistanceToNow(new Date(cv.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Actions for ${cv.title}`}
                      className="rounded-none text-[#ec3013] hover:bg-[#ec3013]/10 hover:text-[#ec3013]"
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="min-w-42.5 rounded-none border border-[#201e1d]/15 bg-[#eae9e9] p-1 shadow-lg"
                  >
                    <DropdownMenuItem
                      className="rounded-none px-3 py-2 text-sm focus:bg-[#fff2ef]"
                      onSelect={() => handleOpen(cv.id)}
                    >
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-none px-3 py-2 text-sm focus:bg-[#fff2ef]"
                      onSelect={() => setRenamingId(cv.id)}
                    >
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-none px-3 py-2 text-sm focus:bg-[#fff2ef]"
                      onSelect={() => handleDuplicate(cv)}
                    >
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-none px-3 py-2 text-sm focus:bg-[#fff2ef]"
                      onSelect={() => handleDownload(cv)}
                    >
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      className="rounded-none px-3 py-2 text-sm data-[variant=destructive]:text-[#ae1800] data-[variant=destructive]:focus:bg-[#fff2ef] data-[variant=destructive]:focus:text-[#ae1800]"
                      onSelect={() => handleDelete(cv)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center text-[#201e1d]/50">
            <FileText className="size-8 text-[#ec3013]" />
            <p>No CVs yet. Create your first one to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
