import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChangeLog, ChangeType } from '@/types'
import {
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  Edit,
  AlertTriangle,
} from 'lucide-react'

interface ChangeTimelineProps {
  changes: ChangeLog[]
}

const changeTypeConfig: Record<
  ChangeType,
  { icon: React.ReactNode; color: string; label: string }
> = {
  STATUS_CHANGED: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'bg-blue-500',
    label: '상태 변경',
  },
  TIME_CHANGED: {
    icon: <Clock className="h-4 w-4" />,
    color: 'bg-amber-500',
    label: '시간 변경',
  },
  MOVED_TO_ANOTHER_DAY: {
    icon: <ArrowRight className="h-4 w-4" />,
    color: 'bg-purple-500',
    label: '날짜 이동',
  },
  TASK_CREATED: {
    icon: <Plus className="h-4 w-4" />,
    color: 'bg-green-500',
    label: '추가',
  },
  TASK_UPDATED: {
    icon: <Edit className="h-4 w-4" />,
    color: 'bg-indigo-500',
    label: '수정',
  },
  TASK_DELETED: {
    icon: <Trash2 className="h-4 w-4" />,
    color: 'bg-red-500',
    label: '삭제',
  },
  PRIORITY_CHANGED: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'bg-pink-500',
    label: '우선순위 변경',
  },
}

export function ChangeTimeline({ changes }: ChangeTimelineProps) {
  const groupedChanges = changes.reduce(
    (acc, change) => {
      const date = change.targetDate
      if (!acc[date]) acc[date] = []
      acc[date].push(change)
      return acc
    },
    {} as Record<string, ChangeLog[]>
  )

  const sortedDates = Object.keys(groupedChanges).sort((a, b) => b.localeCompare(a))

  if (changes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">변경 이력이 없습니다</div>
    )
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <h3 className="font-medium text-gray-900 mb-3">
            {format(parseISO(date), 'M월 d일 (E)', { locale: ko })}
          </h3>
          <div className="space-y-3 pl-4 border-l-2 border-gray-200">
            {groupedChanges[date].map((log) => (
              <ChangeLogItem key={log.id} log={log} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ChangeLogItem({ log }: { log: ChangeLog }) {
  const config = changeTypeConfig[log.changeType]
  const time = format(parseISO(log.changedAt), 'HH:mm')

  const getChangeDescription = (): string => {
    switch (log.changeType) {
      case 'STATUS_CHANGED': {
        const statusChange = log.changes.find((c) => c.field === 'status')
        if (statusChange?.newValue === 'COMPLETED') return '완료 처리'
        if (statusChange?.newValue === 'CANCELLED') return '취소됨'
        return '상태 변경'
      }
      case 'TIME_CHANGED': {
        const timeChange = log.changes.find((c) => c.field === 'scheduledTime')
        return `시간 변경 (${timeChange?.previousValue} → ${timeChange?.newValue})`
      }
      case 'MOVED_TO_ANOTHER_DAY':
        return '다른 날로 이동됨'
      case 'TASK_CREATED':
        return '추가됨'
      case 'TASK_DELETED':
        return '삭제됨'
      case 'PRIORITY_CHANGED':
        return '우선순위 변경'
      default:
        return '수정됨'
    }
  }

  return (
    <div className="relative pl-6">
      <div
        className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full text-white flex items-center justify-center ${config.color}`}
      >
        {config.icon}
      </div>
      <div className="text-sm">
        <span className="text-gray-500">{time}</span>
        <span className="mx-2 font-medium">"{log.taskTitle}"</span>
        <span className="text-gray-700">{getChangeDescription()}</span>
        {log.reason && (
          <p className="text-gray-500 text-xs mt-1">사유: {log.reason}</p>
        )}
      </div>
    </div>
  )
}
