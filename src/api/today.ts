import { apiClient } from './client'
import { ApiResponse, TodayResponse, Task } from '@/types'

export const todayApi = {
  // 오늘의 할 일 조회
  // NOTE: /today 엔드포인트가 백엔드에 구현되어야 함
  // 임시로 현재 주 계획에서 오늘 데이터 추출
  get: async (): Promise<ApiResponse<TodayResponse>> => {
    try {
      // 현재 주 계획에서 오늘 데이터 추출
      const { planApi } = await import('./plans')
      const planResponse = await planApi.getCurrent()

      if (planResponse.data) {
        const today = new Date().toISOString().split('T')[0]
        const todayPlan = planResponse.data.dailyPlans[today]

        if (todayPlan) {
          // TodayResponse 형식으로 변환
          const tasks = todayPlan.tasks || []
          const statistics = {
            total: tasks.length,
            completed: tasks.filter((t: Task) => t.status === 'COMPLETED').length,
            pending: tasks.filter((t: Task) => t.status === 'PENDING').length,
            inProgress: tasks.filter((t: Task) => t.status === 'IN_PROGRESS').length,
            cancelled: tasks.filter((t: Task) => t.status === 'CANCELLED').length,
          }

          return {
            success: true,
            data: {
              date: today,
              dayOfWeek: todayPlan.dayOfWeek,
              tasks,
              statistics,
              memo: todayPlan.memo || '',
              planStatus: planResponse.data.status,
            }
          }
        }
      }

      // 오늘 데이터가 없는 경우
      return {
        success: true,
        data: {
          date: new Date().toISOString().split('T')[0],
          dayOfWeek: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][new Date().getDay()],
          tasks: [],
          statistics: {
            total: 0,
            completed: 0,
            pending: 0,
            inProgress: 0,
            cancelled: 0,
          },
          memo: '',
          planStatus: 'DRAFT'
        }
      }
    } catch (error) {
      console.error('Failed to get today data:', error)
      throw error
    }
  },
}
