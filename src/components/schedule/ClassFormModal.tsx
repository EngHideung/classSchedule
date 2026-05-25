import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { BookOpen, FlaskConical, Monitor, MapPin, GraduationCap, BookMarked } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUIStore } from '@/stores/uiStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useAuthStore } from '@/stores/authStore'
import { CLASS_COLORS } from '@/data/sample'
import { useDayNames } from '@/hooks/useDayNames'
import type { CourseType, MeetingMode, RecurrenceType, ScheduleKind } from '@/types'
import { cn } from '@/lib/utils'

const defaultForm = {
  title: '',
  lecturer: '',
  room: '',
  color: CLASS_COLORS[0],
  dayOfWeek: 1,
  startTime: '09:00',
  endTime: '10:00',
  notes: '',
  recurrence: 'weekly' as RecurrenceType,
  courseType: 'theory' as CourseType,
  meetingMode: 'offline' as MeetingMode,
  scheduleKind: 'study' as ScheduleKind,
}

export function ClassFormModal() {
  const { t } = useTranslation()
  const { full: DAY_NAMES } = useDayNames()
  const open = useUIStore((s) => s.classModalOpen)
  const editingId = useUIStore((s) => s.editingClassId)
  const closeClassModal = useUIStore((s) => s.closeClassModal)
  const classes = useScheduleStore((s) => s.classes)
  const addClass = useScheduleStore((s) => s.addClass)
  const updateClass = useScheduleStore((s) => s.updateClass)
  const deleteClass = useScheduleStore((s) => s.deleteClass)
  const user = useAuthStore((s) => s.user)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)

  const showTeachOption = user?.isAsprak ?? false

  useEffect(() => {
    if (editingId) {
      const c = classes.find((x) => x.id === editingId)
      if (c) {
        setForm({
          title: c.title,
          lecturer: c.lecturer,
          room: c.room,
          color: c.color,
          dayOfWeek: c.dayOfWeek,
          startTime: c.startTime,
          endTime: c.endTime,
          notes: c.notes ?? '',
          recurrence: c.recurrence,
          courseType: c.courseType,
          meetingMode: c.meetingMode,
          scheduleKind: c.scheduleKind,
        })
      }
    } else {
      setForm(defaultForm)
    }
  }, [editingId, classes, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)

    const room =
      form.meetingMode === 'online' && !form.room.trim()
        ? 'Online / Zoom'
        : form.room

    const payload = { ...form, room, userId: user.id }

    if (editingId) {
      const result = await updateClass(editingId, payload)
      if (!result.success) {
        toast.error(t('classForm.conflictError'), {
          description: t('classForm.overlapWith', {
            names: result.conflicts?.map((c) => c.title).join(', '),
          }),
        })
      } else {
        toast.success(t('classForm.classUpdated'))
        closeClassModal()
      }
    } else {
      const result = await addClass(payload)
      if (!result.success) {
        toast.error(t('classForm.conflictError'), {
          description: t('classForm.overlapWith', {
            names: result.conflicts?.map((c) => c.title).join(', '),
          }),
        })
      } else {
        toast.success(t('classForm.classAdded'))
        closeClassModal()
      }
    }
    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && closeClassModal()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingId ? t('classForm.editClass') : t('classForm.addClass')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Schedule kind — asprak only */}
          {showTeachOption && (
            <div className="space-y-2">
              <Label>{t('classForm.scheduleKind')}</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, scheduleKind: 'study' })}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all',
                    form.scheduleKind === 'study'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/40'
                  )}
                >
                  <BookMarked className="h-4 w-4" />
                  {t('classForm.study')}
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, scheduleKind: 'teach' })}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all',
                    form.scheduleKind === 'teach'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/40'
                  )}
                >
                  <GraduationCap className="h-4 w-4" />
                  {t('classForm.teach')}
                </button>
              </div>
            </div>
          )}

          {/* Course type */}
          <div className="space-y-2">
            <Label>{t('classForm.courseType')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, courseType: 'theory' })}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all',
                  form.courseType === 'theory'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'border-border hover:border-indigo-500/40'
                )}
              >
                <BookOpen className="h-4 w-4" />
                {t('classForm.theory')}
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, courseType: 'practicum' })}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all',
                  form.courseType === 'practicum'
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                    : 'border-border hover:border-cyan-500/40'
                )}
              >
                <FlaskConical className="h-4 w-4" />
                {t('classForm.practicum')}
              </button>
            </div>
          </div>

          {/* Meeting mode */}
          <div className="space-y-2">
            <Label>{t('classForm.meetingMode')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, meetingMode: 'offline' })}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all',
                  form.meetingMode === 'offline'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-border'
                )}
              >
                <MapPin className="h-4 w-4" />
                {t('classForm.offline')}
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    meetingMode: 'online',
                    room: form.room || 'Online / Zoom',
                  })
                }
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all',
                  form.meetingMode === 'online'
                    ? 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400'
                    : 'border-border'
                )}
              >
                <Monitor className="h-4 w-4" />
                {t('classForm.online')}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">{t('classForm.className')}</Label>
            <Input
              id="title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={t('classForm.classNamePlaceholder')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="lecturer">{t('classForm.lecturer')}</Label>
              <Input
                id="lecturer"
                value={form.lecturer}
                onChange={(e) => setForm({ ...form, lecturer: e.target.value })}
                placeholder={t('classForm.lecturerPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">
                {form.meetingMode === 'online' ? t('classForm.roomOnline') : t('classForm.room')}
              </Label>
              <Input
                id="room"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                placeholder={
                  form.meetingMode === 'online'
                    ? 'Zoom / Google Meet link'
                    : t('classForm.roomPlaceholder')
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>{t('classForm.day')}</Label>
              <Select
                value={String(form.dayOfWeek)}
                onValueChange={(v) => setForm({ ...form, dayOfWeek: Number(v) })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAY_NAMES.map((d, i) => (
                    <SelectItem key={d} value={String(i)}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start">{t('classForm.start')}</Label>
              <Input
                id="start"
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">{t('classForm.end')}</Label>
              <Input
                id="end"
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('classForm.colorTag')}</Label>
            <div className="flex flex-wrap gap-2">
              {CLASS_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={cn(
                    'h-8 w-8 rounded-full ring-2 ring-offset-2 transition-transform hover:scale-110',
                    form.color === c ? 'ring-primary' : 'ring-transparent'
                  )}
                  style={{ backgroundColor: c }}
                  onClick={() => setForm({ ...form, color: c })}
                  aria-pressed={form.color === c}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('classForm.recurrence')}</Label>
            <Select
              value={form.recurrence}
              onValueChange={(v) => setForm({ ...form, recurrence: v as RecurrenceType })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('classForm.doesNotRepeat')}</SelectItem>
                <SelectItem value="weekly">{t('classForm.weekly')}</SelectItem>
                <SelectItem value="biweekly">{t('classForm.biweekly')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('classForm.notes')}</Label>
            <Input
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder={t('classForm.notesPlaceholder')}
            />
          </div>

          <div className="flex gap-2 pt-2">
            {editingId && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  void deleteClass(editingId)
                  toast.success(t('classForm.classRemoved'))
                  closeClassModal()
                }}
              >
                {t('common.delete')}
              </Button>
            )}
            <Button type="button" variant="outline" className="ml-auto" onClick={closeClassModal}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t('common.loading') : editingId ? t('classForm.saveChanges') : t('classForm.addClass')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
