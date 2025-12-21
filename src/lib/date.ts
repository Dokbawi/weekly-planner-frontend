import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  isToday,
  isSameDay,
  differenceInMinutes,
} from 'date-fns'
import { ko } from 'date-fns/locale'

export const formatDate = (date: string | Date, formatStr: string = 'yyyy-MM-dd') => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, formatStr, { locale: ko })
}

export const formatKoreanDate = (date: string | Date) => {
  return formatDate(date, 'M월 d일 (E)')
}

export const formatFullDate = (date: string | Date) => {
  return formatDate(date, 'yyyy년 M월 d일 (E)')
}

export const formatTime = (time: string) => {
  return time.substring(0, 5)
}

export const getWeekDates = (startDate: string | Date): string[] => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i)
    dates.push(format(date, 'yyyy-MM-dd'))
  }
  return dates
}

export const getWeekStart = (date: Date = new Date()): Date => {
  return startOfWeek(date, { weekStartsOn: 1 })
}

export const getWeekEnd = (date: Date = new Date()): Date => {
  return endOfWeek(date, { weekStartsOn: 1 })
}

export const getRelativeTime = (dateStr: string): string => {
  const date = parseISO(dateStr)
  const now = new Date()
  const diffMinutes = differenceInMinutes(now, date)

  if (diffMinutes < 1) return '방금 전'
  if (diffMinutes < 60) return `${diffMinutes}분 전`
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}시간 전`
  if (diffMinutes < 2880) return '어제'
  return formatDate(date, 'M월 d일')
}

export {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  isToday,
  isSameDay,
}
