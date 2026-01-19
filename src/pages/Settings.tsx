import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api/auth'
import { useToast } from '@/hooks/useToast'

interface SettingsFormData {
  name: string
  planningDay: string  // 숫자(0-6)를 문자열로 저장
  reviewDay: string
  timezone: string
  defaultReminderMinutes: number
  notificationEnabled: boolean
}

// 백엔드 API는 0(일요일)~6(토요일) 숫자 사용
const dayOptions: { value: string; label: string }[] = [
  { value: '0', label: '일요일' },
  { value: '1', label: '월요일' },
  { value: '2', label: '화요일' },
  { value: '3', label: '수요일' },
  { value: '4', label: '목요일' },
  { value: '5', label: '금요일' },
  { value: '6', label: '토요일' },
]

export default function Settings() {
  const { user, setUser } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const { register, handleSubmit, setValue, watch, reset } = useForm<SettingsFormData>()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const response = await authApi.getMe()
      const userData = response.data
      setUser(userData)
      reset({
        name: userData.name,
        planningDay: String(userData.settings?.planningDay ?? 0),
        reviewDay: String(userData.settings?.reviewDay ?? 6),
        timezone: userData.settings?.timezone || 'Asia/Seoul',
        defaultReminderMinutes: userData.settings?.defaultReminderMinutes || 10,
        notificationEnabled: userData.settings?.notificationEnabled ?? true,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true)
    try {
      await authApi.updateSettings({
        planningDay: parseInt(data.planningDay, 10),
        reviewDay: parseInt(data.reviewDay, 10),
        timezone: data.timezone,
        defaultReminderMinutes: data.defaultReminderMinutes,
        notificationEnabled: data.notificationEnabled,
      })
      toast({ title: '설정이 저장되었습니다' })
    } catch (error) {
      console.error(error)
      toast({ variant: 'destructive', title: '저장 실패' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">설정</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 일정 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">일정 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>계획 수립 요일</Label>
                <Select
                  value={watch('planningDay')}
                  onValueChange={(value) => setValue('planningDay', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>회고 요일</Label>
                <Select
                  value={watch('reviewDay')}
                  onValueChange={(value) => setValue('reviewDay', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 알림 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">알림 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notificationEnabled">알림 활성화</Label>
              <Switch
                id="notificationEnabled"
                checked={watch('notificationEnabled')}
                onCheckedChange={(checked) => setValue('notificationEnabled', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultReminderMinutes">기본 알림 시간</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="defaultReminderMinutes"
                  type="number"
                  className="w-24"
                  {...register('defaultReminderMinutes', { valueAsNumber: true })}
                />
                <span className="text-sm text-gray-500">분 전</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 지역 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">지역 설정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>시간대</Label>
              <Select
                value={watch('timezone')}
                onValueChange={(value) => setValue('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Seoul">Asia/Seoul (한국)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (일본)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 계정 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">계정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>이메일</Label>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" {...register('name')} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? '저장 중...' : '저장'}
        </Button>
      </form>
    </div>
  )
}
