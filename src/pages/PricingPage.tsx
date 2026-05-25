import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/shared/PageTransition'

const plans = [
  {
    name: 'Student',
    price: 'Free',
    desc: 'Perfect for individual learners',
    features: ['Unlimited classes', 'Conflict detection', 'Export & share', 'Dark mode', 'Pomodoro timer'],
    cta: 'Get started',
    popular: false,
  },
  {
    name: 'Campus',
    price: 'Free',
    desc: 'For study groups & departments',
    features: ['Everything in Student', 'Shared schedules', 'Invite classmates', 'Attendance tracking', 'Priority support UI'],
    cta: 'Start free trial',
    popular: true,
  },
  {
    name: 'Institution',
    price: 'Free',
    desc: 'Schools & universities (pilot)',
    features: ['Everything in Campus', 'Bulk import', 'Admin dashboard mockup', 'Custom branding', 'SSO ready (coming)'],
    cta: 'Contact us',
    popular: false,
  },
]

export function PricingPage() {
  return (
    <PageTransition>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Simple, honest <span className="gradient-text">pricing</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            ClassFlow is built with free, open-source tools. We believe scheduling shouldn&apos;t cost students a dime.
          </p>

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
                    Most popular
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
                  <Link to="/register">{plan.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
