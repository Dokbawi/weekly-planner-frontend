import { create } from 'zustand'
import { WeeklyPlan, Task } from '@/types'

interface PlanState {
  currentPlan: WeeklyPlan | null
  isLoading: boolean
  error: string | null

  setPlan: (plan: WeeklyPlan) => void
  updateTask: (date: string, task: Task) => void
  addTask: (date: string, task: Task) => void
  removeTask: (date: string, taskId: string) => void
  moveTask: (fromDate: string, toDate: string, taskId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearPlan: () => void
}

export const usePlanStore = create<PlanState>((set) => ({
  currentPlan: null,
  isLoading: false,
  error: null,

  setPlan: (plan) => set({ currentPlan: plan, error: null }),

  updateTask: (date, task) =>
    set((state) => {
      if (!state.currentPlan) return state
      const dailyPlan = state.currentPlan.dailyPlans[date]
      if (!dailyPlan) return state

      return {
        currentPlan: {
          ...state.currentPlan,
          dailyPlans: {
            ...state.currentPlan.dailyPlans,
            [date]: {
              ...dailyPlan,
              tasks: dailyPlan.tasks.map((t) => (t.id === task.id ? task : t)),
            },
          },
        },
      }
    }),

  addTask: (date, task) =>
    set((state) => {
      if (!state.currentPlan) return state
      const dailyPlan = state.currentPlan.dailyPlans[date] || {
        date,
        dayOfWeek: 'MONDAY',
        tasks: [],
      }
      return {
        currentPlan: {
          ...state.currentPlan,
          dailyPlans: {
            ...state.currentPlan.dailyPlans,
            [date]: {
              ...dailyPlan,
              tasks: [...dailyPlan.tasks, task],
            },
          },
        },
      }
    }),

  removeTask: (date, taskId) =>
    set((state) => {
      if (!state.currentPlan) return state
      const dailyPlan = state.currentPlan.dailyPlans[date]
      if (!dailyPlan) return state

      return {
        currentPlan: {
          ...state.currentPlan,
          dailyPlans: {
            ...state.currentPlan.dailyPlans,
            [date]: {
              ...dailyPlan,
              tasks: dailyPlan.tasks.filter((t) => t.id !== taskId),
            },
          },
        },
      }
    }),

  moveTask: (fromDate, toDate, taskId) =>
    set((state) => {
      if (!state.currentPlan) return state
      const fromDailyPlan = state.currentPlan.dailyPlans[fromDate]
      if (!fromDailyPlan) return state

      const task = fromDailyPlan.tasks.find((t) => t.id === taskId)
      if (!task) return state

      const toDailyPlan = state.currentPlan.dailyPlans[toDate] || {
        date: toDate,
        dayOfWeek: 'MONDAY',
        tasks: [],
      }

      return {
        currentPlan: {
          ...state.currentPlan,
          dailyPlans: {
            ...state.currentPlan.dailyPlans,
            [fromDate]: {
              ...fromDailyPlan,
              tasks: fromDailyPlan.tasks.filter((t) => t.id !== taskId),
            },
            [toDate]: {
              ...toDailyPlan,
              tasks: [...toDailyPlan.tasks, task],
            },
          },
        },
      }
    }),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearPlan: () => set({ currentPlan: null, error: null }),
}))
