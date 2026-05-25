import type { Assignment, ClassSession, Notification } from '@/types'

export const CLASS_COLORS = [
  '#6366f1', '#06b6d4', '#8b5cf6', '#10b981',
  '#f59e0b', '#ec4899', '#3b82f6', '#14b8a6',
]

const DEFAULT_CLASS_FIELDS = {
  courseType: 'theory' as const,
  meetingMode: 'offline' as const,
  scheduleKind: 'study' as const,
}

export const SAMPLE_CLASSES: Omit<ClassSession, 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    ...DEFAULT_CLASS_FIELDS,
    id: 'class-1',
    title: 'Advanced Algorithms',
    lecturer: 'Dr. Sarah Chen',
    room: 'Hall B · 204',
    color: '#6366f1',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '10:30',
    recurrence: 'weekly',
    notes: 'Bring laptop for lab exercises',
  },
  {
    ...DEFAULT_CLASS_FIELDS,
    id: 'class-2',
    title: 'Human-Computer Interaction',
    lecturer: 'Prof. James Okonkwo',
    room: 'Design Studio · 12',
    color: '#06b6d4',
    dayOfWeek: 1,
    startTime: '13:00',
    endTime: '14:30',
    recurrence: 'weekly',
  },
  {
    ...DEFAULT_CLASS_FIELDS,
    id: 'class-3',
    title: 'Database Systems',
    lecturer: 'Dr. Elena Vasquez',
    room: 'Lab C · 301',
    color: '#8b5cf6',
    dayOfWeek: 2,
    startTime: '10:00',
    endTime: '11:30',
    recurrence: 'weekly',
  },
  {
    ...DEFAULT_CLASS_FIELDS,
    id: 'class-4',
    title: 'Software Engineering',
    lecturer: 'Prof. Michael Torres',
    room: 'Auditorium A',
    color: '#10b981',
    dayOfWeek: 3,
    startTime: '09:00',
    endTime: '11:00',
    recurrence: 'weekly',
    notes: 'Team project presentations this week',
  },
  {
    ...DEFAULT_CLASS_FIELDS,
    id: 'class-5',
    title: 'Machine Learning',
    lecturer: 'Dr. Aisha Rahman',
    room: 'AI Lab · 5',
    color: '#f59e0b',
    dayOfWeek: 4,
    startTime: '14:00',
    endTime: '16:00',
    recurrence: 'weekly',
  },
  {
    ...DEFAULT_CLASS_FIELDS,
    id: 'class-6',
    title: 'Capstone Seminar',
    lecturer: 'Faculty Panel',
    room: 'Conference Room 2',
    color: '#ec4899',
    dayOfWeek: 5,
    startTime: '11:00',
    endTime: '12:30',
    recurrence: 'weekly',
  },
]

export const SAMPLE_ASSIGNMENTS: Omit<Assignment, 'userId'>[] = [
  {
    id: 'assign-1',
    title: 'Algorithm analysis report',
    classId: 'class-1',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    completed: false,
    priority: 'high',
  },
  {
    id: 'assign-2',
    title: 'HCI prototype wireframes',
    classId: 'class-2',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    completed: false,
    priority: 'medium',
  },
  {
    id: 'assign-3',
    title: 'SQL optimization exercise',
    classId: 'class-3',
    dueDate: new Date(Date.now() + 1 * 86400000).toISOString(),
    completed: true,
    priority: 'high',
  },
]

export const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Class starting soon',
    message: 'Advanced Algorithms begins in 15 minutes in Hall B · 204',
    read: false,
    type: 'reminder',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    title: 'Assignment due tomorrow',
    message: 'SQL optimization exercise is due tomorrow at 11:59 PM',
    read: false,
    type: 'warning',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif-3',
    title: 'Schedule shared',
    message: 'Alex invited you to view their weekly schedule',
    read: true,
    type: 'info',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

export const MOTIVATIONAL_QUOTES = [
  { text: 'Small progress each day adds up to big results.', author: 'Unknown' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Education is the passport to the future.', author: 'Malcolm X' },
  { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
]

export const STUDY_TIPS = [
  'Use the Pomodoro technique: 25 min focus, 5 min break.',
  'Review notes within 24 hours of class for better retention.',
  'Block similar tasks together to reduce context switching.',
  'Teach a concept to someone else to solidify understanding.',
  'Schedule your hardest classes when your energy peaks.',
]

export const TESTIMONIALS = [
  {
    name: 'Maya Rodriguez',
    role: 'Computer Science Student',
    avatar: 'MR',
    quote: 'ClassFlow transformed how I manage my semester. Conflict detection alone saved me twice.',
    rating: 5,
  },
  {
    name: 'Dr. Thomas Kim',
    role: 'Professor, State University',
    avatar: 'TK',
    quote: 'Finally a scheduling tool that feels as polished as the tools my students already love.',
    rating: 5,
  },
  {
    name: 'Jordan Lee',
    role: 'Study Group Lead',
    avatar: 'JL',
    quote: 'Sharing schedules with my study group took seconds. The UI is genuinely delightful.',
    rating: 5,
  },
]

export const FAQ_ITEMS = [
  {
    q: 'Is ClassFlow really free?',
    a: 'Yes. ClassFlow is built with free, open-source technologies. Core features are free for students, teachers, and communities.',
  },
  {
    q: 'Can I use ClassFlow offline?',
    a: 'Your schedule is stored locally in your browser. You can view and edit without an internet connection.',
  },
  {
    q: 'Does it detect schedule conflicts?',
    a: 'Absolutely. When you add or move a class, ClassFlow warns you if times overlap.',
  },
  {
    q: 'Can I export my schedule?',
    a: 'Export to PDF, image, or share a public link with classmates and colleagues.',
  },
]
