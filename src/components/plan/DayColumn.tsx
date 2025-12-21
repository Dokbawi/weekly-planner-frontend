import { useDroppable } from '@dnd-kit/core'
import { format, parseISO, isToday } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import { DailyPlan, Task, TaskStatus } from '@/types'
import { TaskItem } from '@/components/task/TaskItem'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DayColumnProps {
  date: string
  dailyPlan?: DailyPlan
  onAddTask: (date: string) => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onEditTask: (task: Task) => void
  onMoveTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export function DayColumn({
  date,
  dailyPlan,
  onAddTask,
  onStatusChange,
  onEditTask,
  onMoveTask,
  onDeleteTask,
}: DayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: date })
  const parsedDate = parseISO(date)
  const tasks = dailyPlan?.tasks || []
  const isCurrentDay = isToday(parsedDate)

  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length
  const totalCount = tasks.length

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col min-h-[300px] bg-white rounded-lg border p-3 transition-colors',
        isOver && 'ring-2 ring-primary bg-primary/5',
        isCurrentDay && 'border-primary'
      )}
    >
      <div className="mb-3 text-center">
        <p className="text-xs text-gray-500">{format(parsedDate, 'E', { locale: ko })}</p>
        <p
          className={cn(
            'text-lg font-medium',
            isCurrentDay && 'text-primary'
          )}
        >
          {format(parsedDate, 'd')}
        </p>
        {totalCount > 0 && (
          <p className="text-xs text-gray-400">
            {completedCount}/{totalCount}
          </p>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {tasks.map((task) => (
          <div key={task.id} className="text-xs">
            <TaskItem
              task={task}
              onStatusChange={(status) => onStatusChange(task.id, status)}
              onEdit={() => onEditTask(task)}
              onMove={() => onMoveTask(task)}
              onDelete={() => onDeleteTask(task.id)}
            />
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-2 w-full text-gray-500"
        onClick={() => onAddTask(date)}
      >
        <Plus className="h-4 w-4 mr-1" />
        추가
      </Button>
    </div>
  )
}
