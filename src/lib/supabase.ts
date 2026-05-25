import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

/** True only when real URL + anon key exist (not empty, not placeholder) */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co') &&
    supabaseAnonKey.length > 20 &&
    !supabaseAnonKey.includes('your-anon-key')
)

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.error(
    '[ClassFlow] Supabase not configured.\n' +
      '1. Copy .env.example → .env\n' +
      '2. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from Dashboard → Project Settings → API\n' +
      '3. Restart: npm run dev'
  )
}

/** App origin for auth email links (must match Supabase Redirect URLs) */
export function getAuthRedirectUrl(path = '/login'): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`
  }
  return import.meta.env.VITE_APP_URL?.trim() || 'http://localhost:5173/login'
}

function createSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and restart the dev server.'
    )
  }

  return createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: {
        apikey: supabaseAnonKey!,
        Authorization: `Bearer ${supabaseAnonKey!}`,
      },
    },
  })
}

export const supabase = isSupabaseConfigured
  ? createSupabaseClient()
  : (null as unknown as SupabaseClient)

export function getSupabase(): SupabaseClient {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('auth.supabaseNotConfigured')
  }
  return supabase
}
