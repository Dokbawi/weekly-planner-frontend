import { Task, TaskStatus } from '@/types'
import { TaskItem } from './TaskItem'
import { EmptyState } from '@/components/common/EmptyState'

interface TaskListProps {
  tasks: Task[]
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onEdit: (task: Task) => void
  onMove: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskList({
  tasks,
  onStatusChange,
  onEdit,
  onMove,
  onDelete,
}: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1
    if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1
    if (a.scheduledTime && b.scheduledTime) {
      return a.scheduledTime.localeCompare(b.scheduledTime)
    }
    if (a.scheduledTime) return -1
    if (b.scheduledTime) return 1
    return a.order - b.order
  })

  if (tasks.length === 0) {
    return <EmptyState message="할 일이 없습니다" description="새로운 할 일을 추가해보세요" />
  }

  return (
    <div className="space-y-2">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={(status) => onStatusChange(task.id, status)}
          onEdit={() => onEdit(task)}
          onMove={() => onMove(task)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  )
}
