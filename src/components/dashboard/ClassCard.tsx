import { MapPin, User, Clock, Pencil, Trash2, BookOpen, FlaskConical, Monitor, GraduationCap } from 'lucide-react'
import type { ClassSession } from '@/types'
import { formatTimeRange } from '@/lib/schedule'
import { useDayNames } from '@/hooks/useDayNames'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUIStore } from '@/stores/uiStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

interface ClassCardProps {
  session: ClassSession
  compact?: boolean
}

export function ClassCard({ session, compact }: ClassCardProps) {
  const { t } = useTranslation()
  const { short: DAY_NAMES_SHORT } = useDayNames()
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
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            {session.scheduleKind === 'teach' && (
              <Badge variant="default" className="text-[10px] gap-0.5 py-0">
                <GraduationCap className="h-3 w-3" />
                {t('classForm.teach')}
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`text-[10px] py-0 ${
                session.courseType === 'practicum'
                  ? 'border-cyan-500/50 text-cyan-600 dark:text-cyan-400'
                  : 'border-indigo-500/50 text-indigo-600 dark:text-indigo-400'
              }`}
            >
              {session.courseType === 'theory' ? (
                <><BookOpen className="h-3 w-3 mr-0.5" />{t('classForm.theory')}</>
              ) : (
                <><FlaskConical className="h-3 w-3 mr-0.5" />{t('classForm.practicum')}</>
              )}
            </Badge>
            <Badge
              variant="secondary"
              className="text-[10px] py-0 gap-0.5"
            >
              {session.meetingMode === 'online' ? (
                <><Monitor className="h-3 w-3" />{t('classForm.online')}</>
              ) : (
                <><MapPin className="h-3 w-3" />{t('classForm.offline')}</>
              )}
            </Badge>
          </div>

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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => openClassModal(session.id)}
            aria-label={`Edit ${session.title}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => void deleteClass(session.id)}
            aria-label={`Delete ${session.title}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
