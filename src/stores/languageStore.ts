import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setAppLanguage, type LanguageCode } from '@/i18n'
import { useAuthStore } from '@/stores/authStore'

interface LanguageState {
  language: LanguageCode
  setLanguage: (code: LanguageCode) => Promise<void>
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: async (code) => {
        await setAppLanguage(code)
        set({ language: code })
        const user = useAuthStore.getState().user
        if (user) {
          await useAuthStore.getState().updateProfile({ language: code })
        }
      },
    }),
    {
      name: 'classflow-language',
      partialize: (s) => ({ language: s.language }),
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          void setAppLanguage(state.language)
        }
      },
    }
  )
)
