import { motion } from 'framer-motion'
import {
  Calendar, Search, Keyboard, Share2, Moon, Timer,
  BarChart3, ClipboardCheck, Sparkles, Palette, Download,
} from 'lucide-react'
import { PageTransition } from '@/components/shared/PageTransition'

const allFeatures = [
  { icon: Calendar, title: 'Multi-view calendar', desc: 'Day, week, month, and agenda views with drag-and-drop scheduling.' },
  { icon: Search, title: 'Smart search & filters', desc: 'Find any class by title, lecturer, room, or color tag instantly.' },
  { icon: Keyboard, title: 'Keyboard shortcuts', desc: 'Command palette (⌘K), quick add (⌘N), and power-user navigation.' },
  { icon: Share2, title: 'Collaboration', desc: 'Share links, invite classmates, export PDF and images.' },
  { icon: Moon, title: 'Focus mode', desc: 'Distraction-free interface when you need deep concentration.' },
  { icon: Timer, title: 'Pomodoro timer', desc: 'Built-in focus sessions with break reminders.' },
  { icon: BarChart3, title: 'Productivity stats', desc: 'Track study hours, attendance, and assignment completion.' },
  { icon: ClipboardCheck, title: 'Attendance tracker', desc: 'Log presence, absences, and late arrivals per class.' },
  { icon: Sparkles, title: 'AI study tips', desc: 'Personalized study recommendations UI (mockup).' },
  { icon: Palette, title: 'Theme customization', desc: 'Dark/light mode, accent colors, and glassmorphism UI.' },
  { icon: Download, title: 'Export anywhere', desc: 'PDF, image, and public share links for your schedule.' },
]

const heuristics = [
  'Visibility of system status — toasts, badges, loading skeletons',
  'Match with real world — familiar calendar metaphors',
  'User control — undo-friendly edits, easy delete',
  'Consistency — unified design system throughout',
  'Error prevention — conflict detection before save',
  'Recognition over recall — visual color tags & icons',
  'Flexibility — shortcuts + FAB + command palette',
  'Minimalist design — focused layouts, ample whitespace',
  'Error recovery — clear conflict messages with details',
  'Help — FAQ, tooltips, onboarding tour',
]

export function FeaturesPage() {
  return (
    <PageTransition>
      <div className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="font-display text-4xl font-bold sm:text-5xl">
              Everything you need to <span className="gradient-text">master your schedule</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              ClassFlow combines premium SaaS aesthetics with academic scheduling tools that actually respect your time.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group glass rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <f.icon className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                <h3 className="mt-4 font-display font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <section className="mt-24 rounded-2xl border bg-secondary/30 p-8 lg:p-12">
            <h2 className="font-display text-2xl font-bold">Nielsen&apos;s 10 Usability Heuristics</h2>
            <p className="mt-2 text-muted-foreground">Every interaction in ClassFlow is designed against these principles.</p>
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
