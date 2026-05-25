export type UserRole = 'student' | 'teacher' | 'admin'

export type AppLanguage = 'en' | 'id'

export type KelasLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export type CourseType = 'theory' | 'practicum'

export type MeetingMode = 'online' | 'offline'

export type ScheduleKind = 'study' | 'teach'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  institution?: string
  language?: AppLanguage
  kelas?: KelasLetter
  angkatan?: string
  setupComplete: boolean
  isAsprak: boolean
  createdAt: string
}

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'biweekly'

export interface ClassSession {
  id: string
  title: string
  lecturer: string
  room: string
  color: string
  dayOfWeek: number
  startTime: string
  endTime: string
  notes?: string
  recurrence: RecurrenceType
  courseType: CourseType
  meetingMode: MeetingMode
  scheduleKind: ScheduleKind
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Assignment {
  id: string
  title: string
  classId?: string
  dueDate: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  userId: string
}

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  type: 'info' | 'warning' | 'success' | 'reminder'
  createdAt: string
}

export interface AttendanceRecord {
  id: string
  classId: string
  date: string
  status: 'present' | 'absent' | 'late'
}

export type ThemeMode = 'light' | 'dark' | 'system'
export type AccentColor = 'indigo' | 'cyan' | 'purple' | 'emerald'

export interface UserPreferences {
  theme: ThemeMode
  accent: AccentColor
  onboardingComplete: boolean
  focusMode: boolean
  notificationsEnabled: boolean
}

export interface ShareLink {
  id: string
  token: string
  expiresAt?: string
  createdAt: string
}

export interface ClassSetupInput {
  kelas: KelasLetter
  angkatan: string
  isAsprak?: boolean
}
