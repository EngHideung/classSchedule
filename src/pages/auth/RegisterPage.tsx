import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Sparkles, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
import type { UserRole } from '@/types'

export function RegisterPage() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('student')
  const [isAsprak, setIsAsprak] = useState(false)
  const register = useAuthStore((s) => s.register)
  const isLoading = useAuthStore((s) => s.isLoading)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error(t('auth.passwordMin'))
      return
    }
    const result = await register({ name, email, password, role, isAsprak })
    if (result.success && result.needsVerification) {
      navigate('/verify-email', { state: { email: result.email ?? email } })
    } else if (result.success) {
      toast.success(t('auth.registerToast'))
      navigate('/app/setup')
    } else {
      const msg = result.error?.startsWith('auth.') ? t(result.error) : result.error
      toast.error(msg ?? 'Error')
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <AnimatedBackground subtle />
      <div className="absolute right-4 top-4"><LanguageSwitcher compact /></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md glass-strong rounded-2xl p-8 shadow-xl">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-cyan-500 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            {t('common.appName')}
          </Link>
          <h1 className="mt-6 font-display text-2xl font-bold">{t('auth.createAccount')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('auth.registerSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('auth.fullName')}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="name" required className="pl-10" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" required className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" type="password" required minLength={6} className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('auth.iAmA')}</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="student">{t('auth.student')}</SelectItem>
                <SelectItem value="teacher">{t('auth.teacher')}</SelectItem>
                <SelectItem value="admin">{t('auth.admin')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-secondary/30 px-4 py-3">
            <div>
              <Label>{t('setup.asprakLabel')}</Label>
              <p className="text-xs text-muted-foreground">{t('setup.asprakDesc')}</p>
            </div>
            <Switch checked={isAsprak} onCheckedChange={setIsAsprak} />
          </div>
          <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
            {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">{t('auth.signIn')}</Link>
        </p>
      </motion.div>
    </div>
  )
}
