import type { Assignment, ClassSession, Notification, User } from '@/types'
import type { DbAssignment, DbClass, DbNotification, DbProfile } from '@/types/database'
import type { KelasLetter } from '@/types'

export function profileToUser(p: DbProfile): User {
  return {
    id: p.id,
    email: p.email,
    name: p.name,
    role: p.role,
    institution: p.institution ?? undefined,
    avatar: p.avatar_url ?? undefined,
    language: p.language,
    kelas: (p.kelas as KelasLetter) ?? undefined,
    angkatan: p.angkatan ?? undefined,
    setupComplete: p.setup_complete ?? false,
    isAsprak: p.is_asprak ?? false,
    createdAt: p.created_at,
  }
}

export function classFromDb(row: DbClass): ClassSession {
  return {
    id: row.id,
    title: row.title,
    lecturer: row.lecturer,
    room: row.room,
    color: row.color,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
    notes: row.notes ?? undefined,
    recurrence: row.recurrence,
    courseType: row.course_type ?? 'theory',
    meetingMode: row.meeting_mode ?? 'offline',
    scheduleKind: row.schedule_kind ?? 'study',
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function assignmentFromDb(row: DbAssignment): Assignment {
  return {
    id: row.id,
    title: row.title,
    classId: row.class_id ?? undefined,
    dueDate: row.due_date,
    completed: row.completed,
    priority: row.priority,
    userId: row.user_id,
  }
}

export function notificationFromDb(row: DbNotification): Notification {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    read: row.read,
    type: row.type,
    createdAt: row.created_at,
  }
}
