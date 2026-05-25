import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/shared/PageTransition'

export function PricingPage() {
  const { t } = useTranslation()

  const plans = [
    {
      name: t('pricing.student'),
      price: t('common.free'),
      desc: t('pricing.studentDesc'),
      features: [t('nav.features'), t('calendar.conflict'), t('settings.exportPdf')],
      popular: false,
    },
    {
      name: t('pricing.campus'),
      price: t('common.free'),
      desc: t('pricing.campusDesc'),
      features: [t('settings.copyShareLink'), t('settings.inviteFriends'), t('profile.attendance')],
      popular: true,
    },
    {
      name: t('pricing.institution'),
      price: t('common.free'),
      desc: t('pricing.institutionDesc'),
      features: [t('pricing.contactUs'), t('nav.dashboard'), t('settings.language')],
      popular: false,
    },
  ]

  return (
    <PageTransition>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            {t('pricing.title')}{' '}
            <span className="gradient-text">{t('pricing.titleHighlight')}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t('pricing.subtitle')}</p>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border p-8 text-left ${plan.popular ? 'border-primary shadow-xl shadow-primary/10 glass-strong scale-[1.02]' : 'glass'}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                    {t('pricing.mostPopular')}
                  </span>
                )}
                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
                <p className="mt-6 font-display text-4xl font-bold">{plan.price}</p>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full rounded-xl" variant={plan.popular ? 'default' : 'outline'} asChild>
                  <Link to="/register">{t('pricing.getStarted')}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
