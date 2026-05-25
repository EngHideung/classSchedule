import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, startOfWeek, getDay } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useUIStore } from '@/stores/uiStore'
import { timeToMinutes, minutesToTime, DAY_NAMES_SHORT, formatTimeRange } from '@/lib/schedule'
import type { ClassSession } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const HOUR_START = 7
const HOUR_END = 22
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i)

interface CalendarViewProps {
  view: 'day' | 'week' | 'month' | 'agenda'
}

export function CalendarView({ view }: CalendarViewProps) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const classes = useScheduleStore((s) => s.classes)
  const moveClass = useScheduleStore((s) => s.moveClass)
  const openClassModal = useUIStore((s) => s.openClassModal)
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const weekDays = Array.from({ length: view === 'day' ? 1 : 7 }, (_, i) =>
    addDays(view === 'day' ? new Date() : weekStart, i)
  )

  const handleDrop = useCallback(
    (dayIndex: number, hour: number, sessionId: string) => {
      const session = classes.find((c) => c.id === sessionId)
      if (!session) return
      const dayOfWeek = getDay(weekDays[dayIndex])
      const startTime = minutesToTime(hour * 60)
      const duration = timeToMinutes(session.endTime) - timeToMinutes(session.startTime)
      const endTime = minutesToTime(hour * 60 + duration)
      const result = moveClass(sessionId, dayOfWeek, startTime, endTime)
      if (!result.success) {
        toast.error('Conflict detected', {
          description: result.conflicts?.map((c) => c.title).join(', '),
        })
      } else {
        toast.success('Class rescheduled')
      }
      setDraggedId(null)
    },
    [classes, moveClass, weekDays]
  )

  if (view === 'agenda') {
    const sorted = [...classes].sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    })
    return (
      <div className="space-y-2">
        {sorted.map((s) => (
          <motion.button
            key={s.id}
            type="button"
            layout
            onClick={() => openClassModal(s.id)}
            className="flex w-full items-center gap-4 rounded-xl border bg-card/80 p-4 text-left hover:shadow-md transition-shadow"
            style={{ borderLeftColor: s.color, borderLeftWidth: 4 }}
          >
            <div className="w-16 text-center">
              <p className="text-xs font-medium text-muted-foreground">{DAY_NAMES_SHORT[s.dayOfWeek]}</p>
            </div>
            <div className="flex-1">
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-muted-foreground">{s.lecturer} · {s.room}</p>
            </div>
            <p className="text-sm font-medium">{formatTimeRange(s.startTime, s.endTime)}</p>
          </motion.button>
        ))}
        {sorted.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">No classes scheduled</p>
        )}
      </div>
    )
  }

  if (view === 'month') {
    return (
      <div className="grid grid-cols-7 gap-1">
        {DAY_NAMES_SHORT.map((d) => (
          <div key={d} className="p-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => {
          const dayIndex = i % 7
          const dayClasses = classes.filter((c) => c.dayOfWeek === dayIndex)
          return (
            <div key={i} className="min-h-[80px] rounded-lg border bg-card/50 p-1">
              <span className="text-xs text-muted-foreground">{((i % 28) + 1)}</span>
              <div className="mt-1 space-y-0.5">
                {dayClasses.slice(0, 2).map((c) => (
                  <div
                    key={c.id}
                    className="truncate rounded px-1 text-[10px] text-white"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, -7))} aria-label="Previous week">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="font-display font-semibold">
          {format(weekDays[0], 'MMM d')} – {format(weekDays[weekDays.length - 1], 'MMM d, yyyy')}
        </p>
        <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, 7))} aria-label="Next week">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="min-w-[600px]">
        <div className="grid border-b" style={{ gridTemplateColumns: `60px repeat(${weekDays.length}, 1fr)` }}>
          <div />
          {weekDays.map((d, i) => (
            <div key={i} className="border-l p-2 text-center text-xs font-medium">
              <span className="text-muted-foreground">{format(d, 'EEE')}</span>
              <br />
              <span className="text-lg">{format(d, 'd')}</span>
            </div>
          ))}
        </div>

        <div className="relative" style={{ gridTemplateColumns: `60px repeat(${weekDays.length}, 1fr)` }}>
          {HOURS.map((hour) => (
            <div key={hour} className="contents">
              <div className="border-b py-4 pr-2 text-right text-xs text-muted-foreground">
                {hour > 12 ? hour - 12 : hour}{hour >= 12 ? 'pm' : 'am'}
              </div>
              {weekDays.map((_, dayIdx) => {
                const dayOfWeek = getDay(weekDays[dayIdx])
                const cellSessions = classes.filter(
                  (c) =>
                    c.dayOfWeek === dayOfWeek &&
                    timeToMinutes(c.startTime) >= hour * 60 &&
                    timeToMinutes(c.startTime) < (hour + 1) * 60
                )
                return (
                  <div
                    key={`${hour}-${dayIdx}`}
                    className="relative min-h-[48px] border-b border-l transition-colors hover:bg-secondary/30"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => draggedId && handleDrop(dayIdx, hour, draggedId)}
                  >
                    {cellSessions.map((session) => (
                      <SessionBlock
                        key={session.id}
                        session={session}
                        onDragStart={() => setDraggedId(session.id)}
                        onClick={() => openClassModal(session.id)}
                      />
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SessionBlock({
  session,
  onDragStart,
  onClick,
}: {
  session: ClassSession
  onDragStart: () => void
  onClick: () => void
}) {
  const duration =
    timeToMinutes(session.endTime) - timeToMinutes(session.startTime)
  const height = Math.max((duration / 60) * 48, 32)

  return (
    <motion.div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={cn(
        'absolute left-0.5 right-0.5 z-10 cursor-grab overflow-hidden rounded-lg px-2 py-1 text-xs text-white shadow-md active:cursor-grabbing'
      )}
      style={{
        backgroundColor: session.color,
        height: `${height}px`,
        top: `${((timeToMinutes(session.startTime) % 60) / 60) * 48}px`,
      }}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <p className="font-semibold truncate">{session.title}</p>
      <p className="opacity-80 truncate">{session.room}</p>
    </motion.div>
  )
}
