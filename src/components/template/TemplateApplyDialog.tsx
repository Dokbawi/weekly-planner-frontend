import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ApplyMode, WeeklyTemplate } from '@/types/template'

interface TemplateApplyDialogProps {
  open: boolean
  onClose: () => void
  onApply: (templateId: string, mode: ApplyMode) => void
  template: WeeklyTemplate | null
  isLoading?: boolean
}

export function TemplateApplyDialog({
  open,
  onClose,
  onApply,
  template,
  isLoading,
}: TemplateApplyDialogProps) {
  const [mode, setMode] = useState<ApplyMode>('merge')

  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>템플릿 적용</DialogTitle>
          <DialogDescription>
            &quot;{template.name}&quot; 템플릿을 현재 계획에 적용합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Label>적용 방식</Label>
          <RadioGroup value={mode} onValueChange={(v) => setMode(v as ApplyMode)}>
            <div className="flex items-start space-x-3 rounded-lg border p-3">
              <RadioGroupItem value="merge" id="mode-merge" className="mt-0.5" />
              <div>
                <Label htmlFor="mode-merge" className="font-medium cursor-pointer">
                  병합 (Merge)
                </Label>
                <p className="text-sm text-gray-500">
                  기존 할 일은 유지하고 템플릿의 할 일을 추가합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 rounded-lg border p-3">
              <RadioGroupItem value="overwrite" id="mode-overwrite" className="mt-0.5" />
              <div>
                <Label htmlFor="mode-overwrite" className="font-medium cursor-pointer">
                  덮어쓰기 (Overwrite)
                </Label>
                <p className="text-sm text-gray-500">
                  기존 할 일을 모두 삭제하고 템플릿으로 교체합니다.
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={() => onApply(template.id, mode)} disabled={isLoading}>
            {isLoading ? '적용 중...' : '적용'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
