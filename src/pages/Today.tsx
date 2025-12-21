import { useEffect, useState } from 'react'
import { format, addDays, subDays } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { TaskList } from '@/components/task/TaskList'
import { TaskForm } from '@/components/task/TaskForm'
import { TaskMoveDialog } from '@/components/task/TaskMoveDialog'
import { PlanStatusBadge } from '@/components/plan/PlanStatusBadge'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { usePlanStore } from '@/stores/planStore'
import { planApi } from '@/api/plans'
import { taskApi } from '@/api/tasks'
import { Task, TaskStatus, CreateTaskRequest, UpdateTaskRequest } from '@/types'
import { useToast } from '@/hooks/useToast'

export default function Today() {
  const [date, setDate] = useState(new Date())
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [movingTask, setMovingTask] = useState<Task | null>(null)
  const [memo, setMemo] = useState('')
  const { currentPlan, setPlan, isLoading, setLoading } = usePlanStore()
  const { toast } = useToast()

  const dateStr = format(date, 'yyyy-MM-dd')
  const dailyPlan = currentPlan?.dailyPlans[dateStr]
  const tasks = dailyPlan?.tasks || []

  useEffect(() => {
    loadPlan()
  }, [])

  useEffect(() => {
    setMemo(dailyPlan?.memo || '')
  }, [dailyPlan])

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

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await taskApi.updateStatus(taskId, status)
      loadPlan()
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '상태 변경 실패' })
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
    if (!currentPlan) return
    try {
      const request: CreateTaskRequest = {
        date: dateStr,
        title: data.title,
        description: data.description,
        scheduledTime: data.scheduledTime || undefined,
        estimatedMinutes: data.estimatedMinutes,
        priority: data.priority as CreateTaskRequest['priority'],
        reminder: data.reminderEnabled
          ? { enabled: true, minutesBefore: data.reminderMinutes || 10 }
          : undefined,
      }
      await taskApi.create(currentPlan.id, request)
      setIsFormOpen(false)
      loadPlan()
      toast({ title: '할 일이 추가되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '추가 실패' })
    }
  }

  const handleEditTask = async (data: {
    title: string
    description?: string
    scheduledTime?: string
    estimatedMinutes?: number
    priority: string
    reminderEnabled: boolean
    reminderMinutes?: number
    reason?: string
  }) => {
    if (!editingTask) return
    try {
      const request: UpdateTaskRequest = {
        title: data.title,
        description: data.description,
        scheduledTime: data.scheduledTime || undefined,
        estimatedMinutes: data.estimatedMinutes,
        priority: data.priority as UpdateTaskRequest['priority'],
        reminder: data.reminderEnabled
          ? { enabled: true, minutesBefore: data.reminderMinutes || 10 }
          : undefined,
        reason: data.reason,
      }
      await taskApi.update(editingTask.id, request)
      setEditingTask(null)
      loadPlan()
      toast({ title: '수정되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '수정 실패' })
    }
  }

  const handleMoveTask = async (targetDate: string, reason?: string) => {
    if (!movingTask) return
    try {
      await taskApi.move(movingTask.id, targetDate, reason)
      setMovingTask(null)
      loadPlan()
      toast({ title: '이동되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '이동 실패' })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await taskApi.delete(taskId)
      loadPlan()
      toast({ title: '삭제되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '삭제 실패' })
    }
  }

  const handleMemoSave = async () => {
    if (!currentPlan) return
    try {
      await planApi.updateMemo(currentPlan.id, { date: dateStr, memo })
      toast({ title: '메모가 저장되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '메모 저장 실패' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 날짜 헤더 */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setDate((d) => subDays(d, 1))}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {format(date, 'M월 d일 (E)', { locale: ko })}
          </h1>
          {currentPlan && <PlanStatusBadge status={currentPlan.status} />}
        </div>
        <Button variant="ghost" size="icon" onClick={() => setDate((d) => addDays(d, 1))}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Task 목록 */}
      <TaskList
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onEdit={setEditingTask}
        onMove={setMovingTask}
        onDelete={handleDeleteTask}
      />

      {/* 추가 버튼 */}
      <Button onClick={() => setIsFormOpen(true)} className="w-full" variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        할 일 추가
      </Button>

      {/* 일일 메모 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">오늘의 메모</label>
        <Textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="오늘의 메모를 입력하세요..."
          rows={3}
        />
        <Button variant="outline" size="sm" onClick={handleMemoSave}>
          메모 저장
        </Button>
      </div>

      {/* 추가 폼 */}
      <TaskForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTask}
      />

      {/* 수정 폼 */}
      <TaskForm
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleEditTask}
        task={editingTask || undefined}
        isEdit
      />

      {/* 이동 다이얼로그 */}
      <TaskMoveDialog
        open={!!movingTask}
        onClose={() => setMovingTask(null)}
        onMove={handleMoveTask}
        task={movingTask}
        currentDate={dateStr}
      />
    </div>
  )
}
