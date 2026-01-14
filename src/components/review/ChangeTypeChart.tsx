import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ChangeType } from '@/types'

interface ChangeTypeChartProps {
  changesByType: Record<ChangeType, number>
}

const changeTypeLabels: Record<ChangeType, string> = {
  STATUS_CHANGED: '상태 변경',
  TIME_CHANGED: '시간 변경',
  MOVED_TO_ANOTHER_DAY: '날짜 이동',
  TASK_CREATED: '추가',
  TASK_UPDATED: '수정',
  TASK_DELETED: '삭제',
  PRIORITY_CHANGED: '우선순위',
}

const changeTypeColors: Record<ChangeType, string> = {
  STATUS_CHANGED: '#3b82f6',
  TIME_CHANGED: '#f59e0b',
  MOVED_TO_ANOTHER_DAY: '#8b5cf6',
  TASK_CREATED: '#10b981',
  TASK_UPDATED: '#6366f1',
  TASK_DELETED: '#ef4444',
  PRIORITY_CHANGED: '#ec4899',
}

export function ChangeTypeChart({ changesByType }: ChangeTypeChartProps) {
  if (!changesByType || Object.keys(changesByType).length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-500">
        변경 이력이 없습니다
      </div>
    )
  }

  const data = Object.entries(changesByType)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => ({
      type: changeTypeLabels[type as ChangeType] || type,
      count,
      fill: changeTypeColors[type as ChangeType] || '#6b7280',
    }))
    .sort((a, b) => b.count - a.count)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-500">
        변경 이력이 없습니다
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" fontSize={12} />
        <YAxis type="category" dataKey="type" fontSize={12} width={80} />
        <Tooltip formatter={(value: number) => [`${value}회`, '횟수']} />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
