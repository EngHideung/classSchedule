import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useLanguageStore } from '@/stores/languageStore'
import { isSupabaseConfigured } from '@/lib/supabase'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const initAuth = useAuthStore((s) => s.initAuth)
  const isInitialized = useAuthStore((s) => s.isInitialized)
  const user = useAuthStore((s) => s.user)
  const loadSchedule = useScheduleStore((s) => s.loadSchedule)
  const resetSchedule = useScheduleStore((s) => s.reset)
  const setLanguage = useLanguageStore((s) => s.setLanguage)

  useEffect(() => {
    void initAuth()
  }, [initAuth])

  useEffect(() => {
    if (user?.id && user.setupComplete && isSupabaseConfigured) {
      void loadSchedule(user.id)
    } else {
      resetSchedule()
    }
  }, [user?.id, user?.setupComplete, loadSchedule, resetSchedule])

  useEffect(() => {
    if (user?.language === 'en' || user?.language === 'id') {
      void setLanguage(user.language)
    }
  }, [user?.language, setLanguage])

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-4 text-center">
          <Skeleton className="mx-auto h-12 w-12 rounded-xl" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <h2 className="font-display text-lg font-bold text-destructive">Supabase</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t('auth.supabaseNotConfigured')}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            Copy <code className="rounded bg-muted px-1">.env.example</code> to <code className="rounded bg-muted px-1">.env</code> and add your project keys.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
