import { NavLink } from 'react-router-dom'
import { X, LayoutDashboard, CalendarCheck, Calendar, BarChart3, Train, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '대시보드' },
  { to: '/today', icon: CalendarCheck, label: '오늘' },
  { to: '/planning', icon: Calendar, label: '주간 계획' },
  { to: '/review', icon: BarChart3, label: '회고' },
  { to: '/commute', icon: Train, label: '출퇴근' },
  { to: '/settings', icon: Settings, label: '설정' },
]

export function MobileNav() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore()

  if (!isMobileMenuOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside className="fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-lg lg:hidden">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <span className="text-xl font-bold text-primary">Weekly Planner</span>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100',
                  isActive && 'bg-primary/10 text-primary font-medium'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
