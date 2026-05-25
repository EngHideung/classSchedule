import { Link, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

export function MarketingLayout() {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const navLinks = [
    { to: '/features', label: t('nav.features') },
    { to: '/pricing', label: t('nav.pricing') },
  ]

  return (
    <div className="relative min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/50 glass">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-cyan-500 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            {t('common.appName')}
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher compact />
            <ThemeToggle compact />
            {isAuthenticated ? (
              <Button asChild><Link to="/app/dashboard">{t('nav.dashboard')}</Link></Button>
            ) : (
              <>
                <Button variant="ghost" asChild><Link to="/login">{t('nav.login')}</Link></Button>
                <Button asChild><Link to="/register">{t('nav.register')}</Link></Button>
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
              <LanguageSwitcher compact />
              <ThemeToggle compact />
              <Button className="flex-1" asChild>
                <Link to={isAuthenticated ? '/app/dashboard' : '/register'}>{t('nav.register')}</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </header>

      <main><Outlet /></main>

      <footer className="border-t bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link to="/" className="font-display text-lg font-bold">{t('common.appName')}</Link>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t('landing.footerDesc')}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">{t('nav.product')}</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground">{t('nav.features')}</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground">{t('nav.pricing')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">{t('nav.account')}</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/login" className="hover:text-foreground">{t('nav.login')}</Link></li>
                <li><Link to="/register" className="hover:text-foreground">{t('nav.register')}</Link></li>
              </ul>
            </div>
          </div>
          <p className="mt-10 border-t pt-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} ClassFlow.
          </p>
        </div>
      </footer>
    </div>
  )
}
