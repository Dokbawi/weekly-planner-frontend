import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task, TaskStatus } from '@/types'
import { TaskItem } from './TaskItem'
import { EmptyState } from '@/components/common/EmptyState'

interface TaskListProps {
  tasks: Task[]
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onEdit: (task: Task) => void
  onMove: (task: Task) => void
  onDelete: (taskId: string) => void
  onReorder?: (taskIds: string[]) => void
}

function SortableTaskItem({
  task,
  onStatusChange,
  onEdit,
  onMove,
  onDelete,
}: {
  task: Task
  onStatusChange: (status: TaskStatus) => void
  onEdit: () => void
  onMove: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <TaskItem
        task={task}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
        onMove={onMove}
        onDelete={onDelete}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

export function TaskList({
  tasks,
  onStatusChange,
  onEdit,
  onMove,
  onDelete,
  onReorder,
}: TaskListProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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

  const handleDragStart = (event: DragStartEvent) => {
    const task = sortedTasks.find((t) => t.id === event.active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over || active.id === over.id) return

    const oldIndex = sortedTasks.findIndex((t) => t.id === active.id)
    const newIndex = sortedTasks.findIndex((t) => t.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1 && onReorder) {
      const newOrder = [...sortedTasks]
      const [removed] = newOrder.splice(oldIndex, 1)
      newOrder.splice(newIndex, 0, removed)
      onReorder(newOrder.map((t) => t.id))
    }
  }

  if (tasks.length === 0) {
    return <EmptyState message="할 일이 없습니다" description="새로운 할 일을 추가해보세요" />
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {sortedTasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              onStatusChange={(status) => onStatusChange(task.id, status)}
              onEdit={() => onEdit(task)}
              onMove={() => onMove(task)}
              onDelete={() => onDelete(task.id)}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeTask && (
          <TaskItem
            task={activeTask}
            isDragging
            onStatusChange={() => {}}
            onEdit={() => {}}
            onMove={() => {}}
            onDelete={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}
