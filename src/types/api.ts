export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
  }
}

export interface PaginatedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface TodayResponse {
  date: string
  dayOfWeek: string
  planId: string
  planStatus: string
  tasks: import('./task').Task[]
  memo?: string
  statistics: {
    total: number
    completed: number
    remaining: number
  }
}
