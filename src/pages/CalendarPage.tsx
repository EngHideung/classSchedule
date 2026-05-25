import { Calendar, LayoutGrid, List, Columns } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/shared/PageTransition'
import { CalendarView } from '@/components/calendar/CalendarView'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

const views = [
  { id: 'day' as const, label: 'Day', icon: Columns },
  { id: 'week' as const, label: 'Week', icon: LayoutGrid },
  { id: 'month' as const, label: 'Month', icon: Calendar },
  { id: 'agenda' as const, label: 'Agenda', icon: List },
]

export function CalendarPage() {
  const calendarView = useUIStore((s) => s.calendarView)
  const setCalendarView = useUIStore((s) => s.setCalendarView)

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Calendar</h1>
            <p className="text-sm text-muted-foreground">
              Drag classes to reschedule · Click to edit
            </p>
          </div>
          <div className="flex gap-1 rounded-xl bg-secondary p-1" role="tablist" aria-label="Calendar view">
            {views.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant="ghost"
                size="sm"
                role="tab"
                aria-selected={calendarView === id}
                className={cn(
                  'rounded-lg gap-1.5',
                  calendarView === id && 'bg-background shadow-sm'
                )}
                onClick={() => setCalendarView(id)}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4 sm:p-6">
          <CalendarView view={calendarView} />
        </div>
      </div>
    </PageTransition>
  )
}
