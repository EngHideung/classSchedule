import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, Settings, User, Menu, Bell,
  Search, Sparkles, PanelLeftClose, PanelLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { CommandPalette } from '@/components/shared/CommandPalette'
import { ClassFormModal } from '@/components/schedule/ClassFormModal'
import { FloatingActionButton } from '@/components/shared/FloatingActionButton'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { usePomodoro } from '@/hooks/usePomodoro'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/app/profile', icon: User, label: 'Profile' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
]

export function AppLayout() {
  const location = useLocation()
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const setSearchQuery = useScheduleStore((s) => s.setSearchQuery)
  const searchQuery = useScheduleStore((s) => s.searchQuery)
  const notifications = useScheduleStore((s) => s.notifications)
  const user = useAuthStore((s) => s.user)
  const focusMode = usePreferencesStore((s) => s.focusMode)
  const initializeForUser = useScheduleStore((s) => s.initializeForUser)

  useKeyboardShortcuts()
  usePomodoro()

  useEffect(() => {
    if (user) initializeForUser(user.id)
  }, [user, initializeForUser])

  const unreadCount = notifications.filter((n) => !n.read).length
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'CF'

  return (
    <div className={cn('flex min-h-screen bg-background', focusMode && 'focus-mode')} data-focus-mode={focusMode || undefined}>
      <CommandPalette />
      <ClassFormModal />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r glass transition-all duration-300 lg:static',
          sidebarOpen ? 'w-64' : 'w-[72px]',
          !sidebarOpen && 'max-lg:-translate-x-full max-lg:w-64'
        )}
        aria-label="App sidebar"
      >
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <Link to="/app/dashboard" className="flex items-center gap-2 font-display font-bold">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-cyan-500 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            {sidebarOpen && <span>ClassFlow</span>}
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-3 space-y-2">
          <Button
            variant="ghost"
            size={sidebarOpen ? 'default' : 'icon'}
            className={cn('w-full', !sidebarOpen && 'px-0')}
            onClick={() => setCommandPaletteOpen(true)}
            aria-label="Open command palette"
          >
            <Search className="h-4 w-4" />
            {sidebarOpen && <span className="flex-1 text-left text-muted-foreground">Search… ⌘K</span>}
          </Button>
          <div className={cn('flex items-center gap-2', !sidebarOpen && 'justify-center')}>
            <ThemeToggle compact />
            <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={toggleSidebar} aria-hidden="true" />
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b glass px-4 lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search classes, rooms, lecturers…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background/80 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search schedule"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications, ${unreadCount} unread`}>
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
            <Link to="/app/profile">
              <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/20">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6 scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <FloatingActionButton />
    </div>
  )
}
