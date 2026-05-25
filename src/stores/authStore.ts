import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { storageGet, storageSet } from '@/lib/storage'
import { generateId } from '@/lib/utils'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: { name: string; email: string; password: string; role?: User['role'] }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>
}

const USERS_KEY = 'users'

function getUsers(): Array<User & { password: string }> {
  return storageGet(USERS_KEY, [])
}

function saveUsers(users: Array<User & { password: string }>) {
  storageSet(USERS_KEY, users)
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        await new Promise((r) => setTimeout(r, 400))
        const users = getUsers()
        const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (!found || found.password !== password) {
          return { success: false, error: 'Invalid email or password' }
        }
        const { password: _, ...user } = found
        set({ user, isAuthenticated: true })
        return { success: true }
      },

      register: async ({ name, email, password, role = 'student' }) => {
        await new Promise((r) => setTimeout(r, 500))
        const users = getUsers()
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false, error: 'An account with this email already exists' }
        }
        const newUser: User & { password: string } = {
          id: generateId(),
          email,
          name,
          role,
          password,
          createdAt: new Date().toISOString(),
        }
        saveUsers([...users, newUser])
        const { password: _, ...user } = newUser
        set({ user, isAuthenticated: true })
        return { success: true }
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: (updates) => {
        const { user } = get()
        if (!user) return
        const updated = { ...user, ...updates }
        set({ user: updated })
        const users = getUsers()
        saveUsers(
          users.map((u) =>
            u.id === user.id ? { ...u, ...updates } : u
          )
        )
      },

      resetPassword: async (email) => {
        await new Promise((r) => setTimeout(r, 600))
        const users = getUsers()
        const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
        return {
          success: true,
          message: exists
            ? 'If an account exists, a reset link has been sent to your email.'
            : 'If an account exists, a reset link has been sent to your email.',
        }
      },
    }),
    {
      name: 'classflow-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

// Seed demo account on first load
const DEMO_SEEDED = 'demo_seeded'
if (!localStorage.getItem('classflow_' + DEMO_SEEDED)) {
  const users = getUsers()
  if (users.length === 0) {
    saveUsers([
      {
        id: 'demo-user',
        email: 'demo@classflow.app',
        name: 'Alex Morgan',
        role: 'student',
        institution: 'State University',
        password: 'demo1234',
        createdAt: new Date().toISOString(),
      },
    ])
    localStorage.setItem('classflow_' + DEMO_SEEDED, 'true')
  }
}
