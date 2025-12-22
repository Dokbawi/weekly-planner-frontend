import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  BarChart3,
  Train,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '대시보드' },
  { to: '/today', icon: CalendarCheck, label: '오늘' },
  { to: '/planning', icon: Calendar, label: '주간 계획' },
  { to: '/review', icon: BarChart3, label: '회고' },
  { to: '/commute', icon: Train, label: '출퇴근' },
  { to: '/settings', icon: Settings, label: '설정' },
]

export function Sidebar() {
  const { isSidebarOpen } = useUIStore()

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-white transition-transform lg:translate-x-0',
        !isSidebarOpen && '-translate-x-full'
      )}
    >
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
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
  )
}
