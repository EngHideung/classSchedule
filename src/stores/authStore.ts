import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { profileToUser } from '@/lib/supabase-mappers'
import type { User } from '@/types'
import type { DbProfile } from '@/types/database'
import type { LanguageCode } from '@/i18n'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  initAuth: () => Promise<void>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: {
    name: string
    email: string
    password: string
    role?: User['role']
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User> & { language?: LanguageCode }) => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>
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
    if (session?.user) {
      const user = await fetchProfile(session.user.id)
      set({ user, isAuthenticated: !!user, isInitialized: true })
    } else {
      set({ isInitialized: true })
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = await fetchProfile(session.user.id)
        set({ user, isAuthenticated: !!user })
      } else {
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
      return { success: false, error: error.message.includes('Invalid') ? 'auth.invalidCredentials' : error.message }
    }

    if (data.user) {
      const user = await fetchProfile(data.user.id)
      set({ user, isAuthenticated: !!user })
      return { success: true }
    }
    return { success: false, error: 'auth.invalidCredentials' }
  },

  register: async ({ name, email, password, role = 'student' }) => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'auth.supabaseNotConfigured' }
    }
    set({ isLoading: true })
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
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
      // Profile created by trigger; brief wait then fetch
      await new Promise((r) => setTimeout(r, 500))
      const user = await fetchProfile(data.user.id)
      set({ user, isAuthenticated: !!user })
      return { success: true }
    }
    return { success: false, error: 'Registration failed' }
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
