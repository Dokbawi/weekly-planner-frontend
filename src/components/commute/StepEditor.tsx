import { useState } from 'react'
import { CommuteStep, StepType } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'

interface StepEditorProps {
  steps: CommuteStep[]
  onChange: (steps: CommuteStep[]) => void
}

const stepTypeLabels: Record<StepType, string> = {
  prepare: '준비',
  walk: '도보',
  bus: '버스',
  subway: '지하철',
  taxi: '택시',
  car: '자동차',
  bike: '자전거',
  other: '기타',
}

const stepTypeIcons: Record<StepType, string> = {
  prepare: '🏠',
  walk: '🚶',
  bus: '🚌',
  subway: '🚇',
  taxi: '🚕',
  car: '🚗',
  bike: '🚴',
  other: '📍',
}

const generateStepId = () => `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export function StepEditor({ steps, onChange }: StepEditorProps) {
  const [newLabel, setNewLabel] = useState('')
  const [newDuration, setNewDuration] = useState('')
  const [newType, setNewType] = useState<StepType>('prepare')

  const handleAddStep = () => {
    if (!newLabel.trim() || !newDuration) return

    const newStep: CommuteStep = {
      id: generateStepId(),
      label: newLabel.trim(),
      durationMinutes: parseInt(newDuration, 10),
      type: newType,
      order: steps.length,
    }

    onChange([...steps, newStep])
    setNewLabel('')
    setNewDuration('')
    setNewType('prepare')
  }

  const handleRemoveStep = (stepId: string) => {
    const filtered = steps.filter((s) => s.id !== stepId)
    onChange(filtered.map((s, idx) => ({ ...s, order: idx })))
  }

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return
    }

    const newSteps = [...steps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]
    onChange(newSteps.map((s, idx) => ({ ...s, order: idx })))
  }

  const handleUpdateStep = (stepId: string, updates: Partial<CommuteStep>) => {
    onChange(steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)))
  }

  return (
    <div className="space-y-4">
      <Label>루틴 단계</Label>

      {/* 기존 단계 목록 */}
      <div className="space-y-2">
        {steps.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4 border border-dashed rounded-lg">
            단계를 추가해주세요
          </p>
        ) : (
          steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={() => handleMoveStep(index, 'up')}
                  disabled={index === 0}
                >
                  ▲
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={() => handleMoveStep(index, 'down')}
                  disabled={index === steps.length - 1}
                >
                  ▼
                </Button>
              </div>

              <span className="text-xl">{stepTypeIcons[step.type]}</span>

              <div className="flex-1 grid grid-cols-3 gap-2">
                <Input
                  value={step.label}
                  onChange={(e) => handleUpdateStep(step.id, { label: e.target.value })}
                  placeholder="단계명"
                  className="col-span-1"
                />
                <Select
                  value={step.type}
                  onValueChange={(value: StepType) =>
                    handleUpdateStep(step.id, { type: value })
                  }
                >
                  <SelectTrigger className="col-span-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(stepTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {stepTypeIcons[value as StepType]} {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={1}
                    value={step.durationMinutes}
                    onChange={(e) =>
                      handleUpdateStep(step.id, {
                        durationMinutes: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-16"
                  />
                  <span className="text-sm text-gray-500">분</span>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveStep(step.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* 새 단계 추가 */}
      <div className="flex items-end gap-2 p-3 border rounded-lg bg-white">
        <div className="flex-1 space-y-1">
          <Label className="text-xs">단계명</Label>
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="예: 집에서 출발"
          />
        </div>
        <div className="w-32 space-y-1">
          <Label className="text-xs">유형</Label>
          <Select value={newType} onValueChange={(value: StepType) => setNewType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(stepTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {stepTypeIcons[value as StepType]} {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-20 space-y-1">
          <Label className="text-xs">소요(분)</Label>
          <Input
            type="number"
            min={1}
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
            placeholder="분"
          />
        </div>
        <Button
          type="button"
          onClick={handleAddStep}
          disabled={!newLabel.trim() || !newDuration}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* 총 소요 시간 */}
      {steps.length > 0 && (
        <div className="text-right text-sm text-gray-600">
          총 소요 시간:{' '}
          <span className="font-semibold">
            {steps.reduce((sum, s) => sum + s.durationMinutes, 0)}분
          </span>
        </div>
      )}
    </div>
  )
}
