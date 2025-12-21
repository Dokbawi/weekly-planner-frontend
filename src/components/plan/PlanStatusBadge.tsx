import { PlanStatus } from '@/types'
import { Badge } from '@/components/ui/badge'

interface PlanStatusBadgeProps {
  status: PlanStatus
}

const statusConfig: Record<PlanStatus, { label: string; variant: 'default' | 'secondary' | 'success' }> = {
  DRAFT: { label: '작성 중', variant: 'secondary' },
  CONFIRMED: { label: '확정됨', variant: 'success' },
  COMPLETED: { label: '완료', variant: 'default' },
}

export function PlanStatusBadge({ status }: PlanStatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
