import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { LogOut, Mail, Building2, ClipboardCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { PageTransition } from '@/components/shared/PageTransition'
import { useAuthStore } from '@/stores/authStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useNavigate } from 'react-router-dom'

export function ProfilePage() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const logout = useAuthStore((s) => s.logout)
  const classes = useScheduleStore((s) => s.classes)
  const assignments = useScheduleStore((s) => s.assignments)
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name ?? '')
  const [institution, setInstitution] = useState(user?.institution ?? '')

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'
  const attendanceRate = 87
  const completed = assignments.filter((a) => a.completed).length

  const handleSave = async () => {
    await updateProfile({ name, institution })
    toast.success(t('profile.profileUpdated'))
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-display text-2xl font-bold">{t('profile.title')}</h1>

        <Card className="glass overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary to-cyan-500" />
          <CardContent className="relative pt-0">
            <Avatar className="-mt-12 h-24 w-24 border-4 border-background ring-2 ring-primary/20">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="mt-4">
              <h2 className="font-display text-xl font-bold">{user?.name}</h2>
              <Badge className="mt-1 capitalize">{user?.role}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">{t('profile.accountDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('profile.displayName')}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t('auth.email')}</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" /> {user?.email}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">{t('profile.institution')}</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="institution" className="pl-10" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder={t('profile.institutionPlaceholder')} />
              </div>
            </div>
            <Button onClick={() => void handleSave()}>{t('profile.saveChanges')}</Button>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" /> {t('profile.attendance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span>{t('profile.overallAttendance')}</span>
              <span className="font-semibold">{attendanceRate}%</span>
            </div>
            <Progress value={attendanceRate} className="mt-3" />
            <p className="mt-4 text-xs text-muted-foreground">
              {t('profile.tracking', { classes: classes.length, completed, total: assignments.length })}
            </p>
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full" onClick={() => void handleLogout()}>
          <LogOut className="h-4 w-4" /> {t('auth.signOut')}
        </Button>
      </div>
    </PageTransition>
  )
}
