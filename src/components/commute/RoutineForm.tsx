import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CommuteRoutine, CommuteStep } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { StepEditor } from './StepEditor'

const routineSchema = z.object({
  name: z.string().min(1, '루틴명을 입력하세요').max(100),
  destination: z.string().max(100).optional(),
  defaultArrivalTime: z.string().optional(),
})

type RoutineFormData = z.infer<typeof routineSchema>

interface RoutineFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: RoutineFormData & { steps: CommuteStep[] }) => void
  routine?: CommuteRoutine
  isEdit?: boolean
}

export function RoutineForm({
  open,
  onClose,
  onSubmit,
  routine,
  isEdit = false,
}: RoutineFormProps) {
  const [steps, setSteps] = useState<CommuteStep[]>(routine?.steps || [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RoutineFormData>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      name: routine?.name || '',
      destination: routine?.destination || '',
      defaultArrivalTime: routine?.defaultArrivalTime || '',
    },
  })

  useEffect(() => {
    if (routine) {
      reset({
        name: routine.name,
        destination: routine.destination,
        defaultArrivalTime: routine.defaultArrivalTime,
      })
      setSteps(routine.steps)
    } else {
      reset({
        name: '',
        destination: '',
        defaultArrivalTime: '',
      })
      setSteps([])
    }
  }, [routine, reset])

  const handleClose = () => {
    reset()
    setSteps([])
    onClose()
  }

  const handleFormSubmit = (data: RoutineFormData) => {
    if (steps.length === 0) {
      alert('최소 하나의 단계를 추가해주세요')
      return
    }
    onSubmit({ ...data, steps })
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? '루틴 수정' : '새 루틴 추가'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">루틴명 *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="예: 출근 루틴"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">목적지</Label>
            <Input
              id="destination"
              {...register('destination')}
              placeholder="예: 회사"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultArrivalTime">기본 도착 시간</Label>
            <Input
              id="defaultArrivalTime"
              type="time"
              {...register('defaultArrivalTime')}
            />
            <p className="text-xs text-gray-500">
              계산 시 기본값으로 사용됩니다
            </p>
          </div>

          <StepEditor steps={steps} onChange={setSteps} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting || steps.length === 0}>
              {isEdit ? '저장' : '추가'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
