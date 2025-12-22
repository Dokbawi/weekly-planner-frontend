import { useState, useEffect } from 'react'
import { CommuteRoutine } from '@/types'
import { useCommuteStore } from '@/stores/commuteStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScheduleDisplay } from './ScheduleDisplay'
import { Calculator, Plus, Minus, RotateCcw } from 'lucide-react'

interface TimeCalculatorProps {
  routine: CommuteRoutine
}

const presetOffsets = [
  { label: '-1시간', value: -60 },
  { label: '-30분', value: -30 },
  { label: '-15분', value: -15 },
  { label: '+15분', value: 15 },
  { label: '+30분', value: 30 },
  { label: '+1시간', value: 60 },
]

export function TimeCalculator({ routine }: TimeCalculatorProps) {
  const { calculatedSchedule, calculateScheduleLocal } = useCommuteStore()
  const [arrivalTime, setArrivalTime] = useState(routine.defaultArrivalTime || '09:00')
  const [offsetMinutes, setOffsetMinutes] = useState(0)

  useEffect(() => {
    // 루틴이 바뀌면 기본값으로 리셋
    setArrivalTime(routine.defaultArrivalTime || '09:00')
    setOffsetMinutes(0)
  }, [routine.id, routine.defaultArrivalTime])

  const handleCalculate = () => {
    calculateScheduleLocal(routine.id, arrivalTime, offsetMinutes)
  }

  const handleOffsetChange = (delta: number) => {
    setOffsetMinutes((prev) => prev + delta)
  }

  const handleReset = () => {
    setOffsetMinutes(0)
    setArrivalTime(routine.defaultArrivalTime || '09:00')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            시간 계산
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 도착 시간 입력 */}
          <div className="space-y-2">
            <Label htmlFor="arrivalTime">도착 시간</Label>
            <Input
              id="arrivalTime"
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="text-lg"
            />
          </div>

          {/* 시간 오프셋 */}
          <div className="space-y-2">
            <Label>시간 조정</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOffsetChange(-15)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <span
                  className={`text-lg font-semibold ${
                    offsetMinutes > 0
                      ? 'text-orange-600'
                      : offsetMinutes < 0
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }`}
                >
                  {offsetMinutes > 0 ? '+' : ''}
                  {offsetMinutes}분
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOffsetChange(15)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 빠른 조정 버튼 */}
          <div className="flex flex-wrap gap-2">
            {presetOffsets.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                onClick={() => setOffsetMinutes(preset.value)}
                className={
                  offsetMinutes === preset.value
                    ? 'bg-blue-100 border-blue-300'
                    : ''
                }
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* 계산 버튼 */}
          <Button onClick={handleCalculate} className="w-full">
            <Calculator className="h-4 w-4 mr-2" />
            시간 계산하기
          </Button>
        </CardContent>
      </Card>

      {/* 계산 결과 */}
      {calculatedSchedule && calculatedSchedule.routineId === routine.id && (
        <ScheduleDisplay schedule={calculatedSchedule} routineName={routine.name} />
      )}
    </div>
  )
}
