import { create } from 'zustand'
import { WeeklyTemplate } from '@/types/template'

interface TemplateState {
  templates: WeeklyTemplate[]
  isLoading: boolean
  error: string | null

  setTemplates: (templates: WeeklyTemplate[]) => void
  addTemplate: (template: WeeklyTemplate) => void
  updateTemplate: (template: WeeklyTemplate) => void
  removeTemplate: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useTemplateStore = create<TemplateState>((set) => ({
  templates: [],
  isLoading: false,
  error: null,

  setTemplates: (templates) => set({ templates, error: null }),

  addTemplate: (template) =>
    set((state) => ({ templates: [...state.templates, template] })),

  updateTemplate: (template) =>
    set((state) => ({
      templates: state.templates.map((t) => (t.id === template.id ? template : t)),
    })),

  removeTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((t) => t.id !== id),
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
