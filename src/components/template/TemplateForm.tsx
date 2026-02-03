import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { DayOfWeek } from '@/types'
import { WeeklyTemplate, TemplateDayPlan, TemplateTask } from '@/types/template'
import { Priority } from '@/types/task'

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'MONDAY', label: '월요일' },
  { key: 'TUESDAY', label: '화요일' },
  { key: 'WEDNESDAY', label: '수요일' },
  { key: 'THURSDAY', label: '목요일' },
  { key: 'FRIDAY', label: '금요일' },
  { key: 'SATURDAY', label: '토요일' },
  { key: 'SUNDAY', label: '일요일' },
]

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'LOW', label: '낮음' },
  { value: 'MEDIUM', label: '보통' },
  { value: 'HIGH', label: '높음' },
  { value: 'URGENT', label: '긴급' },
]

interface TemplateFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description?: string; dayPlans: TemplateDayPlan[] }) => void
  template?: WeeklyTemplate
  isLoading?: boolean
}

function createEmptyDayPlans(): TemplateDayPlan[] {
  return DAYS.map((d) => ({ dayOfWeek: d.key, tasks: [] }))
}

function createEmptyTask(): TemplateTask {
  return { title: '', priority: 'MEDIUM' }
}

export function TemplateForm({ open, onClose, onSubmit, template, isLoading }: TemplateFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [dayPlans, setDayPlans] = useState<TemplateDayPlan[]>(createEmptyDayPlans())

  useEffect(() => {
    if (template) {
      setName(template.name)
      setDescription(template.description || '')
      // Merge template dayPlans with all days
      const merged = DAYS.map((d) => {
        const existing = template.dayPlans.find((dp) => dp.dayOfWeek === d.key)
        return existing || { dayOfWeek: d.key, tasks: [] }
      })
      setDayPlans(merged)
    } else {
      setName('')
      setDescription('')
      setDayPlans(createEmptyDayPlans())
    }
  }, [template, open])

  const handleAddTask = (dayIndex: number) => {
    const updated = [...dayPlans]
    updated[dayIndex] = {
      ...updated[dayIndex],
      tasks: [...updated[dayIndex].tasks, createEmptyTask()],
    }
    setDayPlans(updated)
  }

  const handleRemoveTask = (dayIndex: number, taskIndex: number) => {
    const updated = [...dayPlans]
    updated[dayIndex] = {
      ...updated[dayIndex],
      tasks: updated[dayIndex].tasks.filter((_, i) => i !== taskIndex),
    }
    setDayPlans(updated)
  }

  const handleTaskChange = (
    dayIndex: number,
    taskIndex: number,
    field: keyof TemplateTask,
    value: string
  ) => {
    const updated = [...dayPlans]
    const tasks = [...updated[dayIndex].tasks]
    tasks[taskIndex] = { ...tasks[taskIndex], [field]: value }
    updated[dayIndex] = { ...updated[dayIndex], tasks }
    setDayPlans(updated)
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    // Filter out days with no tasks
    const filteredPlans = dayPlans.filter((dp) => dp.tasks.length > 0)
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      dayPlans: filteredPlans,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? '템플릿 수정' : '새 템플릿 만들기'}</DialogTitle>
          <DialogDescription>
            요일별 반복되는 할 일 패턴을 저장합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">이름 *</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 평일 기본 루틴"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-desc">설명</Label>
            <Textarea
              id="template-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="템플릿에 대한 설명 (선택)"
              rows={2}
            />
          </div>

          <Accordion type="multiple" className="w-full">
            {dayPlans.map((dp, dayIndex) => {
              const dayInfo = DAYS[dayIndex]
              return (
                <AccordionItem key={dp.dayOfWeek} value={dp.dayOfWeek}>
                  <AccordionTrigger className="text-sm">
                    {dayInfo.label}
                    {dp.tasks.length > 0 && (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {dp.tasks.length}
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pl-1">
                      {dp.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-start gap-2 rounded-lg border p-3">
                          <div className="flex-1 space-y-2">
                            <Input
                              value={task.title}
                              onChange={(e) =>
                                handleTaskChange(dayIndex, taskIndex, 'title', e.target.value)
                              }
                              placeholder="할 일 제목"
                              className="h-8 text-sm"
                            />
                            <div className="flex gap-2">
                              <Select
                                value={task.priority}
                                onValueChange={(v) =>
                                  handleTaskChange(dayIndex, taskIndex, 'priority', v)
                                }
                              >
                                <SelectTrigger className="h-8 w-28 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {PRIORITY_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                value={task.scheduledTime || ''}
                                onChange={(e) =>
                                  handleTaskChange(dayIndex, taskIndex, 'scheduledTime', e.target.value)
                                }
                                type="time"
                                className="h-8 w-32 text-xs"
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveTask(dayIndex, taskIndex)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleAddTask(dayIndex)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        할 일 추가
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || isLoading}>
            {isLoading ? '저장 중...' : template ? '수정' : '만들기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
