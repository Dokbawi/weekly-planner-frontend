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
  const { currentPlan, setPlan, updateTask, isLoading, setLoading } = usePlanStore()
  const { toast } = useToast()

  const dateStr = format(date, 'yyyy-MM-dd')
  const dailyPlan = currentPlan?.dailyPlans[dateStr]
  const tasks = dailyPlan?.tasks || []

  useEffect(() => {
    loadPlan()
  }, [])

  useEffect(() => {
    setMemo(dailyPlan?.memo || '')
  }, [dailyPlan, dateStr])

  const loadPlan = async () => {
    setLoading(true)
    try {
      const response = await planApi.getCurrent()
      // plan이 null일 수 있음 (계획이 없는 경우)
      if (response.data) {
        // 목록에서 가져온 plan은 dailyPlans가 없을 수 있으므로 상세 조회
        const detailResponse = await planApi.getById(response.data.id)
        if (detailResponse.data) {
          setPlan(detailResponse.data)
        } else {
          setPlan(response.data)
        }
      } else {
        setPlan(null)
      }
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '데이터 로드 실패' })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    if (!currentPlan || !currentPlan.id) return

    // Optimistic Update: 먼저 UI 업데이트
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      const updatedTask = {
        ...task,
        status,
        completedAt: status === 'COMPLETED' ? new Date().toISOString() : undefined,
      }
      updateTask(dateStr, updatedTask)
    }

    try {
      await taskApi.updateStatus(currentPlan.id, taskId, status)
      // 성공 시 별도 loadPlan 불필요 (이미 UI 업데이트됨)
    } catch (error) {
      console.error(error)
      // 실패 시 원래 상태로 롤백
      if (task) {
        updateTask(dateStr, task)
      }
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
    try {
      // 계획이 없으면 생성
      let planId = currentPlan?.id
      if (!planId) {
        const planResponse = await planApi.getOrCreateCurrent()
        planId = planResponse.data.id
        setPlan(planResponse.data)
      }

      const request = {
        title: data.title,
        description: data.description,
        scheduledTime: data.scheduledTime || undefined,
        // estimatedMinutes는 백엔드에서 지원하지 않음
        priority: data.priority as CreateTaskRequest['priority'],
        reminder: data.reminderEnabled
          ? { enabled: true, minutesBefore: data.reminderMinutes || 10 }
          : undefined,
      }
      await taskApi.create(planId, dateStr, request)
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
    if (!editingTask || !currentPlan || !currentPlan.id) {
      toast({ variant: 'destructive', title: '계획을 불러오는 중입니다. 잠시 후 다시 시도하세요.' })
      return
    }
    try {
      const request: UpdateTaskRequest = {
        title: data.title,
        description: data.description,
        scheduledTime: data.scheduledTime || undefined,
        // estimatedMinutes는 백엔드에서 지원하지 않음
        priority: data.priority as UpdateTaskRequest['priority'],
        reminder: data.reminderEnabled
          ? { enabled: true, minutesBefore: data.reminderMinutes || 10 }
          : undefined,
        reason: data.reason,
      }
      await taskApi.update(currentPlan.id, editingTask.id, request)
      setEditingTask(null)
      loadPlan()
      toast({ title: '수정되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '수정 실패' })
    }
  }

  const handleMoveTask = async (targetDate: string, reason?: string) => {
    if (!movingTask || !currentPlan || !currentPlan.id) return
    try {
      await taskApi.move(currentPlan.id, movingTask.id, targetDate, reason)
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
    if (!currentPlan || !currentPlan.id) return
    try {
      await taskApi.delete(currentPlan.id, taskId)
      loadPlan()
      toast({ title: '삭제되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '삭제 실패' })
    }
  }

  const handleMemoSave = async () => {
    if (!currentPlan) return
    // 빈 메모일 경우 저장하지 않음 (또는 삭제로 처리)
    if (!memo.trim()) {
      toast({ variant: 'destructive', title: '메모 내용을 입력하세요' })
      return
    }
    try {
      await planApi.updateMemo(currentPlan.id, { date: dateStr, memo })
      // 메모 저장 후 plan 다시 로드하여 UI 갱신
      await loadPlan()
      toast({ title: '메모가 저장되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '메모 저장 실패' })
    }
  }

  const handleReorder = async (taskIds: string[]) => {
    if (!currentPlan || !currentPlan.id) return
    try {
      await taskApi.reorder(currentPlan.id, dateStr, taskIds)
      loadPlan()
    } catch (error) {
      console.error(error)
      // 순서 변경 실패 시 조용히 무시 (백엔드 미지원 가능)
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
        onReorder={handleReorder}
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
