import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar, Plus, BarChart3, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { usePlanStore } from '@/stores/planStore'
import { planApi } from '@/api/plans'
import { todayApi } from '@/api/today'
import { TodayResponse } from '@/types'

export default function Dashboard() {
  const [todayData, setTodayData] = useState<TodayResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { currentPlan, setPlan } = usePlanStore()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [planResponse, todayResponse] = await Promise.all([
        planApi.getCurrent(),
        todayApi.get(),
      ])
      // plan이 null일 수 있음
      if (planResponse.data) {
        setPlan(planResponse.data)
      }
      setTodayData(todayResponse.data)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  const todayProgress = todayData
    ? (todayData.statistics.completed / todayData.statistics.total) * 100 || 0
    : 0

  const weekProgress = currentPlan
    ? (() => {
        let total = 0
        let completed = 0
        Object.values(currentPlan.dailyPlans).forEach((dp) => {
          dp.tasks.forEach((t) => {
            total++
            if (t.status === 'COMPLETED') completed++
          })
        })
        return total > 0 ? (completed / total) * 100 : 0
      })()
    : 0

  const upcomingTasks =
    todayData?.tasks
      .filter((t) => t.status !== 'COMPLETED' && t.scheduledTime)
      .sort((a, b) => (a.scheduledTime || '').localeCompare(b.scheduledTime || ''))
      .slice(0, 3) || []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 오늘 요약 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              오늘 - {format(new Date(), 'M월 d일 (E)', { locale: ko })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              할 일 {todayData?.statistics.total || 0}개 중{' '}
              {todayData?.statistics.completed || 0}개 완료
            </p>
            <Progress value={todayProgress} className="h-2" />
            <p className="text-right text-sm text-gray-500 mt-1">
              {Math.round(todayProgress)}%
            </p>
            <Button asChild variant="outline" className="w-full mt-3">
              <Link to="/today">오늘 보기</Link>
            </Button>
          </CardContent>
        </Card>

        {/* 이번 주 진행률 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              이번 주 진행률
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentPlan &&
                Object.entries(currentPlan.dailyPlans)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .slice(0, 5)
                  .map(([date, dp]) => {
                    const total = dp.tasks.length
                    const completed = dp.tasks.filter(
                      (t) => t.status === 'COMPLETED'
                    ).length
                    const rate = total > 0 ? (completed / total) * 100 : 0
                    return (
                      <div key={date} className="flex items-center gap-2 text-sm">
                        <span className="w-8">
                          {format(parseISO(date), 'E', { locale: ko })}
                        </span>
                        <Progress value={rate} className="h-2 flex-1" />
                        <span className="w-10 text-right text-gray-500">
                          {Math.round(rate)}%
                        </span>
                      </div>
                    )
                  })}
            </div>
            <p className="text-center text-lg font-medium mt-3">
              전체: {Math.round(weekProgress)}%
            </p>
          </CardContent>
        </Card>

        {/* 다가오는 일정 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              다가오는 일정
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-primary">
                      {task.scheduledTime?.substring(0, 5)}
                    </span>
                    <span className="text-sm truncate">{task.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                예정된 일정이 없습니다
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 빠른 액션 */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/today">
                <Plus className="h-4 w-4 mr-2" />
                할 일 추가
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/planning">계획 수립</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/review">회고 보기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
