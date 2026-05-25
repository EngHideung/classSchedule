import { toast } from 'sonner'
import { Download, Share2, Palette, Bell, Focus, UserPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageTransition } from '@/components/shared/PageTransition'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { usePreferencesStore } from '@/stores/preferencesStore'
import type { AccentColor } from '@/types'

const accents: { value: AccentColor; label: string; color: string }[] = [
  { value: 'indigo', label: 'Indigo', color: '#6366f1' },
  { value: 'cyan', label: 'Cyan', color: '#06b6d4' },
  { value: 'purple', label: 'Purple', color: '#8b5cf6' },
  { value: 'emerald', label: 'Emerald', color: '#10b981' },
]

export function SettingsPage() {
  const accent = usePreferencesStore((s) => s.accent)
  const setAccent = usePreferencesStore((s) => s.setAccent)
  const focusMode = usePreferencesStore((s) => s.focusMode)
  const setFocusMode = usePreferencesStore((s) => s.setFocusMode)
  const notificationsEnabled = usePreferencesStore((s) => s.notificationsEnabled)
  const setNotificationsEnabled = usePreferencesStore((s) => s.setNotificationsEnabled)
  const pomodoroMinutes = usePreferencesStore((s) => s.pomodoroMinutes)
  const setPomodoroMinutes = usePreferencesStore((s) => s.setPomodoroMinutes)

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your ClassFlow experience</p>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Palette className="h-4 w-4" /> Appearance</CardTitle>
            <CardDescription>Theme and accent colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <ThemeToggle />
            </div>
            <div className="space-y-2">
              <Label>Accent color</Label>
              <div className="flex gap-2">
                {accents.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    className={`h-10 w-10 rounded-full ring-2 ring-offset-2 transition-transform hover:scale-110 ${accent === a.value ? 'ring-primary' : 'ring-transparent'}`}
                    style={{ backgroundColor: a.color }}
                    onClick={() => setAccent(a.value)}
                    aria-label={a.label}
                    aria-pressed={accent === a.value}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Focus className="h-4 w-4" /> Focus & productivity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Focus mode</Label>
                <p className="text-xs text-muted-foreground">Minimal distractions in the app shell</p>
              </div>
              <Switch checked={focusMode} onCheckedChange={setFocusMode} aria-label="Toggle focus mode" />
            </div>
            <div className="space-y-2">
              <Label>Pomodoro duration (minutes)</Label>
              <Select value={String(pomodoroMinutes)} onValueChange={(v) => setPomodoroMinutes(Number(v))}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="45">45</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Bell className="h-4 w-4" /> Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label>Enable reminders</Label>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Collaboration & export</CardTitle>
            <CardDescription>Share and export your schedule</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.success('Public share link copied!')}>
              <Share2 className="h-4 w-4" /> Copy share link
            </Button>
            <Button variant="outline" onClick={() => toast.success('Schedule exported as PDF')}>
              <Download className="h-4 w-4" /> Export PDF
            </Button>
            <Button variant="outline" onClick={() => toast.success('Schedule exported as PNG')}>
              <Download className="h-4 w-4" /> Export image
            </Button>
            <Button variant="outline" onClick={() => toast.info('Invite link copied — share with classmates')}>
              <UserPlus className="h-4 w-4" /> Invite friends
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
