import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CommuteRoutine, CalculateResponse, ScheduleStep, StepType } from '@/types'

interface CommuteState {
  routines: CommuteRoutine[]
  selectedRoutine: CommuteRoutine | null
  calculatedSchedule: CalculateResponse | null
  isLoading: boolean

  // Actions
  setRoutines: (routines: CommuteRoutine[]) => void
  addRoutine: (routine: CommuteRoutine) => void
  updateRoutine: (routineId: string, routine: Partial<CommuteRoutine>) => void
  deleteRoutine: (routineId: string) => void
  selectRoutine: (routine: CommuteRoutine | null) => void
  setCalculatedSchedule: (schedule: CalculateResponse | null) => void
  setLoading: (loading: boolean) => void

  // Local calculation (without backend)
  calculateScheduleLocal: (routineId: string, arrivalTime: string, offsetMinutes: number) => CalculateResponse | null
}

// Helper to generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Parse time string "HH:mm" to minutes from midnight
const parseTime = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Format minutes from midnight to "HH:mm"
const formatTime = (minutes: number): string => {
  const normalizedMinutes = ((minutes % 1440) + 1440) % 1440 // Handle negative and overflow
  const hours = Math.floor(normalizedMinutes / 60)
  const mins = normalizedMinutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

export const useCommuteStore = create<CommuteState>()(
  persist(
    (set, get) => ({
      routines: [],
      selectedRoutine: null,
      calculatedSchedule: null,
      isLoading: false,

      setRoutines: (routines) => set({ routines }),

      addRoutine: (routine) =>
        set((state) => ({
          routines: [...state.routines, { ...routine, id: generateId() }],
        })),

      updateRoutine: (routineId, updates) =>
        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === routineId ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
          ),
        })),

      deleteRoutine: (routineId) =>
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== routineId),
          selectedRoutine: state.selectedRoutine?.id === routineId ? null : state.selectedRoutine,
        })),

      selectRoutine: (routine) => set({ selectedRoutine: routine }),

      setCalculatedSchedule: (schedule) => set({ calculatedSchedule: schedule }),

      setLoading: (loading) => set({ isLoading: loading }),

      calculateScheduleLocal: (routineId, arrivalTime, offsetMinutes) => {
        const routine = get().routines.find((r) => r.id === routineId)
        if (!routine) return null

        // Calculate adjusted arrival time
        const arrivalMinutes = parseTime(arrivalTime) + offsetMinutes
        const adjustedArrivalTime = formatTime(arrivalMinutes)

        // Sort steps by order
        const sortedSteps = [...routine.steps].sort((a, b) => a.order - b.order)

        // Calculate total duration
        const totalMinutes = sortedSteps.reduce((sum, step) => sum + step.durationMinutes, 0)

        // Calculate departure time
        const departureMinutes = arrivalMinutes - totalMinutes
        const departureTime = formatTime(departureMinutes)

        // Calculate each step's start and end time (backward from arrival)
        let currentMinutes = arrivalMinutes
        const schedule: ScheduleStep[] = []

        // Process steps in reverse order to calculate times
        for (let i = sortedSteps.length - 1; i >= 0; i--) {
          const step = sortedSteps[i]
          const endMinutes = currentMinutes
          const startMinutes = endMinutes - step.durationMinutes

          schedule.unshift({
            stepId: step.id,
            label: step.label,
            type: step.type as StepType,
            startTime: formatTime(startMinutes),
            endTime: formatTime(endMinutes),
            durationMinutes: step.durationMinutes,
          })

          currentMinutes = startMinutes
        }

        const result: CalculateResponse = {
          routineId,
          arrivalTime: adjustedArrivalTime,
          offsetMinutes,
          schedule,
          departureTime,
          totalMinutes,
        }

        set({ calculatedSchedule: result })
        return result
      },
    }),
    {
      name: 'commute-storage',
      partialize: (state) => ({ routines: state.routines }),
    }
  )
)
