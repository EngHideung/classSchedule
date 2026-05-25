import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AccentColor, ThemeMode, UserPreferences } from '@/types'

interface PreferencesState extends UserPreferences {
  pomodoroMinutes: number
  pomodoroBreak: number
  pomodoroRunning: boolean
  pomodoroTimeLeft: number
  setTheme: (theme: ThemeMode) => void
  setAccent: (accent: AccentColor) => void
  setOnboardingComplete: (v: boolean) => void
  setFocusMode: (v: boolean) => void
  setNotificationsEnabled: (v: boolean) => void
  setPomodoroMinutes: (m: number) => void
  setPomodoroBreak: (m: number) => void
  startPomodoro: () => void
  pausePomodoro: () => void
  resetPomodoro: () => void
  tickPomodoro: () => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      accent: 'indigo',
      onboardingComplete: false,
      focusMode: false,
      notificationsEnabled: true,
      pomodoroMinutes: 25,
      pomodoroBreak: 5,
      pomodoroRunning: false,
      pomodoroTimeLeft: 25 * 60,

      setTheme: (theme) => set({ theme }),
      setAccent: (accent) => set({ accent }),
      setOnboardingComplete: (v) => set({ onboardingComplete: v }),
      setFocusMode: (v) => set({ focusMode: v }),
      setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
      setPomodoroMinutes: (m) =>
        set({ pomodoroMinutes: m, pomodoroTimeLeft: m * 60 }),
      setPomodoroBreak: (m) => set({ pomodoroBreak: m }),
      startPomodoro: () => set({ pomodoroRunning: true }),
      pausePomodoro: () => set({ pomodoroRunning: false }),
      resetPomodoro: () => {
        const { pomodoroMinutes } = get()
        set({ pomodoroRunning: false, pomodoroTimeLeft: pomodoroMinutes * 60 })
      },
      tickPomodoro: () => {
        const { pomodoroTimeLeft, pomodoroRunning } = get()
        if (!pomodoroRunning || pomodoroTimeLeft <= 0) return
        set({ pomodoroTimeLeft: pomodoroTimeLeft - 1 })
      },
    }),
    {
      name: 'classflow-preferences',
      partialize: (s) => ({
        theme: s.theme,
        accent: s.accent,
        onboardingComplete: s.onboardingComplete,
        focusMode: s.focusMode,
        notificationsEnabled: s.notificationsEnabled,
        pomodoroMinutes: s.pomodoroMinutes,
        pomodoroBreak: s.pomodoroBreak,
      }),
    }
  )
)
