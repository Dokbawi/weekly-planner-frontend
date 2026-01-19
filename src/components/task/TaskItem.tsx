import { Task, TaskStatus } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Bell, GripVertical, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskItemProps {
  task: Task
  onStatusChange: (status: TaskStatus) => void
  onEdit: () => void
  onMove: () => void
  onDelete: () => void
  isDragging?: boolean
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-600',
  HIGH: 'bg-orange-100 text-orange-600',
  URGENT: 'bg-red-100 text-red-600',
}

const priorityLabels = {
  LOW: '낮음',
  MEDIUM: '보통',
  HIGH: '높음',
  URGENT: '긴급',
}

export function TaskItem({
  task,
  onStatusChange,
  onEdit,
  onMove,
  onDelete,
  isDragging,
  dragHandleProps,
}: TaskItemProps) {
  const isCompleted = task.status === 'COMPLETED'
  const isPostponed = task.status === 'POSTPONED'
  const isCancelled = task.status === 'CANCELLED'
  const isInactive = isCompleted || isPostponed || isCancelled

  const handleCheckChange = (checked: boolean) => {
    onStatusChange(checked ? 'COMPLETED' : 'PENDING')
  }

  // POSTPONED 상태인 Task는 숨김 처리 (다른 날로 이동된 Task)
  if (isPostponed) {
    return null
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 bg-white rounded-lg border transition-all',
        isInactive && 'opacity-60',
        isDragging && 'shadow-lg ring-2 ring-primary/20'
      )}
    >
      <div {...dragHandleProps} className="cursor-grab touch-none">
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>

      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleCheckChange}
        disabled={task.status === 'CANCELLED'}
      />

      {task.scheduledTime && (
        <div className="flex items-center gap-1 text-sm text-gray-500 w-14">
          <Clock className="h-3 w-3" />
          {task.scheduledTime.substring(0, 5)}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium truncate',
            isCompleted && 'line-through text-gray-400'
          )}
        >
          {task.title}
        </p>
        {task.estimatedMinutes && (
          <p className="text-xs text-gray-400">{task.estimatedMinutes}분 예상</p>
        )}
      </div>

      {task.reminder?.enabled && <Bell className="h-4 w-4 text-gray-400" />}

      <Badge variant="outline" className={cn('text-xs', priorityColors[task.priority])}>
        {priorityLabels[task.priority]}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>수정</DropdownMenuItem>
          <DropdownMenuItem onClick={onMove}>다른 날로 이동</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onDelete} className="text-red-600">
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
