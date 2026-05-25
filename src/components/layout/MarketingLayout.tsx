import { Link, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
]

export function MarketingLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <div className="relative min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/50 glass">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-cyan-500 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            ClassFlow
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle compact />
            {isAuthenticated ? (
              <Button asChild><Link to="/app/dashboard">Dashboard</Link></Button>
            ) : (
              <>
                <Button variant="ghost" asChild><Link to="/login">Log in</Link></Button>
                <Button asChild><Link to="/register">Get started</Link></Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden rounded-lg p-2 hover:bg-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <motion.div
          initial={false}
          animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
          className={cn('overflow-hidden border-t md:hidden', !mobileOpen && 'pointer-events-none')}
        >
          <div className="flex flex-col gap-2 p-4">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-lg px-3 py-2 hover:bg-secondary" onClick={() => setMobileOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <ThemeToggle compact />
              <Button className="flex-1" asChild><Link to={isAuthenticated ? '/app/dashboard' : '/register'}>Get started</Link></Button>
            </div>
          </div>
        </motion.div>
      </header>

      <main><Outlet /></main>

      <footer className="border-t bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link to="/" className="font-display text-lg font-bold">ClassFlow</Link>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                Beautiful class scheduling for students, teachers, schools, and communities. Built with care and accessibility in mind.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Account</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/login" className="hover:text-foreground">Log in</Link></li>
                <li><Link to="/register" className="hover:text-foreground">Register</Link></li>
              </ul>
            </div>
          </div>
          <p className="mt-10 border-t pt-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} ClassFlow. Open source. Built for learning communities worldwide.
          </p>
        </div>
      </footer>
    </div>
  )
}
