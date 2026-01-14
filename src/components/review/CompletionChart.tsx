import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { DailyStatistics } from '@/types'

interface CompletionChartProps {
  dailyBreakdown: Record<string, DailyStatistics>
}

export function CompletionChart({ dailyBreakdown }: CompletionChartProps) {
  if (!dailyBreakdown || Object.keys(dailyBreakdown).length === 0) {
    return <div className="text-center text-gray-500 py-8">데이터가 없습니다</div>
  }

  const data = Object.entries(dailyBreakdown)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, stats]) => ({
      date: format(parseISO(date), 'E', { locale: ko }),
      completionRate: Math.round(stats?.completionRate || 0),
      planned: stats?.planned || 0,
      completed: stats?.completed || 0,
    }))

  const getBarColor = (rate: number) => {
    if (rate >= 80) return '#10b981'
    if (rate >= 60) return '#3b82f6'
    if (rate >= 40) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="date" fontSize={12} />
        <YAxis domain={[0, 100]} fontSize={12} tickFormatter={(v) => `${v}%`} />
        <Tooltip
          formatter={(value: number) => [`${value}%`, '완료율']}
        />
        <Bar dataKey="completionRate" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.completionRate)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
