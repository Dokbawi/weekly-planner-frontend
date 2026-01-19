import { useDroppable, useDraggable } from '@dnd-kit/core'
import { format, parseISO, isToday } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Plus, GripVertical } from 'lucide-react'
import { DailyPlan, Task, TaskStatus } from '@/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

// 주간 계획 전용 컴팩트 Task 아이템
function CompactTaskItem({
  task,
  onStatusChange,
  onEdit,
}: {
  task: Task
  onStatusChange: (status: TaskStatus) => void
  onEdit: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  const isCompleted = task.status === 'COMPLETED'
  const isPostponed = task.status === 'POSTPONED'

  // POSTPONED 상태인 Task는 숨김 처리 (다른 날로 이동된 Task)
  if (isPostponed) {
    return null
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-1 p-1.5 bg-gray-50 rounded border text-xs',
        isCompleted && 'opacity-50',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab touch-none flex-shrink-0">
        <GripVertical className="h-3 w-3 text-gray-400" />
      </div>
      <Checkbox
        checked={isCompleted}
        onCheckedChange={(checked) => onStatusChange(checked ? 'COMPLETED' : 'PENDING')}
        className="h-3 w-3 flex-shrink-0"
      />
      <span
        className={cn(
          'flex-1 min-w-0 truncate cursor-pointer hover:text-primary',
          isCompleted && 'line-through text-gray-400'
        )}
        onClick={onEdit}
        title={task.title}
      >
        {task.title}
      </span>
    </div>
  )
}

interface DayColumnProps {
  date: string
  dailyPlan?: DailyPlan
  onAddTask: (date: string) => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onEditTask: (task: Task) => void
  onMoveTask?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
}

export function DayColumn({
  date,
  dailyPlan,
  onAddTask,
  onStatusChange,
  onEditTask,
}: DayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: date })
  const parsedDate = parseISO(date)
  const allTasks = dailyPlan?.tasks || []
  // POSTPONED 상태 Task 제외 (다른 날로 이동된 Task)
  const tasks = allTasks.filter((t) => t.status !== 'POSTPONED')
  const isCurrentDay = isToday(parsedDate)

  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length
  const totalCount = tasks.length

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col min-h-[300px] bg-white rounded-lg border p-2 transition-colors',
        isOver && 'ring-2 ring-primary bg-primary/5',
        isCurrentDay && 'border-primary'
      )}
    >
      <div className="mb-2 text-center">
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

      <div className="flex-1 space-y-1 overflow-y-auto">
        {tasks.map((task) => (
          <CompactTaskItem
            key={task.id}
            task={task}
            onStatusChange={(status) => onStatusChange(task.id, status)}
            onEdit={() => onEditTask(task)}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-2 w-full text-gray-500 h-7 text-xs"
        onClick={() => onAddTask(date)}
      >
        <Plus className="h-3 w-3 mr-1" />
        추가
      </Button>
    </div>
  )
}
