import { Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { usePreferencesStore } from '@/stores/preferencesStore'

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function PomodoroWidget() {
  const pomodoroTimeLeft = usePreferencesStore((s) => s.pomodoroTimeLeft)
  const pomodoroMinutes = usePreferencesStore((s) => s.pomodoroMinutes)
  const pomodoroRunning = usePreferencesStore((s) => s.pomodoroRunning)
  const startPomodoro = usePreferencesStore((s) => s.startPomodoro)
  const pausePomodoro = usePreferencesStore((s) => s.pausePomodoro)
  const resetPomodoro = usePreferencesStore((s) => s.resetPomodoro)

  const total = pomodoroMinutes * 60
  const progress = ((total - pomodoroTimeLeft) / total) * 100

  return (
    <div className="flex flex-col items-center">
      <p className="font-display text-4xl font-bold tabular-nums tracking-tight">
        {formatTime(pomodoroTimeLeft)}
      </p>
      <Progress value={progress} className="mt-4 h-2 w-full" />
      <div className="mt-4 flex gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => (pomodoroRunning ? pausePomodoro() : startPomodoro())}
          aria-label={pomodoroRunning ? 'Pause timer' : 'Start timer'}
        >
          {pomodoroRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button size="icon" variant="ghost" onClick={resetPomodoro} aria-label="Reset timer">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
