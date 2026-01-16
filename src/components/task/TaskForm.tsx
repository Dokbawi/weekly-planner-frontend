import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Task, Priority } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const taskSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요').max(200, '제목은 200자 이내로 입력하세요'),
  description: z.string().max(1000).optional(),
  scheduledTime: z.string().optional(),
  estimatedMinutes: z.coerce.number().min(0).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  reminderEnabled: z.boolean(),
  reminderMinutes: z.coerce.number().min(1).optional(),
  reason: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => void
  task?: Task
  isEdit?: boolean
}

export function TaskForm({ open, onClose, onSubmit, task, isEdit = false }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      scheduledTime: task?.scheduledTime || '',
      estimatedMinutes: task?.estimatedMinutes || undefined,
      priority: task?.priority || 'MEDIUM',
      reminderEnabled: task?.reminder?.enabled || false,
      reminderMinutes: task?.reminder?.minutesBefore || 10,
      reason: '',
    },
  })

  const reminderEnabled = watch('reminderEnabled')

  // task가 변경되면 폼 값을 업데이트 (수정 모드에서 기존 데이터 채우기)
  useEffect(() => {
    if (open) {
      reset({
        title: task?.title || '',
        description: task?.description || '',
        scheduledTime: task?.scheduledTime || '',
        estimatedMinutes: task?.estimatedMinutes || undefined,
        priority: task?.priority || 'MEDIUM',
        reminderEnabled: task?.reminder?.enabled || false,
        reminderMinutes: task?.reminder?.minutesBefore || 10,
        reason: '',
      })
    }
  }, [open, task, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data)
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? '할 일 수정' : '할 일 추가'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input id="title" {...register('title')} placeholder="할 일을 입력하세요" />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="상세 설명 (선택)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledTime">시간</Label>
              <Input id="scheduledTime" type="time" {...register('scheduledTime')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedMinutes">예상 소요 (분)</Label>
              <Input
                id="estimatedMinutes"
                type="number"
                min={0}
                {...register('estimatedMinutes')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>우선순위</Label>
            <Select
              value={watch('priority')}
              onValueChange={(value: Priority) => setValue('priority', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">낮음</SelectItem>
                <SelectItem value="MEDIUM">보통</SelectItem>
                <SelectItem value="HIGH">높음</SelectItem>
                <SelectItem value="URGENT">긴급</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="reminderEnabled"
                checked={reminderEnabled}
                onCheckedChange={(checked) => setValue('reminderEnabled', !!checked)}
              />
              <Label htmlFor="reminderEnabled">알림 활성화</Label>
            </div>
            {reminderEnabled && (
              <div className="flex items-center gap-2 pl-6">
                <Input
                  type="number"
                  min={1}
                  className="w-20"
                  {...register('reminderMinutes')}
                />
                <span className="text-sm text-gray-600">분 전</span>
              </div>
            )}
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label htmlFor="reason">변경 사유 (선택)</Label>
              <Input
                id="reason"
                {...register('reason')}
                placeholder="변경 사유를 입력하세요"
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? '저장' : '추가'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
