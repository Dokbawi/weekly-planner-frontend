import { useState } from 'react'
import { format, addDays, startOfWeek } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Task } from '@/types'
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
import { cn } from '@/lib/utils'

interface TaskMoveDialogProps {
  open: boolean
  onClose: () => void
  onMove: (targetDate: string, reason?: string) => void
  task: Task | null
  currentDate: string
}

export function TaskMoveDialog({
  open,
  onClose,
  onMove,
  task,
  currentDate,
}: TaskMoveDialogProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [reason, setReason] = useState('')

  const weekStart = startOfWeek(new Date(currentDate), { weekStartsOn: 1 })
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    return {
      date: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'E', { locale: ko }),
      dayNum: format(date, 'd'),
    }
  })

  const handleMove = () => {
    if (selectedDate) {
      onMove(selectedDate, reason || undefined)
      handleClose()
    }
  }

  const handleClose = () => {
    setSelectedDate(null)
    setReason('')
    onClose()
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>다른 날로 이동</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            "{task.title}"을 언제로 이동할까요?
          </p>

          <div className="grid grid-cols-7 gap-1">
            {weekDates.map((day) => (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDate(day.date)}
                disabled={day.date === currentDate}
                className={cn(
                  'flex flex-col items-center p-2 rounded-md text-sm transition-colors',
                  day.date === currentDate && 'opacity-50 cursor-not-allowed',
                  selectedDate === day.date
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100'
                )}
              >
                <span className="text-xs">{day.dayName}</span>
                <span className="font-medium">{day.dayNum}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">이동 사유 (선택)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="오늘 시간이 부족해서..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button type="button" onClick={handleMove} disabled={!selectedDate}>
            이동
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
