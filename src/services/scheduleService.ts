import { getSupabase } from '@/lib/supabase'
import {
  assignmentFromDb,
  classFromDb,
  notificationFromDb,
} from '@/lib/supabase-mappers'
import type { ClassSession, KelasLetter } from '@/types'
import type { DbClass } from '@/types/database'
import { getScheduleTemplate } from '@/data/scheduleTemplates'
import { SAMPLE_NOTIFICATIONS } from '@/data/sample'

export async function fetchUserSchedule(userId: string) {
  const [classesRes, assignmentsRes, notificationsRes] = await Promise.all([
    getSupabase().from('classes').select('*').eq('user_id', userId).order('day_of_week'),
    getSupabase().from('assignments').select('*').eq('user_id', userId).order('due_date'),
    getSupabase().from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
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

export async function seedTemplateForKelas(userId: string, kelas: KelasLetter, angkatan: string) {
  const now = new Date().toISOString()
  const template = getScheduleTemplate(kelas)

  const classesInsert = template.map((c) => ({
    user_id: userId,
    title: c.title,
    lecturer: c.lecturer,
    room: c.room,
    color: c.color,
    day_of_week: c.dayOfWeek,
    start_time: c.startTime,
    end_time: c.endTime,
    notes: c.notes ? `${c.notes} · Angkatan ${angkatan}` : `Kelas ${kelas} · Angkatan ${angkatan}`,
    recurrence: c.recurrence,
    course_type: c.courseType,
    meeting_mode: c.meetingMode,
    schedule_kind: c.scheduleKind,
    created_at: now,
    updated_at: now,
  }))

  const { error: classError } = await getSupabase().from('classes').insert(classesInsert)
  if (classError) throw classError

  const welcomeNotif = {
    user_id: userId,
    title: 'Selamat datang di ClassFlow!',
    message: `Jadwal Kelas ${kelas} Angkatan ${angkatan} berhasil dimuat. Sesuaikan jadwal sesuai kebutuhanmu.`,
    read: false,
    type: 'success' as const,
    created_at: now,
  }

  const { error: notifError } = await getSupabase().from('notifications').insert([
    welcomeNotif,
    ...SAMPLE_NOTIFICATIONS.slice(0, 2).map((n) => ({
      user_id: userId,
      title: n.title,
      message: n.message,
      read: n.read,
      type: n.type,
      created_at: n.createdAt,
    })),
  ])
  if (notifError) throw notifError

  return fetchUserSchedule(userId)
}

export async function insertClass(
  data: Omit<ClassSession, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ClassSession> {
  const { data: row, error } = await getSupabase()
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
      course_type: data.courseType,
      meeting_mode: data.meetingMode,
      schedule_kind: data.scheduleKind,
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
  if (data.courseType !== undefined) payload.course_type = data.courseType
  if (data.meetingMode !== undefined) payload.meeting_mode = data.meetingMode
  if (data.scheduleKind !== undefined) payload.schedule_kind = data.scheduleKind

  const { data: row, error } = await getSupabase()
    .from('classes')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return classFromDb(row as DbClass)
}

export async function deleteClassDb(id: string) {
  const { error } = await getSupabase().from('classes').delete().eq('id', id)
  if (error) throw error
}

export async function updateAssignmentDb(id: string, completed: boolean) {
  const { error } = await getSupabase().from('assignments').update({ completed }).eq('id', id)
  if (error) throw error
}

export async function markNotificationReadDb(id: string) {
  const { error } = await getSupabase().from('notifications').update({ read: true }).eq('id', id)
  if (error) throw error
}

export async function markAllNotificationsReadDb(userId: string) {
  const { error } = await getSupabase()
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
  if (error) throw error
}
