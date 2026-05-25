import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Keyboard, Sparkles } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { usePreferencesStore } from '@/stores/preferencesStore'

const steps = [
  {
    icon: Sparkles,
    title: 'Welcome to ClassFlow',
    desc: 'Your beautiful hub for classes, assignments, and focus time.',
  },
  {
    icon: Calendar,
    title: 'Manage your schedule',
    desc: 'Add classes, detect conflicts, and drag events on the calendar.',
  },
  {
    icon: Keyboard,
    title: 'Work at the speed of thought',
    desc: 'Press ⌘K for the command palette, ⌘N to add a class instantly.',
  },
]

export function OnboardingModal() {
  const complete = usePreferencesStore((s) => s.onboardingComplete)
  const setComplete = usePreferencesStore((s) => s.setOnboardingComplete)
  const [step, setStep] = useState(0)
  const open = !complete

  const Icon = steps[step].icon

  return (
    <Dialog open={open} onOpenChange={() => setComplete(true)}>
      <DialogContent className="max-w-md overflow-hidden p-0" onPointerDownOutside={(e) => e.preventDefault()}>
        <div className="relative bg-gradient-to-br from-primary/10 to-cyan-500/10 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <Icon className="h-8 w-8" />
              </div>
              <h2 className="font-display text-xl font-bold">{steps[step].title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{steps[step].desc}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex justify-center gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-primary' : 'w-1.5 bg-muted'}`} />
            ))}
          </div>
        </div>
        <div className="flex justify-between p-6">
          <Button variant="ghost" onClick={() => setComplete(true)}>Skip</Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          ) : (
            <Button onClick={() => setComplete(true)}>Get started</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
