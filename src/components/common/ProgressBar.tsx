import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProgressBar({
  value,
  showLabel = true,
  size = 'md',
  className,
}: ProgressBarProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  }

  return (
    <div className={cn('w-full', className)}>
      <Progress value={value} className={sizeClasses[size]} />
      {showLabel && (
        <p className="text-sm text-gray-500 mt-1 text-right">{Math.round(value)}%</p>
      )}
    </div>
  )
}
