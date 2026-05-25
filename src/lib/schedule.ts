import { parse, format } from 'date-fns'
import type { ClassSession } from '@/types'

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function sessionsOverlap(a: ClassSession, b: ClassSession): boolean {
  if (a.id === b.id) return false
  if (a.dayOfWeek !== b.dayOfWeek) return false
  const aStart = timeToMinutes(a.startTime)
  const aEnd = timeToMinutes(a.endTime)
  const bStart = timeToMinutes(b.startTime)
  const bEnd = timeToMinutes(b.endTime)
  return aStart < bEnd && bStart < aEnd
}

export function findConflicts(
  session: ClassSession,
  allSessions: ClassSession[]
): ClassSession[] {
  return allSessions.filter(
    (s) => s.id !== session.id && sessionsOverlap(session, s)
  )
}

export function getSessionsForDay(
  sessions: ClassSession[],
  dayOfWeek: number
): ClassSession[] {
  return sessions
    .filter((s) => s.dayOfWeek === dayOfWeek)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
}

export function formatTimeRange(start: string, end: string): string {
  const fmt = (t: string) => {
    const d = parse(t, 'HH:mm', new Date())
    return format(d, 'h:mm a')
  }
  return `${fmt(start)} – ${fmt(end)}`
}

export function getDurationMinutes(start: string, end: string): number {
  return timeToMinutes(end) - timeToMinutes(start)
}

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
