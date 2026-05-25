import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Calendar, Search, Keyboard, Share2, Moon, Timer,
  BarChart3, ClipboardCheck, Sparkles, Palette, Download,
} from 'lucide-react'
import { PageTransition } from '@/components/shared/PageTransition'

export function FeaturesPage() {
  const { t } = useTranslation()

  const allFeatures = [
    { icon: Calendar, titleKey: 'calendar.title', desc: 'Multi-view calendar' },
    { icon: Search, titleKey: 'layout.searchLabel', desc: 'Smart search' },
    { icon: Keyboard, titleKey: 'onboarding.shortcuts', desc: 'Keyboard shortcuts' },
    { icon: Share2, titleKey: 'settings.copyShareLink', desc: 'Collaboration' },
    { icon: Moon, titleKey: 'settings.focusMode', desc: 'Focus mode' },
    { icon: Timer, titleKey: 'dashboard.pomodoro', desc: 'Pomodoro' },
    { icon: BarChart3, titleKey: 'dashboard.weeklyHours', desc: 'Stats' },
    { icon: ClipboardCheck, titleKey: 'profile.attendance', desc: 'Attendance' },
    { icon: Sparkles, titleKey: 'dashboard.aiStudyTip', desc: 'AI tips' },
    { icon: Palette, titleKey: 'settings.appearance', desc: 'Themes' },
    { icon: Download, titleKey: 'settings.exportPdf', desc: 'Export' },
  ]

  const heuristics = [
    t('landing.featuresSubtitle'),
    t('faq.a3'),
    t('classForm.conflictError'),
  ]

  return (
    <PageTransition>
      <div className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="font-display text-4xl font-bold sm:text-5xl">
              {t('features.title')}{' '}
              <span className="gradient-text">{t('features.titleHighlight')}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t('features.subtitle')}</p>
          </motion.div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allFeatures.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group glass rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <f.icon className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                <h3 className="mt-4 font-display font-semibold">{t(f.titleKey)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <section className="mt-24 rounded-2xl border bg-secondary/30 p-8 lg:p-12">
            <h2 className="font-display text-2xl font-bold">{t('features.heuristicsTitle')}</h2>
            <p className="mt-2 text-muted-foreground">{t('features.heuristicsSubtitle')}</p>
            <ol className="mt-8 grid gap-3 sm:grid-cols-2">
              {heuristics.map((h, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                  {h}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </PageTransition>
  )
}
