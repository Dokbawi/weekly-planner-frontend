import { Edit, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WeeklyTemplate } from '@/types/template'

const DAY_LABELS: Record<string, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
}

interface TemplateListProps {
  templates: WeeklyTemplate[]
  onEdit: (template: WeeklyTemplate) => void
  onDelete: (id: string) => void
  onApply?: (template: WeeklyTemplate) => void
}

export function TemplateList({ templates, onEdit, onDelete, onApply }: TemplateListProps) {
  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center">
        <p className="text-gray-500">아직 저장된 템플릿이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => {
        const totalTasks = template.dayPlans.reduce((sum, dp) => sum + dp.tasks.length, 0)
        const activeDays = template.dayPlans.filter((dp) => dp.tasks.length > 0)

        return (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{template.name}</CardTitle>
                  {template.description && (
                    <CardDescription className="mt-1 line-clamp-2">
                      {template.description}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-3">
                {activeDays.map((dp) => (
                  <span
                    key={dp.dayOfWeek}
                    className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    {DAY_LABELS[dp.dayOfWeek]} ({dp.tasks.length})
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 mb-4">총 {totalTasks}개 할 일</p>
              <div className="flex gap-2">
                {onApply && (
                  <Button variant="outline" size="sm" onClick={() => onApply(template)}>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    적용
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => onEdit(template)}>
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  수정
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(template.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
