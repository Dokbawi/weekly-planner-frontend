import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsSummary } from '@/components/review/StatsSummary'
import { CompletionChart } from '@/components/review/CompletionChart'
import { ChangeTypeChart } from '@/components/review/ChangeTypeChart'
import { ChangeTimeline } from '@/components/review/ChangeTimeline'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { reviewApi } from '@/api/reviews'
import { WeeklyReview } from '@/types'

export default function Review() {
  const { weekStartDate } = useParams<{ weekStartDate: string }>()
  const [review, setReview] = useState<WeeklyReview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadReview()
  }, [weekStartDate])

  const loadReview = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = weekStartDate
        ? await reviewApi.getByWeek(weekStartDate)
        : await reviewApi.getCurrent()
      setReview(response.data)
    } catch (err) {
      console.error(err)
      setError('회고 데이터를 불러오지 못했습니다')
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

  if (error || !review) {
    return <EmptyState message={error || '회고 데이터가 없습니다'} />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold">주간 회고</h1>
        <p className="text-gray-500">
          {format(parseISO(review.weekStartDate), 'yyyy년 M월 d일', { locale: ko })} ~{' '}
          {format(parseISO(review.weekEndDate), 'M월 d일', { locale: ko })}
        </p>
      </div>

      {/* 통계 요약 */}
      <StatsSummary statistics={review.statistics} />

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">일별 완료율</CardTitle>
          </CardHeader>
          <CardContent>
            <CompletionChart dailyBreakdown={review.dailyBreakdown} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">변경 유형 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <ChangeTypeChart changesByType={review.statistics.changesByType} />
          </CardContent>
        </Card>
      </div>

      {/* 변경 이력 타임라인 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">변경 이력</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangeTimeline changes={review.changeHistory} />
        </CardContent>
      </Card>
    </div>
  )
}
