import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  classModalOpen: boolean
  editingClassId: string | null
  calendarView: 'day' | 'week' | 'month' | 'agenda'
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
  openClassModal: (id?: string) => void
  closeClassModal: () => void
  setCalendarView: (view: UIState['calendarView']) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  classModalOpen: false,
  editingClassId: null,
  calendarView: 'week',

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  openClassModal: (id) => set({ classModalOpen: true, editingClassId: id ?? null }),
  closeClassModal: () => set({ classModalOpen: false, editingClassId: null }),
  setCalendarView: (view) => set({ calendarView: view }),
}))
