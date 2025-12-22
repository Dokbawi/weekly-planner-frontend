export type StepType = 'prepare' | 'walk' | 'bus' | 'subway' | 'taxi' | 'car' | 'bike' | 'other'

export interface CommuteStep {
  id: string
  label: string
  durationMinutes: number
  type: StepType
  order: number
}

export interface CommuteRoutine {
  id: string
  name: string
  destination: string
  steps: CommuteStep[]
  totalMinutes: number
  defaultArrivalTime?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCommuteRoutineRequest {
  name: string
  destination: string
  steps: Omit<CommuteStep, 'id' | 'order'>[]
  defaultArrivalTime?: string
}

export interface UpdateCommuteRoutineRequest {
  name?: string
  destination?: string
  steps?: Omit<CommuteStep, 'id' | 'order'>[]
  defaultArrivalTime?: string
}

export interface CalculateRequest {
  arrivalTime: string
  offsetMinutes: number
}

export interface ScheduleStep {
  stepId: string
  label: string
  type: StepType
  startTime: string
  endTime: string
  durationMinutes: number
}

export interface CalculateResponse {
  routineId: string
  arrivalTime: string
  offsetMinutes: number
  schedule: ScheduleStep[]
  departureTime: string
  totalMinutes: number
}

export interface AddToTasksRequest {
  arrivalTime: string
  offsetMinutes: number
  date: string
  stepsToAdd: string[]
}

export const STEP_TYPE_LABELS: Record<StepType, string> = {
  prepare: '준비',
  walk: '도보',
  bus: '버스',
  subway: '지하철',
  taxi: '택시',
  car: '자가용',
  bike: '자전거',
  other: '기타',
}

export const STEP_TYPE_ICONS: Record<StepType, string> = {
  prepare: '⏰',
  walk: '🚶',
  bus: '🚌',
  subway: '🚇',
  taxi: '🚕',
  car: '🚗',
  bike: '🚴',
  other: '📍',
}
