import { create } from 'zustand'
import type { Assignment, ClassSession, Notification } from '@/types'
import { findConflicts } from '@/lib/schedule'
import { isSupabaseConfigured } from '@/lib/supabase'
import {
  deleteClassDb,
  fetchUserSchedule,
  insertClass,
  markAllNotificationsReadDb,
  markNotificationReadDb,
  updateAssignmentDb,
  updateClassDb,
} from '@/services/scheduleService'

interface ScheduleState {
  classes: ClassSession[]
  assignments: Assignment[]
  notifications: Notification[]
  searchQuery: string
  filterColor: string | null
  isLoading: boolean
  isSynced: boolean
  loadSchedule: (userId: string) => Promise<void>
  refreshSchedule: () => Promise<void>
  addClass: (
    data: Omit<ClassSession, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<{ success: boolean; conflicts?: ClassSession[] }>
  updateClass: (
    id: string,
    data: Partial<ClassSession>
  ) => Promise<{ success: boolean; conflicts?: ClassSession[] }>
  deleteClass: (id: string) => Promise<void>
  moveClass: (
    id: string,
    dayOfWeek: number,
    startTime: string,
    endTime: string
  ) => Promise<{ success: boolean; conflicts?: ClassSession[] }>
  toggleAssignment: (id: string) => Promise<void>
  markNotificationRead: (id: string) => Promise<void>
  markAllNotificationsRead: () => Promise<void>
  setSearchQuery: (q: string) => void
  setFilterColor: (color: string | null) => void
  getFilteredClasses: () => ClassSession[]
  reset: () => void
}

let lastUserId: string | null = null

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  classes: [],
  assignments: [],
  notifications: [],
  searchQuery: '',
  filterColor: null,
  isLoading: false,
  isSynced: false,

  loadSchedule: async (userId) => {
    if (!isSupabaseConfigured) return
    lastUserId = userId
    set({ isLoading: true })
    try {
      const data = await fetchUserSchedule(userId)
      set({
        classes: data.classes,
        assignments: data.assignments,
        notifications: data.notifications,
        isSynced: true,
      })
    } catch (err) {
      console.error('[ClassFlow] loadSchedule:', err)
      set({ isSynced: false })
    } finally {
      set({ isLoading: false })
    }
  },

  refreshSchedule: async () => {
    if (lastUserId) await get().loadSchedule(lastUserId)
  },

  addClass: async (data) => {
    const { classes } = get()
    const tempSession: ClassSession = {
      ...data,
      id: 'temp',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const conflicts = findConflicts(tempSession, classes)
    if (conflicts.length > 0) return { success: false, conflicts }

    try {
      const created = await insertClass(data)
      set({ classes: [...classes, created] })
      return { success: true }
    } catch (err) {
      console.error('[ClassFlow] addClass:', err)
      return { success: false }
    }
  },

  updateClass: async (id, data) => {
    const { classes } = get()
    const merged = classes.map((c) =>
      c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
    )
    const session = merged.find((c) => c.id === id)!
    const conflicts = findConflicts(session, merged)
    if (conflicts.length > 0) return { success: false, conflicts }

    try {
      const updated = await updateClassDb(id, data)
      set({ classes: classes.map((c) => (c.id === id ? updated : c)) })
      return { success: true }
    } catch (err) {
      console.error('[ClassFlow] updateClass:', err)
      return { success: false }
    }
  },

  deleteClass: async (id) => {
    try {
      await deleteClassDb(id)
      set((s) => ({
        classes: s.classes.filter((c) => c.id !== id),
        assignments: s.assignments.filter((a) => a.classId !== id),
      }))
    } catch (err) {
      console.error('[ClassFlow] deleteClass:', err)
    }
  },

  moveClass: async (id, dayOfWeek, startTime, endTime) => {
    return get().updateClass(id, { dayOfWeek, startTime, endTime })
  },

  toggleAssignment: async (id) => {
    const assignment = get().assignments.find((a) => a.id === id)
    if (!assignment) return
    const completed = !assignment.completed
    try {
      await updateAssignmentDb(id, completed)
      set((s) => ({
        assignments: s.assignments.map((a) =>
          a.id === id ? { ...a, completed } : a
        ),
      }))
    } catch (err) {
      console.error('[ClassFlow] toggleAssignment:', err)
    }
  },

  markNotificationRead: async (id) => {
    try {
      await markNotificationReadDb(id)
      set((s) => ({
        notifications: s.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }))
    } catch (err) {
      console.error('[ClassFlow] markNotificationRead:', err)
    }
  },

  markAllNotificationsRead: async () => {
    const userId = lastUserId
    if (!userId) return
    try {
      await markAllNotificationsReadDb(userId)
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      }))
    } catch (err) {
      console.error('[ClassFlow] markAllNotificationsRead:', err)
    }
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterColor: (color) => set({ filterColor: color }),

  getFilteredClasses: () => {
    const { classes, searchQuery, filterColor } = get()
    return classes.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lecturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.room.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesColor = !filterColor || c.color === filterColor
      return matchesSearch && matchesColor
    })
  },

  reset: () => {
    lastUserId = null
    set({
      classes: [],
      assignments: [],
      notifications: [],
      isSynced: false,
    })
  },
}))
