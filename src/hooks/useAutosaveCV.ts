import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { CV } from '@/types/cv'
import { useCVStore } from '@/store/cvStore'
import { cvRepository } from '@/repositories'
import { cvKeys } from '@/hooks/useCV'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function useAutosaveCV(debounceMs = 800) {
  const cv = useCVStore((s) => s.cv)
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [lastSavedAt, setLastSavedAt] = useState<string | undefined>()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  const save = useCallback(
    async (target: CV) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }
      setStatus('saving')
      try {
        const saved = await cvRepository.save(target)
        setStatus('saved')
        setLastSavedAt(saved.updatedAt)
        queryClient.invalidateQueries({ queryKey: cvKeys.all })
        queryClient.setQueryData(cvKeys.detail(saved.id), saved)
      } catch {
        setStatus('error')
      }
    },
    [queryClient],
  )

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      void save(cv)
    }, debounceMs)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [cv, debounceMs, save])

  useEffect(() => {
    function handleFlush() {
      void save(cv)
    }
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') void save(cv)
    }

    window.addEventListener('beforeunload', handleFlush)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('beforeunload', handleFlush)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [cv, save])

  const saveNow = useCallback(() => save(cv), [cv, save])

  return { status, lastSavedAt, saveNow }
}
