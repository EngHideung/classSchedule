import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUIStore } from '@/stores/uiStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useAuthStore } from '@/stores/authStore'
import { CLASS_COLORS } from '@/data/sample'
import { DAY_NAMES } from '@/lib/schedule'
import type { RecurrenceType } from '@/types'
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
}

export function ClassFormModal() {
  const open = useUIStore((s) => s.classModalOpen)
  const editingId = useUIStore((s) => s.editingClassId)
  const closeClassModal = useUIStore((s) => s.closeClassModal)
  const classes = useScheduleStore((s) => s.classes)
  const addClass = useScheduleStore((s) => s.addClass)
  const updateClass = useScheduleStore((s) => s.updateClass)
  const deleteClass = useScheduleStore((s) => s.deleteClass)
  const user = useAuthStore((s) => s.user)

  const [form, setForm] = useState(defaultForm)

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
        })
      }
    } else {
      setForm(defaultForm)
    }
  }, [editingId, classes, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const payload = { ...form, userId: user.id }

    if (editingId) {
      const result = updateClass(editingId, payload)
      if (!result.success) {
        toast.error('Schedule conflict detected', {
          description: `Overlaps with ${result.conflicts?.map((c) => c.title).join(', ')}`,
        })
        return
      }
      toast.success('Class updated')
    } else {
      const result = addClass(payload)
      if (!result.success) {
        toast.error('Schedule conflict detected', {
          description: `Overlaps with ${result.conflicts?.map((c) => c.title).join(', ')}`,
        })
        return
      }
      toast.success('Class added to your schedule')
    }
    closeClassModal()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && closeClassModal()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingId ? 'Edit class' : 'Add new class'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Class name</Label>
            <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Advanced Algorithms" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="lecturer">Lecturer</Label>
              <Input id="lecturer" value={form.lecturer} onChange={(e) => setForm({ ...form, lecturer: e.target.value })} placeholder="Dr. Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input id="room" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="Hall B · 204" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Day</Label>
              <Select value={String(form.dayOfWeek)} onValueChange={(v) => setForm({ ...form, dayOfWeek: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAY_NAMES.map((d, i) => (
                    <SelectItem key={d} value={String(i)}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start">Start</Label>
              <Input id="start" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End</Label>
              <Input id="end" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Color tag</Label>
            <div className="flex flex-wrap gap-2">
              {CLASS_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={cn('h-8 w-8 rounded-full ring-2 ring-offset-2 transition-transform hover:scale-110', form.color === c ? 'ring-primary' : 'ring-transparent')}
                  style={{ backgroundColor: c }}
                  onClick={() => setForm({ ...form, color: c })}
                  aria-label={`Select color ${c}`}
                  aria-pressed={form.color === c}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Recurrence</Label>
            <Select value={form.recurrence} onValueChange={(v) => setForm({ ...form, recurrence: v as RecurrenceType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Does not repeat</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Biweekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
          </div>
          <div className="flex gap-2 pt-2">
            {editingId && (
              <Button type="button" variant="destructive" onClick={() => { deleteClass(editingId); toast.success('Class removed'); closeClassModal() }}>
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" className="ml-auto" onClick={closeClassModal}>Cancel</Button>
            <Button type="submit">{editingId ? 'Save changes' : 'Add class'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
