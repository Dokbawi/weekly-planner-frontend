import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WeekCalendar } from '@/components/plan/WeekCalendar'
import { PlanStatusBadge } from '@/components/plan/PlanStatusBadge'
import { ConfirmDialog } from '@/components/plan/ConfirmDialog'
import { TaskForm } from '@/components/task/TaskForm'
import { TaskMoveDialog } from '@/components/task/TaskMoveDialog'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { usePlanStore } from '@/stores/planStore'
import { planApi } from '@/api/plans'
import { taskApi } from '@/api/tasks'
import { Task, TaskStatus, CreateTaskRequest } from '@/types'
import { useToast } from '@/hooks/useToast'

export default function Planning() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [movingTask, setMovingTask] = useState<Task | null>(null)
  const { currentPlan, setPlan, isLoading, setLoading } = usePlanStore()
  const { toast } = useToast()

  useEffect(() => {
    loadPlan()
  }, [])

  const loadPlan = async () => {
    setLoading(true)
    try {
      const response = await planApi.getCurrent()
      setPlan(response.data)
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '데이터 로드 실패' })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    if (!currentPlan) return
    setIsConfirming(true)
    try {
      await planApi.confirm(currentPlan.id)
      await loadPlan()
      setIsConfirmOpen(false)
      toast({ title: '계획이 확정되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '확정 실패' })
    } finally {
      setIsConfirming(false)
    }
  }

  const handleTaskMove = async (taskId: string, _fromDate: string, toDate: string) => {
    if (!currentPlan) return
    try {
      await taskApi.move(currentPlan.id, taskId, toDate)
      loadPlan()
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '이동 실패' })
    }
  }

  const handleAddTask = async (data: {
    title: string
    description?: string
    scheduledTime?: string
    estimatedMinutes?: number
    priority: string
    reminderEnabled: boolean
    reminderMinutes?: number
  }) => {
    if (!currentPlan || !selectedDate) return
    try {
      const request = {
        title: data.title,
        description: data.description,
        scheduledTime: data.scheduledTime || undefined,
        estimatedMinutes: data.estimatedMinutes,
        priority: data.priority as CreateTaskRequest['priority'],
        reminder: data.reminderEnabled
          ? { enabled: true, minutesBefore: data.reminderMinutes || 10 }
          : undefined,
      }
      await taskApi.create(currentPlan.id, selectedDate, request)
      setIsFormOpen(false)
      setSelectedDate(null)
      loadPlan()
      toast({ title: '할 일이 추가되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '추가 실패' })
    }
  }

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    if (!currentPlan) return
    try {
      await taskApi.updateStatus(currentPlan.id, taskId, status)
      loadPlan()
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '상태 변경 실패' })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    if (!currentPlan) return
    try {
      await taskApi.delete(currentPlan.id, taskId)
      loadPlan()
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '삭제 실패' })
    }
  }

  const handleMoveTaskDialog = async (targetDate: string, reason?: string) => {
    if (!movingTask || !currentPlan) return
    try {
      await taskApi.move(currentPlan.id, movingTask.id, targetDate, reason)
      setMovingTask(null)
      loadPlan()
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '이동 실패' })
    }
  }

  if (isLoading || !currentPlan) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  const totalTasks = Object.values(currentPlan.dailyPlans).reduce(
    (sum, dp) => sum + dp.tasks.length,
    0
  )

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">
              {format(parseISO(currentPlan.weekStartDate), 'yyyy년 M월 d일', {
                locale: ko,
              })}{' '}
              ~ {format(parseISO(currentPlan.weekEndDate), 'M월 d일', { locale: ko })}
            </h1>
            <PlanStatusBadge status={currentPlan.status} />
          </div>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {currentPlan.status === 'DRAFT' && (
          <Button onClick={() => setIsConfirmOpen(true)}>
            <Check className="h-4 w-4 mr-2" />
            확정하기
          </Button>
        )}
      </div>

      {/* 주간 캘린더 */}
      <WeekCalendar
        plan={currentPlan}
        onTaskMove={handleTaskMove}
        onAddTask={(date) => {
          setSelectedDate(date)
          setIsFormOpen(true)
        }}
        onStatusChange={handleStatusChange}
        onEditTask={setEditingTask}
        onMoveTask={setMovingTask}
        onDeleteTask={handleDeleteTask}
      />

      {/* 확정 다이얼로그 */}
      <ConfirmDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        taskCount={totalTasks}
        isLoading={isConfirming}
      />

      {/* 추가 폼 */}
      <TaskForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedDate(null)
        }}
        onSubmit={handleAddTask}
      />

      {/* 수정 폼 */}
      <TaskForm
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={async (data) => {
          if (!editingTask || !currentPlan) return
          try {
            await taskApi.update(currentPlan.id, editingTask.id, {
              title: data.title,
              description: data.description,
              scheduledTime: data.scheduledTime,
              estimatedMinutes: data.estimatedMinutes,
              priority: data.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
              reason: data.reason,
            })
            setEditingTask(null)
            loadPlan()
          } catch (error) {
            console.error(error)
          }
        }}
        task={editingTask || undefined}
        isEdit
      />

      {/* 이동 다이얼로그 */}
      <TaskMoveDialog
        open={!!movingTask}
        onClose={() => setMovingTask(null)}
        onMove={handleMoveTaskDialog}
        task={movingTask}
        currentDate={currentPlan.weekStartDate}
      />
    </div>
  )
}
