import { supabase } from '@/lib/supabase'
import {
  assignmentFromDb,
  classFromDb,
  notificationFromDb,
} from '@/lib/supabase-mappers'
import type { ClassSession } from '@/types'
import type { DbClass } from '@/types/database'
import { SAMPLE_ASSIGNMENTS, SAMPLE_CLASSES, SAMPLE_NOTIFICATIONS } from '@/data/sample'

export async function fetchUserSchedule(userId: string) {
  const [classesRes, assignmentsRes, notificationsRes] = await Promise.all([
    supabase.from('classes').select('*').eq('user_id', userId).order('day_of_week'),
    supabase.from('assignments').select('*').eq('user_id', userId).order('due_date'),
    supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
  ])

  if (classesRes.error) throw classesRes.error
  if (assignmentsRes.error) throw assignmentsRes.error
  if (notificationsRes.error) throw notificationsRes.error

  return {
    classes: (classesRes.data ?? []).map((r) => classFromDb(r as DbClass)),
    assignments: (assignmentsRes.data ?? []).map(assignmentFromDb),
    notifications: (notificationsRes.data ?? []).map(notificationFromDb),
  }
}

export async function seedSampleData(userId: string) {
  const now = new Date().toISOString()

  const classesInsert = SAMPLE_CLASSES.map((c) => ({
    user_id: userId,
    title: c.title,
    lecturer: c.lecturer,
    room: c.room,
    color: c.color,
    day_of_week: c.dayOfWeek,
    start_time: c.startTime,
    end_time: c.endTime,
    notes: c.notes ?? null,
    recurrence: c.recurrence,
    created_at: now,
    updated_at: now,
  }))

  const { data: insertedClasses, error: classError } = await supabase
    .from('classes')
    .insert(classesInsert)
    .select()

  if (classError) throw classError

  const classIdMap = new Map<string, string>()
  SAMPLE_CLASSES.forEach((c, i) => {
    if (insertedClasses?.[i]) classIdMap.set(c.id, insertedClasses[i].id)
  })

  const assignmentsInsert = SAMPLE_ASSIGNMENTS.map((a) => ({
    user_id: userId,
    class_id: a.classId ? classIdMap.get(a.classId) ?? null : null,
    title: a.title,
    due_date: a.dueDate,
    completed: a.completed,
    priority: a.priority,
  }))

  const { error: assignError } = await supabase.from('assignments').insert(assignmentsInsert)
  if (assignError) throw assignError

  const notificationsInsert = SAMPLE_NOTIFICATIONS.map((n) => ({
    user_id: userId,
    title: n.title,
    message: n.message,
    read: n.read,
    type: n.type,
    created_at: n.createdAt,
  }))

  const { error: notifError } = await supabase.from('notifications').insert(notificationsInsert)
  if (notifError) throw notifError

  return fetchUserSchedule(userId)
}

export async function insertClass(
  data: Omit<ClassSession, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ClassSession> {
  const { data: row, error } = await supabase
    .from('classes')
    .insert({
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
    })
    .select()
    .single()

  if (error) throw error
  return classFromDb(row as DbClass)
}

export async function updateClassDb(
  id: string,
  data: Partial<ClassSession>
): Promise<ClassSession> {
  const payload: Record<string, unknown> = {}
  if (data.title !== undefined) payload.title = data.title
  if (data.lecturer !== undefined) payload.lecturer = data.lecturer
  if (data.room !== undefined) payload.room = data.room
  if (data.color !== undefined) payload.color = data.color
  if (data.dayOfWeek !== undefined) payload.day_of_week = data.dayOfWeek
  if (data.startTime !== undefined) payload.start_time = data.startTime
  if (data.endTime !== undefined) payload.end_time = data.endTime
  if (data.notes !== undefined) payload.notes = data.notes ?? null
  if (data.recurrence !== undefined) payload.recurrence = data.recurrence

  const { data: row, error } = await supabase
    .from('classes')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return classFromDb(row as DbClass)
}

export async function deleteClassDb(id: string) {
  const { error } = await supabase.from('classes').delete().eq('id', id)
  if (error) throw error
}

export async function updateAssignmentDb(id: string, completed: boolean) {
  const { error } = await supabase.from('assignments').update({ completed }).eq('id', id)
  if (error) throw error
}

export async function markNotificationReadDb(id: string) {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id)
  if (error) throw error
}

export async function markAllNotificationsReadDb(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
  if (error) throw error
}
