import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

/**
 * Handles email confirmation redirects from Gmail/Supabase.
 * Supabase appends tokens to the redirect URL — we exchange them for a session here.
 */
export function AuthCallbackPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const initAuth = useAuthStore((s) => s.initAuth)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      if (!isSupabaseConfigured) {
        setStatus('error')
        setMessage(t('auth.supabaseNotConfigured'))
        return
      }

      try {
        const client = getSupabase()

        // PKCE / magic link: code in query string
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (code) {
          const { error } = await client.auth.exchangeCodeForSession(code)
          if (error) throw error
        } else {
          // Implicit flow: tokens in hash (detectSessionInUrl handles this)
          const { data: { session }, error } = await client.auth.getSession()
          if (error) throw error
          if (!session) {
            // Give detectSessionInUrl a moment
            await new Promise((r) => setTimeout(r, 800))
            const { data: { session: s2 }, error: e2 } = await client.auth.getSession()
            if (e2) throw e2
            if (!s2) throw new Error(t('auth.callbackNoSession'))
          }
        }

        await initAuth()
        const user = useAuthStore.getState().user

        setStatus('success')
        setMessage(t('auth.callbackSuccess'))

        setTimeout(() => {
          navigate(user?.setupComplete ? '/app/dashboard' : '/app/setup', { replace: true })
        }, 1500)
      } catch (err) {
        console.error('[ClassFlow] auth callback:', err)
        setStatus('error')
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.toLowerCase().includes('api key') || msg.toLowerCase().includes('apikey')) {
          setMessage(t('auth.apiKeyError'))
        } else {
          setMessage(msg)
        }
      }
    }

    void handleCallback()
  }, [initAuth, navigate, t])

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <AnimatedBackground subtle />
      <div className="glass-strong rounded-2xl p-8 text-center max-w-md w-full">
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 font-medium">{t('auth.callbackLoading')}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <p className="mt-4 font-medium">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <p className="mt-4 text-sm text-muted-foreground">{message}</p>
            <Button className="mt-6 w-full" asChild>
              <Link to="/login">{t('auth.signIn')}</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
