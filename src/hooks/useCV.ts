import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CV } from '@/types/cv'
import { cvRepository } from '@/repositories'
import { buildPdfFilename, triggerBrowserDownload } from '@/utils/downloadFile'

export const cvKeys = {
  all: ['cvs'] as const,
  detail: (id: string) => ['cvs', id] as const,
}

export function useCVList() {
  return useQuery({
    queryKey: cvKeys.all,
    queryFn: () => cvRepository.list(),
  })
}

export function useCV(id: string | undefined) {
  return useQuery({
    queryKey: cvKeys.detail(id ?? ''),
    queryFn: () => cvRepository.get(id!),
    enabled: !!id,
  })
}

export function useSaveCV() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cv: CV) => cvRepository.save(cv),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: cvKeys.all })
      queryClient.setQueryData(cvKeys.detail(saved.id), saved)
    },
  })
}

export function useDeleteCV() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cvRepository.remove(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: cvKeys.all })
      queryClient.removeQueries({ queryKey: cvKeys.detail(id) })
    },
  })
}

export function useDuplicateCV() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle?: string }) =>
      cvRepository.duplicate(id, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cvKeys.all })
    },
  })
}

export function useDownloadCVPdf() {
  return useMutation({
    mutationFn: ({ id }: { id: string; title: string }) => cvRepository.downloadPdf(id),
    onSuccess: (blob, { title }) => {
      triggerBrowserDownload(blob, buildPdfFilename(title))
    },
  })
}
