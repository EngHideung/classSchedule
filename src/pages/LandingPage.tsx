import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Calendar, Zap, Users, Shield, Star, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { TESTIMONIALS } from '@/data/sample'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

const stagger = { animate: { transition: { staggerChildren: 0.08 } } }
const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } }

export function LandingPage() {
  const { t } = useTranslation()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const features = useMemo(
    () => [
      { icon: Calendar, title: t('landing.smartScheduling'), desc: t('landing.smartSchedulingDesc') },
      { icon: Zap, title: t('landing.conflictDetection'), desc: t('landing.conflictDetectionDesc') },
      { icon: Users, title: t('landing.collaboration'), desc: t('landing.collaborationDesc') },
      { icon: Shield, title: t('landing.privateSecure'), desc: t('landing.privateSecureDesc') },
    ],
    [t]
  )

  const faqItems = useMemo(
    () => [
      { q: t('faq.q1'), a: t('faq.a1') },
      { q: t('faq.q2'), a: t('faq.a2') },
      { q: t('faq.q3'), a: t('faq.a3') },
      { q: t('faq.q4'), a: t('faq.a4') },
    ],
    [t]
  )

  return (
    <div className="relative overflow-hidden">
      <AnimatedBackground />

      <section className="relative px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <motion.div variants={stagger} initial="initial" animate="animate" className="text-center">
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card/60 px-4 py-1.5 text-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              {t('landing.badge')}
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-4xl font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              {t('landing.heroTitle')}{' '}
              <span className="gradient-text">{t('landing.heroHighlight')}</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-balance">
              {t('landing.heroSubtitle')}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="rounded-xl px-8" asChild>
                <Link to="/register">{t('nav.register')} <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl" asChild>
                <Link to="/features">{t('landing.exploreFeatures')}</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="relative mx-auto mt-16 max-w-5xl"
          >
            <div className="glass-strong rounded-2xl border p-2 shadow-2xl shadow-primary/10">
              <div className="rounded-xl bg-gradient-to-br from-background to-secondary/50 p-6 sm:p-8">
                <div className="mb-4 flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <div className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {['Mon', 'Tue', 'Wed'].map((day, i) => (
                    <div key={day} className="rounded-xl border bg-card/80 p-4">
                      <p className="text-xs font-medium text-muted-foreground">{day}</p>
                      <div className="mt-3 space-y-2">
                        <div className="h-12 rounded-lg bg-indigo-500/20 border-l-4 border-indigo-500 px-2 py-1 text-xs font-medium">Algorithms · 9:00</div>
                        {i === 0 && <div className="h-12 rounded-lg bg-cyan-500/20 border-l-4 border-cyan-500 px-2 py-1 text-xs font-medium">HCI · 13:00</div>}
                        {i === 1 && <div className="h-12 rounded-lg bg-purple-500/20 border-l-4 border-purple-500 px-2 py-1 text-xs font-medium">DB · 10:00</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative border-t bg-secondary/20 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-center text-3xl font-bold sm:text-4xl">{t('landing.featuresTitle')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">{t('landing.featuresSubtitle')}</p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-center text-3xl font-bold">{t('landing.testimonialsTitle')}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{item.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-secondary/20 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-center text-3xl font-bold">{t('landing.faqTitle')}</h2>
          <div className="mt-10 space-y-2">
            {faqItems.map((item, i) => (
              <div key={item.q} className="glass rounded-xl overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-4 text-left font-medium"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  {item.q}
                  <ChevronDown className={cn('h-4 w-4 transition-transform', openFaq === i && 'rotate-180')} />
                </button>
                {openFaq === i && (
                  <motion.p initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-5 pb-4 text-sm text-muted-foreground">
                    {item.a}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-primary to-cyan-600 p-12 text-center text-white shadow-2xl">
          <h2 className="font-display text-3xl font-bold">{t('landing.ctaTitle')}</h2>
          <p className="mt-4 text-white/80">{t('landing.ctaSubtitle')}</p>
          <Button size="lg" variant="secondary" className="mt-8 rounded-xl" asChild>
            <Link to="/register">{t('landing.createFree')}</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
