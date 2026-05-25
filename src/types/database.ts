export interface DbProfile {
  id: string
  email: string
  name: string
  role: 'student' | 'teacher' | 'admin'
  institution: string | null
  avatar_url: string | null
  language: 'en' | 'id'
  created_at: string
  updated_at: string
}

export interface DbClass {
  id: string
  user_id: string
  title: string
  lecturer: string
  room: string
  color: string
  day_of_week: number
  start_time: string
  end_time: string
  notes: string | null
  recurrence: 'none' | 'daily' | 'weekly' | 'biweekly'
  created_at: string
  updated_at: string
}

export interface DbAssignment {
  id: string
  user_id: string
  class_id: string | null
  title: string
  due_date: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  created_at: string
}

export interface DbNotification {
  id: string
  user_id: string
  title: string
  message: string
  read: boolean
  type: 'info' | 'warning' | 'success' | 'reminder'
  created_at: string
}
