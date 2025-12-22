import { CalculateResponse, StepType } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScheduleDisplayProps {
  schedule: CalculateResponse
  routineName: string
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

const stepTypeColors: Record<StepType, string> = {
  prepare: 'bg-yellow-100 border-yellow-300',
  walk: 'bg-green-100 border-green-300',
  bus: 'bg-blue-100 border-blue-300',
  subway: 'bg-purple-100 border-purple-300',
  taxi: 'bg-orange-100 border-orange-300',
  car: 'bg-red-100 border-red-300',
  bike: 'bg-teal-100 border-teal-300',
  other: 'bg-gray-100 border-gray-300',
}

export function ScheduleDisplay({ schedule, routineName }: ScheduleDisplayProps) {
  const hours = Math.floor(schedule.totalMinutes / 60)
  const minutes = schedule.totalMinutes % 60

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{routineName} 스케줄</span>
          {schedule.offsetMinutes !== 0 && (
            <span
              className={cn(
                'text-sm px-2 py-1 rounded',
                schedule.offsetMinutes > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
              )}
            >
              {schedule.offsetMinutes > 0 ? '+' : ''}{schedule.offsetMinutes}분 조정
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 핵심 시간 요약 */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-gray-600">출발 시간</div>
            <div className="text-2xl font-bold text-blue-600">
              {schedule.departureTime}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {hours > 0 && `${hours}h `}{minutes}m
              </span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">도착 시간</div>
            <div className="text-2xl font-bold text-green-600">
              {schedule.arrivalTime}
            </div>
          </div>
        </div>

        {/* 상세 스케줄 */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">상세 일정</h4>
          <div className="relative">
            {/* 타임라인 라인 */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

            {schedule.schedule.map((step) => (
              <div key={step.stepId} className="relative flex items-start gap-4 pb-4">
                {/* 타임라인 점 */}
                <div
                  className={cn(
                    'relative z-10 w-12 h-12 flex items-center justify-center rounded-full border-2 text-xl',
                    stepTypeColors[step.type]
                  )}
                >
                  {stepTypeIcons[step.type]}
                </div>

                {/* 내용 */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{step.label}</span>
                    <span className="text-sm text-gray-500">
                      {step.durationMinutes}분
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {step.startTime} - {step.endTime}
                  </div>
                </div>
              </div>
            ))}

            {/* 도착 */}
            <div className="relative flex items-start gap-4">
              <div className="relative z-10 w-12 h-12 flex items-center justify-center rounded-full border-2 bg-green-100 border-green-400 text-xl">
                🎯
              </div>
              <div className="flex-1 pt-2">
                <span className="font-medium text-green-700">도착</span>
                <div className="text-sm text-gray-600">{schedule.arrivalTime}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
