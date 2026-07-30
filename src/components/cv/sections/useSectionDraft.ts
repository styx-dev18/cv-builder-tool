import { useState } from 'react'
import { useCVStore } from '@/store/cvStore'
import type { SectionItemMap, SectionType } from '@/types/cv'
import { createEmptyItem } from '@/utils/cvFactory'
import { hasAnyErrors, validateItems, type FieldErrors } from '@/schemas/cvSchemas'

export function useSectionDraft<T extends SectionType>(
  sectionId: string,
  sectionType: T,
  savedItems: SectionItemMap[T][],
  isEditing: boolean,
  onStopEdit: () => void,
) {
  const updateItem = useCVStore((s) => s.updateItem)
  const removeItem = useCVStore((s) => s.removeItem)

  const [draftItems, setDraftItems] = useState<SectionItemMap[T][]>(savedItems)
  const [wasEditing, setWasEditing] = useState(isEditing)
  const [errors, setErrors] = useState<FieldErrors<SectionItemMap[T]>[]>([])

  if (isEditing && !wasEditing) {
    setWasEditing(true)
    setDraftItems(savedItems)
    setErrors([])
  } else if (!isEditing && wasEditing) {
    setWasEditing(false)
  }

  function patchDraft(itemId: string, patch: Partial<SectionItemMap[T]>) {
    setDraftItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    )
    setErrors((prev) =>
      prev.length === 0
        ? prev
        : draftItems.map((item, index) =>
            item.id === itemId ? {} : (prev[index] ?? {}),
          ),
    )
  }

  function addDraftItem() {
    setDraftItems((prev) => [...prev, createEmptyItem(sectionType)])
  }

  function removeDraftItem(itemId: string) {
    setDraftItems((prev) => prev.filter((item) => item.id !== itemId))
    setErrors((prev) =>
      prev.length === 0
        ? prev
        : draftItems
            .filter((item) => item.id !== itemId)
            .map((_, index) => prev[index] ?? {}),
    )
  }

  function handleSave() {
    const nextErrors = validateItems(sectionType, draftItems)
    if (hasAnyErrors(nextErrors)) {
      setErrors(nextErrors)
      return
    }

    for (const draftItem of draftItems) {
      updateItem(sectionId, draftItem.id, draftItem)
    }
    const removedIds = savedItems
      .filter((item) => !draftItems.some((d) => d.id === item.id))
      .map((item) => item.id)
    for (const id of removedIds) removeItem(sectionId, id)
    setErrors([])
    onStopEdit()
  }

  function handleCancel() {
    setDraftItems(savedItems)
    setErrors([])
    onStopEdit()
  }

  return {
    draftItems,
    errors,
    patchDraft,
    addDraftItem,
    removeDraftItem,
    handleSave,
    handleCancel,
  }
}
