import type { CourseType, KelasLetter, MeetingMode, RecurrenceType, ScheduleKind } from '@/types'

export const KELAS_OPTIONS: KelasLetter[] = ['A', 'B', 'C', 'D', 'E', 'F']

export const ANGKATAN_OPTIONS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020']

export interface ScheduleTemplateItem {
  id: string
  title: string
  lecturer: string
  room: string
  color: string
  dayOfWeek: number
  startTime: string
  endTime: string
  courseType: CourseType
  meetingMode: MeetingMode
  scheduleKind: ScheduleKind
  recurrence: RecurrenceType
  notes?: string
}

function roomForKelas(base: string, kelas: KelasLetter): string {
  return base.replace('{K}', kelas)
}

const BASE_SCHEDULE: (Omit<ScheduleTemplateItem, 'id' | 'room'> & { roomBase: string })[] = [
  {
    title: 'Pemrograman Web',
    lecturer: 'Dr. Budi Santoso, M.Kom',
    roomBase: 'Lab Komputer {K}',
    color: '#6366f1',
    dayOfWeek: 1,
    startTime: '07:30',
    endTime: '09:00',
    courseType: 'theory',
    meetingMode: 'offline',
    scheduleKind: 'study',
    recurrence: 'weekly',
  },
  {
    title: 'Pemrograman Web (Praktikum)',
    lecturer: 'Dr. Budi Santoso, M.Kom',
    roomBase: 'Lab Komputer {K}',
    color: '#818cf8',
    dayOfWeek: 1,
    startTime: '09:15',
    endTime: '11:45',
    courseType: 'practicum',
    meetingMode: 'offline',
    scheduleKind: 'study',
    recurrence: 'weekly',
    notes: 'Bawa laptop',
  },
  {
    title: 'Basis Data',
    lecturer: 'Prof. Siti Aminah, M.T',
    roomBase: 'Gedung A · Ruang {K}01',
    color: '#06b6d4',
    dayOfWeek: 2,
    startTime: '10:00',
    endTime: '11:30',
    courseType: 'theory',
    meetingMode: 'offline',
    scheduleKind: 'study',
    recurrence: 'weekly',
  },
  {
    title: 'Basis Data (Praktikum)',
    lecturer: 'Prof. Siti Aminah, M.T',
    roomBase: 'Lab Database {K}',
    color: '#22d3ee',
    dayOfWeek: 2,
    startTime: '13:00',
    endTime: '15:30',
    courseType: 'practicum',
    meetingMode: 'offline',
    scheduleKind: 'study',
    recurrence: 'weekly',
  },
  {
    title: 'Jaringan Komputer',
    lecturer: 'Ir. Ahmad Wijaya, M.T',
    roomBase: 'Gedung B · {K}-204',
    color: '#8b5cf6',
    dayOfWeek: 3,
    startTime: '08:00',
    endTime: '09:30',
    courseType: 'theory',
    meetingMode: 'offline',
    scheduleKind: 'study',
    recurrence: 'weekly',
  },
  {
    title: 'Jaringan Komputer (Praktikum)',
    lecturer: 'Ir. Ahmad Wijaya, M.T',
    roomBase: 'Lab Jaringan {K}',
    color: '#a78bfa',
    dayOfWeek: 3,
    startTime: '10:00',
    endTime: '12:30',
    courseType: 'practicum',
    meetingMode: 'offline',
    scheduleKind: 'study',
    recurrence: 'weekly',
  },
  {
    title: 'Pemrograman Berorientasi Objek',
    lecturer: 'Dr. Rina Kartika, M.Kom',
    roomBase: 'Gedung C · Ruang {K}12',
    color: '#10b981',
    dayOfWeek: 4,
    startTime: '07:30',
    endTime: '09:00',
    courseType: 'theory',
    meetingMode: 'offline',
    scheduleKind: 'study',
    recurrence: 'weekly',
  },
  {
    title: 'PBO (Praktikum)',
    lecturer: 'Dr. Rina Kartika, M.Kom',
    roomBase: 'Lab Pemrograman {K}',
    color: '#34d399',
    dayOfWeek: 4,
    startTime: '09:15',
    endTime: '11:45',
    courseType: 'practicum',
    meetingMode: 'offline',
    scheduleKind: 'study',
    recurrence: 'weekly',
  },
  {
    title: 'Sistem Operasi',
    lecturer: 'Prof. Hendra Gunawan, M.T',
    roomBase: 'Auditorium {K}',
    color: '#f59e0b',
    dayOfWeek: 5,
    startTime: '10:00',
    endTime: '11:30',
    courseType: 'theory',
    meetingMode: 'offline',
    scheduleKind: 'study',
    recurrence: 'weekly',
  },
  {
    title: 'Metodologi Penelitian',
    lecturer: 'Dr. Dewi Lestari, M.Sc',
    roomBase: 'Gedung A · {K}-301',
    color: '#ec4899',
    dayOfWeek: 5,
    startTime: '13:00',
    endTime: '14:30',
    courseType: 'theory',
    meetingMode: 'online',
    scheduleKind: 'study',
    recurrence: 'weekly',
    notes: 'Link Zoom di grup kelas',
  },
]

function applyKelasVariants(items: ScheduleTemplateItem[], kelas: KelasLetter): ScheduleTemplateItem[] {
  if (kelas === 'D') {
    return items.map((i) =>
      i.title === 'Metodologi Penelitian' ? { ...i, meetingMode: 'online' as MeetingMode, notes: 'Hybrid — Kelas D' } : i
    )
  }
  if (kelas === 'E') {
    return items.map((i) =>
      i.title === 'Sistem Operasi' ? { ...i, startTime: '13:00', endTime: '14:30' } : i
    )
  }
  if (kelas === 'F') {
    return items.map((i) =>
      i.title === 'Pemrograman Web'
        ? { ...i, startTime: '08:00', endTime: '09:30' }
        : i.title === 'Metodologi Penelitian'
          ? { ...i, meetingMode: 'online' as MeetingMode }
          : i
    )
  }
  return items
}

export function getScheduleTemplate(kelas: KelasLetter): ScheduleTemplateItem[] {
  const base = BASE_SCHEDULE.map((item, index) => ({
    id: `tpl-${kelas}-${index}`,
    title: item.title,
    lecturer: item.lecturer,
    room: roomForKelas(item.roomBase, kelas),
    color: item.color,
    dayOfWeek: item.dayOfWeek,
    startTime: item.startTime,
    endTime: item.endTime,
    courseType: item.courseType,
    meetingMode: item.meetingMode,
    scheduleKind: item.scheduleKind,
    recurrence: item.recurrence,
    notes: item.notes,
  }))
  return applyKelasVariants(base, kelas)
}

export function getTemplatePreview(kelas: KelasLetter, angkatan: string) {
  const items = getScheduleTemplate(kelas)
  return {
    kelas,
    angkatan,
    totalSessions: items.length,
    theoryCount: items.filter((i) => i.courseType === 'theory').length,
    practicumCount: items.filter((i) => i.courseType === 'practicum').length,
    onlineCount: items.filter((i) => i.meetingMode === 'online').length,
  }
}
