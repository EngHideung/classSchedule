import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '@/stores/uiStore'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const openClassModal = useUIStore((s) => s.openClassModal)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey

      if (meta && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      if (meta && e.key === 'n') {
        e.preventDefault()
        openClassModal()
      }
      if (meta && e.key === 'd') {
        e.preventDefault()
        navigate('/app/dashboard')
      }
      if (meta && e.key === 'c') {
        e.preventDefault()
        navigate('/app/calendar')
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate, setCommandPaletteOpen, openClassModal])
}
