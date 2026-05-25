import type { Assignment, ClassSession, Notification, User } from '@/types'
import type { DbAssignment, DbClass, DbNotification, DbProfile } from '@/types/database'

export function profileToUser(p: DbProfile): User {
  return {
    id: p.id,
    email: p.email,
    name: p.name,
    role: p.role,
    institution: p.institution ?? undefined,
    avatar: p.avatar_url ?? undefined,
    language: p.language,
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
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function classToDb(
  data: Omit<ClassSession, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<ClassSession, 'id'>>
): Omit<DbClass, 'created_at' | 'updated_at'> {
  return {
    id: data.id!,
    user_id: data.userId,
    title: data.title,
    lecturer: data.lecturer,
    room: data.room,
    color: data.color,
    day_of_week: data.dayOfWeek,
    start_time: data.startTime,
    end_time: data.endTime,
    notes: data.notes ?? null,
    recurrence: data.recurrence,
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
