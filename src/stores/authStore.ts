import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { profileToUser } from '@/lib/supabase-mappers'
import type { ClassSetupInput, User } from '@/types'
import type { DbProfile } from '@/types/database'
import type { LanguageCode } from '@/i18n'
import { seedTemplateForKelas } from '@/services/scheduleService'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  initAuth: () => Promise<void>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>
  register: (data: {
    name: string
    email: string
    password: string
    role?: User['role']
    isAsprak?: boolean
  }) => Promise<{ success: boolean; error?: string; needsVerification?: boolean; email?: string }>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User> & { language?: LanguageCode }) => Promise<void>
  completeClassSetup: (input: ClassSetupInput) => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; error?: string }>
}

async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return profileToUser(data as DbProfile)
}

function isEmailNotConfirmed(error: { message?: string } | null): boolean {
  const msg = error?.message?.toLowerCase() ?? ''
  return msg.includes('email not confirmed') || msg.includes('email_not_confirmed')
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  initAuth: async () => {
    if (!isSupabaseConfigured) {
      set({ isInitialized: true })
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user?.email_confirmed_at) {
      const user = await fetchProfile(session.user.id)
      set({ user, isAuthenticated: !!user, isInitialized: true })
    } else {
      set({ isInitialized: true })
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email_confirmed_at) {
        const user = await fetchProfile(session.user.id)
        set({ user, isAuthenticated: !!user })
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, isAuthenticated: false })
      }
    })
  },

  login: async (email, password) => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'auth.supabaseNotConfigured' }
    }
    set({ isLoading: true })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    set({ isLoading: false })

    if (error) {
      if (isEmailNotConfirmed(error)) {
        return { success: false, needsVerification: true, error: 'auth.emailNotConfirmed' }
      }
      return { success: false, error: error.message.includes('Invalid') ? 'auth.invalidCredentials' : error.message }
    }

    if (data.user && !data.user.email_confirmed_at) {
      return { success: false, needsVerification: true, error: 'auth.emailNotConfirmed' }
    }

    if (data.user) {
      const user = await fetchProfile(data.user.id)
      set({ user, isAuthenticated: !!user })
      return { success: true }
    }
    return { success: false, error: 'auth.invalidCredentials' }
  },

  register: async ({ name, email, password, role = 'student', isAsprak = false }) => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'auth.supabaseNotConfigured' }
    }
    set({ isLoading: true })
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role, is_asprak: isAsprak },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })
    set({ isLoading: false })

    if (error) {
      const msg =
        error.message.includes('already') || error.message.includes('registered')
          ? 'auth.emailExists'
          : error.message
      return { success: false, error: msg }
    }

    if (data.user) {
      await supabase.from('profiles').update({ is_asprak: isAsprak }).eq('id', data.user.id)

      // Supabase: no session until email confirmed
      if (!data.session) {
        return { success: true, needsVerification: true, email }
      }

      await new Promise((r) => setTimeout(r, 500))
      const user = await fetchProfile(data.user.id)
      set({ user, isAuthenticated: !!user })
      return { success: true }
    }
    return { success: false, error: 'Registration failed' }
  },

  resendVerificationEmail: async (email) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/login` },
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  },

  completeClassSetup: async ({ kelas, angkatan, isAsprak }) => {
    const { user } = get()
    if (!user) return { success: false, error: 'Not authenticated' }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        kelas,
        angkatan,
        setup_complete: true,
        is_asprak: isAsprak ?? user.isAsprak,
      })
      .eq('id', user.id)
      .select()
      .single()

    if (profileError) return { success: false, error: profileError.message }

    try {
      await seedTemplateForKelas(user.id, kelas, angkatan)
    } catch (e) {
      console.error(e)
      return { success: false, error: 'Failed to load schedule template' }
    }

    const updated = await fetchProfile(user.id)
    if (updated) set({ user: updated })
    return { success: true }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, isAuthenticated: false })
  },

  updateProfile: async (updates) => {
    const { user } = get()
    if (!user) return

    const dbUpdates: Record<string, unknown> = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.institution !== undefined) dbUpdates.institution = updates.institution
    if (updates.role !== undefined) dbUpdates.role = updates.role
    if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar
    if (updates.language !== undefined) dbUpdates.language = updates.language
    if (updates.kelas !== undefined) dbUpdates.kelas = updates.kelas
    if (updates.angkatan !== undefined) dbUpdates.angkatan = updates.angkatan
    if (updates.isAsprak !== undefined) dbUpdates.is_asprak = updates.isAsprak

    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      set({ user: profileToUser(data as DbProfile) })
    } else {
      set({ user: { ...user, ...updates } })
    }
  },

  resetPassword: async (email) => {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'auth.supabaseNotConfigured' }
    }
    const redirectTo = `${window.location.origin}/login`
    await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    return { success: true, message: 'auth.resetToast' }
  },
}))
