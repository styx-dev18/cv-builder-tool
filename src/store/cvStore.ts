import { create } from 'zustand'
import type { AnyCVSection, CV, SectionItemMap, SectionType } from '@/types/cv'
import { createEmptyCV, createEmptyItem, createSection } from '@/utils/cvFactory'

interface CVStore {
  cv: CV
  editingSectionIds: Set<string>

  loadCV: (cv: CV, options?: { startInEditMode?: boolean }) => void

  startEditingSection: (sectionId: string) => void
  stopEditingSection: (sectionId: string) => void

  addSection: (type: SectionType) => void
  removeSection: (sectionId: string) => void
  moveSectionUp: (sectionId: string) => void
  moveSectionDown: (sectionId: string) => void

  addItem: (sectionId: string) => void
  removeItem: (sectionId: string, itemId: string) => void
  updateItem: <T extends SectionType>(
    sectionId: string,
    itemId: string,
    patch: Partial<SectionItemMap[T]>,
  ) => void
}

function moveItem<T>(arr: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction
  if (target < 0 || target >= arr.length) return arr
  const next = [...arr]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

function withoutId(ids: Set<string>, id: string): Set<string> {
  if (!ids.has(id)) return ids
  const next = new Set(ids)
  next.delete(id)
  return next
}

const initialCV = createEmptyCV()

export const useCVStore = create<CVStore>((set) => ({
  cv: initialCV,
  editingSectionIds: new Set<string>(),

  loadCV: (cv, options) =>
    set({
      cv,
      editingSectionIds: options?.startInEditMode
        ? new Set(cv.sections.map((s) => s.id))
        : new Set(),
    }),

  startEditingSection: (sectionId) =>
    set((state) => ({
      editingSectionIds: new Set(state.editingSectionIds).add(sectionId),
    })),
  stopEditingSection: (sectionId) =>
    set((state) => ({
      editingSectionIds: withoutId(state.editingSectionIds, sectionId),
    })),

  addSection: (type) =>
    set((state) => {
      const section = createSection(type)
      return {
        cv: {
          ...state.cv,
          sections: [...state.cv.sections, section],
        },
        editingSectionIds: new Set(state.editingSectionIds).add(section.id),
      }
    }),

  removeSection: (sectionId) =>
    set((state) => ({
      cv: {
        ...state.cv,
        sections: state.cv.sections.filter((s) => s.id !== sectionId),
      },
      editingSectionIds: withoutId(state.editingSectionIds, sectionId),
    })),

  moveSectionUp: (sectionId) =>
    set((state) => {
      const index = state.cv.sections.findIndex((s) => s.id === sectionId)
      if (index === -1) return state
      return {
        cv: {
          ...state.cv,
          sections: moveItem(state.cv.sections, index, -1),
        },
      }
    }),

  moveSectionDown: (sectionId) =>
    set((state) => {
      const index = state.cv.sections.findIndex((s) => s.id === sectionId)
      if (index === -1) return state
      return {
        cv: {
          ...state.cv,
          sections: moveItem(state.cv.sections, index, 1),
        },
      }
    }),

  addItem: (sectionId) =>
    set((state) => ({
      cv: {
        ...state.cv,
        sections: state.cv.sections.map((section): AnyCVSection =>
          section.id === sectionId
            ? {
                ...section,
                items: [...section.items, createEmptyItem(section.type)],
              }
            : section,
        ),
      },
    })),

  removeItem: (sectionId, itemId) =>
    set((state) => ({
      cv: {
        ...state.cv,
        sections: state.cv.sections.map((section): AnyCVSection =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.filter((item) => item.id !== itemId),
              }
            : section,
        ),
      },
    })),

  updateItem: (sectionId, itemId, patch) =>
    set((state) => ({
      cv: {
        ...state.cv,
        sections: state.cv.sections.map((section): AnyCVSection =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.map((item) =>
                  item.id === itemId ? { ...item, ...patch } : item,
                ),
              }
            : section,
        ),
      },
    })),
}))
