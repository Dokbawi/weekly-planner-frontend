import { CommuteRoutine, StepType } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MapPin, Pencil, Trash2, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RoutineCardProps {
  routine: CommuteRoutine
  isSelected?: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
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

export function RoutineCard({
  routine,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: RoutineCardProps) {
  const totalMinutes = routine.steps.reduce((sum, s) => sum + s.durationMinutes, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-blue-500 bg-blue-50'
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{routine.name}</CardTitle>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('정말 삭제하시겠습니까?')) {
                  onDelete()
                }
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {routine.destination && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{routine.destination}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>
            총 소요 시간: {hours > 0 && `${hours}시간 `}
            {minutes}분
          </span>
        </div>

        {routine.defaultArrivalTime && (
          <div className="text-sm text-gray-500">
            기본 도착: {routine.defaultArrivalTime}
          </div>
        )}

        {/* 단계 미리보기 */}
        <div className="flex flex-wrap gap-1 pt-2">
          {routine.steps.slice(0, 5).map((step) => (
            <span
              key={step.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"
              title={`${step.label} (${step.durationMinutes}분)`}
            >
              {stepTypeIcons[step.type]} {step.durationMinutes}분
            </span>
          ))}
          {routine.steps.length > 5 && (
            <span className="px-2 py-1 text-xs text-gray-500">
              +{routine.steps.length - 5}개
            </span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <Play className="h-4 w-4 mr-2" />
          시간 계산하기
        </Button>
      </CardContent>
    </Card>
  )
}
