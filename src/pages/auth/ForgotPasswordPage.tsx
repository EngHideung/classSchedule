import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Mail, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const resetPassword = useAuthStore((s) => s.resetPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await resetPassword(email)
    setLoading(false)
    setSent(true)
    toast.success(t(result.message.startsWith('auth.') ? result.message : 'auth.resetToast'))
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <AnimatedBackground subtle />
      <div className="absolute right-4 top-4"><LanguageSwitcher compact /></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md glass-strong rounded-2xl p-8 shadow-xl">
        <Link to="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t('auth.backToLogin')}
        </Link>
        <div className="mb-8 mt-6 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold">{t('auth.resetPassword')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {sent ? t('auth.resetSent') : t('auth.resetSubtitle')}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" required className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-full rounded-xl" disabled={loading}>
              {loading ? t('auth.sending') : t('auth.sendReset')}
            </Button>
          </form>
        ) : (
          <Button className="w-full rounded-xl" asChild>
            <Link to="/login">{t('auth.returnLogin')}</Link>
          </Button>
        )}
      </motion.div>
    </div>
  )
}
