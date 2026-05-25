import { Calendar, LayoutGrid, List, Columns } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/shared/PageTransition'
import { CalendarView } from '@/components/calendar/CalendarView'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export function CalendarPage() {
  const { t } = useTranslation()
  const calendarView = useUIStore((s) => s.calendarView)
  const setCalendarView = useUIStore((s) => s.setCalendarView)

  const views = [
    { id: 'day' as const, label: t('calendar.day'), icon: Columns },
    { id: 'week' as const, label: t('calendar.week'), icon: LayoutGrid },
    { id: 'month' as const, label: t('calendar.month'), icon: Calendar },
    { id: 'agenda' as const, label: t('calendar.agenda'), icon: List },
  ]

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">{t('calendar.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('calendar.subtitle')}</p>
          </div>
          <div className="flex gap-1 rounded-xl bg-secondary p-1" role="tablist" aria-label={t('calendar.title')}>
            {views.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant="ghost"
                size="sm"
                role="tab"
                aria-selected={calendarView === id}
                className={cn('rounded-lg gap-1.5', calendarView === id && 'bg-background shadow-sm')}
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
