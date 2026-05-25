import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Assignment, ClassSession, Notification } from '@/types'
import { SAMPLE_ASSIGNMENTS, SAMPLE_CLASSES, SAMPLE_NOTIFICATIONS } from '@/data/sample'
import { findConflicts } from '@/lib/schedule'
import { generateId } from '@/lib/utils'

interface ScheduleState {
  classes: ClassSession[]
  assignments: Assignment[]
  notifications: Notification[]
  searchQuery: string
  filterColor: string | null
  initializeForUser: (userId: string) => void
  addClass: (data: Omit<ClassSession, 'id' | 'createdAt' | 'updatedAt'>) => { success: boolean; conflicts?: ClassSession[] }
  updateClass: (id: string, data: Partial<ClassSession>) => { success: boolean; conflicts?: ClassSession[] }
  deleteClass: (id: string) => void
  moveClass: (id: string, dayOfWeek: number, startTime: string, endTime: string) => { success: boolean; conflicts?: ClassSession[] }
  addAssignment: (data: Omit<Assignment, 'id'>) => void
  toggleAssignment: (id: string) => void
  deleteAssignment: (id: string) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  setSearchQuery: (q: string) => void
  setFilterColor: (color: string | null) => void
  getFilteredClasses: () => ClassSession[]
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      classes: [],
      assignments: [],
      notifications: SAMPLE_NOTIFICATIONS,
      searchQuery: '',
      filterColor: null,

      initializeForUser: (userId) => {
        const { classes } = get()
        if (classes.length === 0) {
          const now = new Date().toISOString()
          set({
            classes: SAMPLE_CLASSES.map((c) => ({
              ...c,
              userId,
              createdAt: now,
              updatedAt: now,
            })),
            assignments: SAMPLE_ASSIGNMENTS.map((a) => ({ ...a, userId })),
          })
        }
      },

      addClass: (data) => {
        const { classes } = get()
        const now = new Date().toISOString()
        const session: ClassSession = {
          ...data,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        }
        const conflicts = findConflicts(session, classes)
        if (conflicts.length > 0) {
          return { success: false, conflicts }
        }
        set({ classes: [...classes, session] })
        return { success: true }
      },

      updateClass: (id, data) => {
        const { classes } = get()
        const updated = classes.map((c) =>
          c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
        )
        const session = updated.find((c) => c.id === id)!
        const conflicts = findConflicts(session, updated)
        if (conflicts.length > 0) return { success: false, conflicts }
        set({ classes: updated })
        return { success: true }
      },

      deleteClass: (id) => {
        set((s) => ({
          classes: s.classes.filter((c) => c.id !== id),
          assignments: s.assignments.filter((a) => a.classId !== id),
        }))
      },

      moveClass: (id, dayOfWeek, startTime, endTime) => {
        return get().updateClass(id, { dayOfWeek, startTime, endTime })
      },

      addAssignment: (data) => {
        const assignment: Assignment = {
          ...data,
          id: generateId(),
        }
        set((s) => ({ assignments: [...s.assignments, assignment] }))
      },

      toggleAssignment: (id) => {
        set((s) => ({
          assignments: s.assignments.map((a) =>
            a.id === id ? { ...a, completed: !a.completed } : a
          ),
        }))
      },

      deleteAssignment: (id) => {
        set((s) => ({
          assignments: s.assignments.filter((a) => a.id !== id),
        }))
      },

      markNotificationRead: (id) => {
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }))
      },

      markAllNotificationsRead: () => {
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        }))
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
    }),
    {
      name: 'classflow-schedule',
      partialize: (s) => ({
        classes: s.classes,
        assignments: s.assignments,
        notifications: s.notifications,
      }),
    }
  )
)
