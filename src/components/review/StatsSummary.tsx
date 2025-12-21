import { ReviewStatistics } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle, ArrowRight, Plus, RefreshCw } from 'lucide-react'

interface StatsSummaryProps {
  statistics: ReviewStatistics
}

export function StatsSummary({ statistics }: StatsSummaryProps) {
  const stats = [
    {
      label: '총 계획',
      value: statistics.totalPlanned,
      icon: <Plus className="h-5 w-5 text-blue-500" />,
    },
    {
      label: '완료',
      value: statistics.completed,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      label: '완료율',
      value: `${Math.round(statistics.completionRate)}%`,
      icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    },
    {
      label: '취소',
      value: statistics.cancelled,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    },
    {
      label: '연기',
      value: statistics.postponed,
      icon: <ArrowRight className="h-5 w-5 text-orange-500" />,
    },
    {
      label: '총 변경',
      value: statistics.totalChanges,
      icon: <RefreshCw className="h-5 w-5 text-purple-500" />,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4 text-center">
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
