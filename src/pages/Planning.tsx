import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Check, FileText, Save } from 'lucide-react'
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
import { WeeklyTemplate, ApplyMode } from '@/types/template'
import { TemplateApplyDialog, SaveAsTemplateDialog } from '@/components/template'
import { templateApi } from '@/api/templates'
import { useTemplateStore } from '@/stores/templateStore'
import { useToast } from '@/hooks/useToast'

export default function Planning() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [movingTask, setMovingTask] = useState<Task | null>(null)
  const [isApplyOpen, setIsApplyOpen] = useState(false)
  const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false)
  const [applyingTemplate, setApplyingTemplate] = useState<WeeklyTemplate | null>(null)
  const [isTemplateLoading, setIsTemplateLoading] = useState(false)
  const { templates, setTemplates } = useTemplateStore()
  const { currentPlan, setPlan, isLoading, setLoading } = usePlanStore()
  const { toast } = useToast()

  useEffect(() => {
    loadPlan()
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const response: any = await templateApi.getList()
      const data = response?.data || response
      setTemplates(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  const handleApplyTemplate = async (templateId: string, mode: ApplyMode) => {
    if (!currentPlan) return
    setIsTemplateLoading(true)
    try {
      await templateApi.applyTemplate(currentPlan.id, templateId, mode)
      await loadPlan()
      setIsApplyOpen(false)
      setApplyingTemplate(null)
      toast({ title: '템플릿이 적용되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '템플릿 적용 실패' })
    } finally {
      setIsTemplateLoading(false)
    }
  }

  const handleSaveAsTemplate = async (name: string, description?: string) => {
    if (!currentPlan) return
    setIsTemplateLoading(true)
    try {
      await templateApi.fromPlan(currentPlan.id, { name, description })
      setIsSaveTemplateOpen(false)
      toast({ title: '템플릿으로 저장되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '템플릿 저장 실패' })
    } finally {
      setIsTemplateLoading(false)
    }
  }

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
    if (!selectedDate) return
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
      await taskApi.create(planId, selectedDate, request)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  // 계획이 없는 경우 빈 상태 표시
  if (!currentPlan) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">주간 계획</h1>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-gray-500 mb-4">아직 이번 주 계획이 없습니다.</p>
          <Button onClick={async () => {
            try {
              const response = await planApi.getOrCreateCurrent()
              setPlan(response.data)
              toast({ title: '주간 계획이 생성되었습니다' })
            } catch (error) {
              console.error(error)
              toast({ variant: 'destructive', title: '계획 생성 실패' })
            }
          }}>
            주간 계획 시작하기
          </Button>
        </div>
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
              {currentPlan.weekStartDate &&
                format(parseISO(currentPlan.weekStartDate), 'yyyy년 M월 d일', {
                  locale: ko,
                })}{' '}
              ~{' '}
              {currentPlan.weekEndDate ?
                format(parseISO(currentPlan.weekEndDate), 'M월 d일', { locale: ko }) :
                (() => {
                  const endDate = new Date(currentPlan.weekStartDate)
                  endDate.setDate(endDate.getDate() + 6)
                  return format(endDate, 'M월 d일', { locale: ko })
                })()}
            </h1>
            <PlanStatusBadge status={currentPlan.status} />
          </div>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex gap-2">
          {currentPlan.status === 'DRAFT' && templates.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setApplyingTemplate(templates[0])
                setIsApplyOpen(true)
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              템플릿 적용
            </Button>
          )}
          <Button variant="outline" onClick={() => setIsSaveTemplateOpen(true)}>
            <Save className="h-4 w-4 mr-2" />
            템플릿 저장
          </Button>
          {currentPlan.status === 'DRAFT' && (
            <Button onClick={() => setIsConfirmOpen(true)}>
              <Check className="h-4 w-4 mr-2" />
              확정하기
            </Button>
          )}
        </div>
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
              // estimatedMinutes는 백엔드에서 지원하지 않음
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

      {/* 템플릿 적용 다이얼로그 */}
      <TemplateApplyDialog
        open={isApplyOpen}
        onClose={() => {
          setIsApplyOpen(false)
          setApplyingTemplate(null)
        }}
        onApply={handleApplyTemplate}
        template={applyingTemplate}
        isLoading={isTemplateLoading}
      />

      {/* 템플릿 저장 다이얼로그 */}
      <SaveAsTemplateDialog
        open={isSaveTemplateOpen}
        onClose={() => setIsSaveTemplateOpen(false)}
        onSave={handleSaveAsTemplate}
        isLoading={isTemplateLoading}
      />
    </div>
  )
}
