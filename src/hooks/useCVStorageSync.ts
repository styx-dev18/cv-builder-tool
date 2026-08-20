import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { cvKeys } from '@/hooks/useCV'

const STORAGE_KEY = 'cv-builder:cvs'

export function useCVStorageSync() {
  const queryClient = useQueryClient()

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return
      queryClient.invalidateQueries({ queryKey: cvKeys.all })
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [queryClient])
}
