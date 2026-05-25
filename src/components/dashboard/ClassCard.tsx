import { MapPin, User, Clock, Pencil, Trash2 } from 'lucide-react'
import type { ClassSession } from '@/types'
import { formatTimeRange, DAY_NAMES_SHORT } from '@/lib/schedule'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/uiStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { motion } from 'framer-motion'

// Simple dropdown without full radix menu file - I'll create dropdown or use inline buttons

interface ClassCardProps {
  session: ClassSession
  compact?: boolean
}

export function ClassCard({ session, compact }: ClassCardProps) {
  const openClassModal = useUIStore((s) => s.openClassModal)
  const deleteClass = useScheduleStore((s) => s.deleteClass)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative overflow-hidden rounded-xl border bg-card/80 p-4 transition-shadow hover:shadow-md"
      style={{ borderLeftColor: session.color, borderLeftWidth: 4 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold truncate">{session.title}</h4>
          {!compact && (
            <>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="h-3 w-3" /> {session.lecturer}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {session.room}
              </p>
            </>
          )}
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium">
            <Clock className="h-3 w-3 text-primary" />
            {DAY_NAMES_SHORT[session.dayOfWeek]} · {formatTimeRange(session.startTime, session.endTime)}
          </p>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openClassModal(session.id)} aria-label={`Edit ${session.title}`}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteClass(session.id)} aria-label={`Delete ${session.title}`}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
