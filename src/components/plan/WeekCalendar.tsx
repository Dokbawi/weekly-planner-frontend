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
import { WeeklyPlan, Task, TaskStatus } from '@/types'
import { DayColumn } from './DayColumn'
import { TaskItem } from '@/components/task/TaskItem'
import { getWeekDates } from '@/lib/date'

interface WeekCalendarProps {
  plan: WeeklyPlan
  onTaskMove: (taskId: string, fromDate: string, toDate: string) => void
  onAddTask: (date: string) => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onEditTask: (task: Task) => void
  onMoveTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export function WeekCalendar({
  plan,
  onTaskMove,
  onAddTask,
  onStatusChange,
  onEditTask,
  onMoveTask,
  onDeleteTask,
}: WeekCalendarProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  )

  const weekDates = getWeekDates(plan.weekStartDate)

  const findTask = (taskId: string): { task: Task; date: string } | null => {
    for (const [date, dailyPlan] of Object.entries(plan.dailyPlans)) {
      const task = dailyPlan.tasks.find((t) => t.id === taskId)
      if (task) return { task, date }
    }
    return null
  }

  const handleDragStart = (event: DragStartEvent) => {
    const result = findTask(event.active.id as string)
    if (result) {
      setActiveTask(result.task)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const targetDate = over.id as string
    const result = findTask(taskId)

    if (!result || result.date === targetDate) return

    onTaskMove(taskId, result.date, targetDate)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date) => (
          <DayColumn
            key={date}
            date={date}
            dailyPlan={plan.dailyPlans[date]}
            onAddTask={onAddTask}
            onStatusChange={onStatusChange}
            onEditTask={onEditTask}
            onMoveTask={onMoveTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="w-48">
            <TaskItem
              task={activeTask}
              isDragging
              onStatusChange={() => {}}
              onEdit={() => {}}
              onMove={() => {}}
              onDelete={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
