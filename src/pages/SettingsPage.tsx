import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { Download, Share2, Palette, Bell, Focus, UserPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageTransition } from '@/components/shared/PageTransition'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { usePreferencesStore } from '@/stores/preferencesStore'

export function SettingsPage() {
  const { t } = useTranslation()
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
          <h1 className="font-display text-2xl font-bold">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.subtitle')}</p>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" /> {t('settings.language')}
            </CardTitle>
            <CardDescription>{t('settings.languageDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <LanguageSwitcher />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" /> {t('settings.appearance')}
            </CardTitle>
            <CardDescription>{t('settings.appearanceDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>{t('settings.theme')}</Label>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Focus className="h-4 w-4" /> {t('settings.focusProductivity')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('settings.focusMode')}</Label>
                <p className="text-xs text-muted-foreground">{t('settings.focusModeDesc')}</p>
              </div>
              <Switch checked={focusMode} onCheckedChange={setFocusMode} />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.pomodoroDuration')}</Label>
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
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" /> {t('settings.notifications')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label>{t('settings.enableReminders')}</Label>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">{t('settings.collaboration')}</CardTitle>
            <CardDescription>{t('settings.collaborationDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.success(t('settings.shareCopied'))}>
              <Share2 className="h-4 w-4" /> {t('settings.copyShareLink')}
            </Button>
            <Button variant="outline" onClick={() => toast.success(t('settings.pdfExported'))}>
              <Download className="h-4 w-4" /> {t('settings.exportPdf')}
            </Button>
            <Button variant="outline" onClick={() => toast.success(t('settings.imageExported'))}>
              <Download className="h-4 w-4" /> {t('settings.exportImage')}
            </Button>
            <Button variant="outline" onClick={() => toast.info(t('settings.inviteCopied'))}>
              <UserPlus className="h-4 w-4" /> {t('settings.inviteFriends')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
