import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface SaveAsTemplateDialogProps {
  open: boolean
  onClose: () => void
  onSave: (name: string, description?: string) => void
  isLoading?: boolean
}

export function SaveAsTemplateDialog({
  open,
  onClose,
  onSave,
  isLoading,
}: SaveAsTemplateDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    if (!name.trim()) return
    onSave(name.trim(), description.trim() || undefined)
    setName('')
    setDescription('')
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>템플릿으로 저장</DialogTitle>
          <DialogDescription>
            현재 주간 계획의 할 일 패턴을 템플릿으로 저장합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="save-template-name">템플릿 이름 *</Label>
            <Input
              id="save-template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 이번 주 루틴"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="save-template-desc">설명</Label>
            <Textarea
              id="save-template-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="템플릿에 대한 설명 (선택)"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || isLoading}>
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
