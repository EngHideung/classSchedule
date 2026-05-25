import { useEffect } from 'react'
import { toast } from 'sonner'
import { usePreferencesStore } from '@/stores/preferencesStore'

export function usePomodoro() {
  const pomodoroRunning = usePreferencesStore((s) => s.pomodoroRunning)
  const tickPomodoro = usePreferencesStore((s) => s.tickPomodoro)
  const pomodoroTimeLeft = usePreferencesStore((s) => s.pomodoroTimeLeft)
  const pausePomodoro = usePreferencesStore((s) => s.pausePomodoro)

  useEffect(() => {
    if (!pomodoroRunning) return
    const id = setInterval(() => {
      tickPomodoro()
    }, 1000)
    return () => clearInterval(id)
  }, [pomodoroRunning, tickPomodoro])

  useEffect(() => {
    if (pomodoroTimeLeft === 0 && pomodoroRunning) {
      pausePomodoro()
      toast.success('Pomodoro complete! Take a well-deserved break.')
    }
  }, [pomodoroTimeLeft, pomodoroRunning, pausePomodoro])
}
