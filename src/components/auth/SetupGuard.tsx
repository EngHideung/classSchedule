import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

/** Redirect to class setup if user hasn't chosen kelas/angkatan yet */
export function SetupGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (user && !user.setupComplete) {
    if (location.pathname !== '/app/setup') {
      return <Navigate to="/app/setup" replace />
    }
  }

  if (user?.setupComplete && location.pathname === '/app/setup') {
    return <Navigate to="/app/dashboard" replace />
  }

  return <>{children}</>
}
