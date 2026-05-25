import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, getDay, parseISO } from 'date-fns'
import {
  Calendar, CheckCircle2, Circle, Sparkles, TrendingUp,
  Bell, ArrowRight, Brain,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageTransition } from '@/components/shared/PageTransition'
import { ClassCard } from '@/components/dashboard/ClassCard'
import { StatsChart } from '@/components/dashboard/StatsChart'
import { PomodoroWidget } from '@/components/dashboard/PomodoroWidget'
import { OnboardingModal } from '@/components/onboarding/OnboardingModal'
import { useAuthStore } from '@/stores/authStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { getSessionsForDay } from '@/lib/schedule'
import { MOTIVATIONAL_QUOTES, STUDY_TIPS } from '@/data/sample'
import { cn } from '@/lib/utils'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const classes = useScheduleStore((s) => s.classes)
  const assignments = useScheduleStore((s) => s.assignments)
  const notifications = useScheduleStore((s) => s.notifications)
  const toggleAssignment = useScheduleStore((s) => s.toggleAssignment)
  const getFilteredClasses = useScheduleStore((s) => s.getFilteredClasses)

  const today = new Date()
  const todayDay = getDay(today)
  const todaySessions = getSessionsForDay(classes, todayDay)
  const filtered = getFilteredClasses()

  const quote = useMemo(
    () => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)],
    []
  )
  const studyTip = useMemo(
    () => STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)],
    []
  )

  const upcomingAssignments = assignments
    .filter((a) => !a.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4)

  const completedCount = assignments.filter((a) => a.completed).length
  const completionRate = assignments.length
    ? Math.round((completedCount / assignments.length) * 100)
    : 0

  const unread = notifications.filter((n) => !n.read).length

  const greeting = () => {
    const h = today.getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <PageTransition>
      <OnboardingModal />
      <div className="space-y-6">
        <header>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl font-bold sm:text-3xl"
          >
            {greeting()}, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </motion.h1>
          <p className="mt-1 text-muted-foreground">
            {format(today, 'EEEE, MMMM d')} · {todaySessions.length} class{todaySessions.length !== 1 ? 'es' : ''} today
          </p>
        </header>

        {/* Bento grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
          {/* Today's schedule - large */}
          <Card className="glass md:col-span-2 lg:row-span-2 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Today&apos;s schedule</CardTitle>
                <CardDescription>Your classes for {format(today, 'EEEE')}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/calendar">View calendar <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaySessions.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No classes today — enjoy your free time!</p>
              ) : (
                todaySessions.map((s) => <ClassCard key={s.id} session={s} />)
              )}
            </CardContent>
          </Card>

          {/* Motivation */}
          <Card className="glass bg-gradient-to-br from-primary/5 to-cyan-500/5">
            <CardContent className="flex h-full flex-col justify-center p-6">
              <Sparkles className="h-6 w-6 text-primary mb-3" />
              <p className="text-sm font-medium leading-relaxed">&ldquo;{quote.text}&rdquo;</p>
              <p className="mt-2 text-xs text-muted-foreground">— {quote.author}</p>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Weekly hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StatsChart />
            </CardContent>
          </Card>

          {/* Pomodoro */}
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Focus timer</CardTitle>
              <CardDescription>Pomodoro technique</CardDescription>
            </CardHeader>
            <CardContent>
              <PomodoroWidget />
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="glass">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" /> Notifications
              </CardTitle>
              {unread > 0 && <Badge variant="warning">{unread} new</Badge>}
            </CardHeader>
            <CardContent className="space-y-2 max-h-[140px] overflow-y-auto">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className={cn('rounded-lg p-2 text-xs', !n.read && 'bg-primary/5')}>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-muted-foreground line-clamp-1">{n.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card className="glass md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Upcoming assignments</CardTitle>
              <CardDescription>{completionRate}% completion rate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingAssignments.length === 0 ? (
                <p className="text-sm text-muted-foreground">All caught up!</p>
              ) : (
                upcomingAssignments.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-secondary/80 transition-colors"
                    onClick={() => toggleAssignment(a.id)}
                  >
                    {a.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={cn('flex-1 text-sm', a.completed && 'line-through text-muted-foreground')}>{a.title}</span>
                    <Badge variant={a.priority === 'high' ? 'warning' : 'secondary'} className="text-[10px]">
                      {format(parseISO(a.dueDate), 'MMM d')}
                    </Badge>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          {/* AI tips mockup */}
          <Card className="glass md:col-span-2 border-dashed border-primary/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" /> AI study tip
                <Badge variant="outline" className="text-[10px]">Preview</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{studyTip}</p>
              <Button variant="link" className="mt-2 h-auto p-0 text-xs" disabled>
                Generate personalized tips (coming soon)
              </Button>
            </CardContent>
          </Card>

          {/* All classes quick view */}
          <Card className="glass lg:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> This week
                </CardTitle>
                <CardDescription>{filtered.length} classes</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.slice(0, 6).map((s) => (
                  <ClassCard key={s.id} session={s} compact />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
