import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePreferencesStore } from '@/stores/preferencesStore'
import type { ThemeMode } from '@/types'
import { cn } from '@/lib/utils'

const modes: { value: ThemeMode; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light mode' },
  { value: 'dark', icon: Moon, label: 'Dark mode' },
  { value: 'system', icon: Monitor, label: 'System theme' },
]

export function ThemeToggle({ compact }: { compact?: boolean }) {
  const theme = usePreferencesStore((s) => s.theme)
  const setTheme = usePreferencesStore((s) => s.setTheme)

  if (compact) {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(next)}
        aria-label={`Switch theme, currently ${theme}`}
      >
        <Icon className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="flex gap-1 rounded-lg bg-secondary p-1" role="group" aria-label="Theme selection">
      {modes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors',
            theme === value ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
          )}
          aria-pressed={theme === value}
          aria-label={label}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline capitalize">{value}</span>
        </button>
      ))}
    </div>
  )
}
