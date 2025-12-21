export type ChangeType =
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_DELETED'
  | 'STATUS_CHANGED'
  | 'TIME_CHANGED'
  | 'MOVED_TO_ANOTHER_DAY'
  | 'PRIORITY_CHANGED'

export interface FieldChange {
  field: string
  previousValue?: string
  newValue?: string
}

export interface ChangeLog {
  id: string
  targetDate: string
  taskId: string
  taskTitle: string
  changeType: ChangeType
  changes: FieldChange[]
  reason?: string
  changedAt: string
}
