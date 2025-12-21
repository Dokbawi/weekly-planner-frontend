import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  taskCount: number
  isLoading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  taskCount,
  isLoading,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>계획을 확정하시겠습니까?</DialogTitle>
          <DialogDescription>
            확정 후에는 모든 변경사항이 기록됩니다. 주말에 어떻게 변경되었는지 확인할 수
            있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-lg">
            총 <span className="font-bold text-primary">{taskCount}</span>개의 할 일이
            계획되었습니다.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            취소
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? '확정 중...' : '확정'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
