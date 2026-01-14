import { ReviewStatistics } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle, ArrowRight, Plus, RefreshCw } from 'lucide-react'

interface StatsSummaryProps {
  statistics: ReviewStatistics
}

export function StatsSummary({ statistics }: StatsSummaryProps) {
  // statistics가 없을 경우 기본값 사용
  const safeStats = statistics || {
    totalPlanned: 0,
    completed: 0,
    completionRate: 0,
    cancelled: 0,
    postponed: 0,
    totalChanges: 0,
  }

  const stats = [
    {
      label: '총 계획',
      value: safeStats.totalPlanned || 0,
      icon: <Plus className="h-5 w-5 text-blue-500" />,
    },
    {
      label: '완료',
      value: safeStats.completed || 0,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      label: '완료율',
      value: `${Math.round(safeStats.completionRate || 0)}%`,
      icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    },
    {
      label: '취소',
      value: safeStats.cancelled || 0,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    },
    {
      label: '연기',
      value: safeStats.postponed || 0,
      icon: <ArrowRight className="h-5 w-5 text-orange-500" />,
    },
    {
      label: '총 변경',
      value: safeStats.totalChanges || 0,
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
