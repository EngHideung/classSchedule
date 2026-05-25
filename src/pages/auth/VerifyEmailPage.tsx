import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, Sparkles, RefreshCw, CheckCircle2, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

export function VerifyEmailPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const resendVerificationEmail = useAuthStore((s) => s.resendVerificationEmail)
  const [resending, setResending] = useState(false)

  const email =
    (location.state as { email?: string } | null)?.email ??
    new URLSearchParams(location.search).get('email') ??
    ''

  const handleResend = async () => {
    if (!email) {
      toast.error(t('verify.noEmail'))
      return
    }
    setResending(true)
    const result = await resendVerificationEmail(email)
    setResending(false)
    if (result.success) {
      toast.success(t('verify.resendSuccess'))
    } else {
      toast.error(result.error ?? t('verify.resendFailed'))
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <AnimatedBackground subtle />
      <div className="absolute right-4 top-4">
        <LanguageSwitcher compact />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg glass-strong rounded-2xl p-8 shadow-xl"
      >
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/20">
            <Inbox className="h-10 w-10 text-primary" />
          </div>

          <Link to="/" className="inline-flex items-center gap-2 font-display text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-cyan-500 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            {t('common.appName')}
          </Link>

          <h1 className="mt-6 font-display text-2xl font-bold">{t('verify.title')}</h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t('verify.subtitle')}</p>

          {email && (
            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border bg-secondary/50 px-4 py-3">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium break-all">{email}</span>
            </div>
          )}
        </div>

        <ol className="mt-8 space-y-4">
          {[1, 2, 3].map((step) => (
            <li key={step} className="flex gap-3 text-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {step}
              </span>
              <span className="pt-0.5 text-muted-foreground">{t(`verify.step${step}`)}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 space-y-3">
          <Button className="w-full rounded-xl" onClick={() => void handleResend()} disabled={resending || !email}>
            <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
            {resending ? t('verify.resending') : t('verify.resend')}
          </Button>

          <Button variant="outline" className="w-full rounded-xl" asChild>
            <Link to="/login">
              <CheckCircle2 className="h-4 w-4" />
              {t('verify.alreadyVerified')}
            </Link>
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t('verify.checkSpam')}{' '}
          <button type="button" className="text-primary hover:underline" onClick={() => navigate('/register')}>
            {t('verify.wrongEmail')}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
