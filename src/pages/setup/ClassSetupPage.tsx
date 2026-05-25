import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Sparkles, GraduationCap, Users, BookOpen, FlaskConical,
  Monitor, MapPin, Loader2, Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { useAuthStore } from '@/stores/authStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { KELAS_OPTIONS, ANGKATAN_OPTIONS, getScheduleTemplate, getTemplatePreview } from '@/data/scheduleTemplates'
import type { KelasLetter } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function ClassSetupPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const completeClassSetup = useAuthStore((s) => s.completeClassSetup)
  const loadSchedule = useScheduleStore((s) => s.loadSchedule)

  const [kelas, setKelas] = useState<KelasLetter | null>(null)
  const [angkatan, setAngkatan] = useState<string | null>(null)
  const [isAsprak, setIsAsprak] = useState(user?.isAsprak ?? false)
  const [loading, setLoading] = useState(false)

  const preview = useMemo(() => {
    if (!kelas || !angkatan) return null
    return getTemplatePreview(kelas, angkatan)
  }, [kelas, angkatan])

  const templateItems = useMemo(() => {
    if (!kelas) return []
    return getScheduleTemplate(kelas).slice(0, 4)
  }, [kelas])

  const canSubmit = kelas && angkatan

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    const result = await completeClassSetup({ kelas, angkatan, isAsprak })
    if (result.success && user) {
      await loadSchedule(user.id)
      toast.success(t('setup.success', { kelas, angkatan }))
      navigate('/app/dashboard', { replace: true })
    } else {
      toast.error(result.error ?? t('setup.failed'))
    }
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground subtle />

      <div className="absolute right-4 top-4 z-10">
        <LanguageSwitcher compact />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-500 text-white shadow-lg">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="font-display text-3xl font-bold">{t('setup.title')}</h1>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">{t('setup.subtitle')}</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 glass-strong rounded-2xl p-6 sm:p-8 space-y-8"
          >
            {/* Kelas */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-primary" />
                {t('setup.selectKelas')}
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {KELAS_OPTIONS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKelas(k)}
                    className={cn(
                      'relative flex h-14 items-center justify-center rounded-xl border-2 font-display text-xl font-bold transition-all',
                      kelas === k
                        ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                        : 'border-border bg-card/50 hover:border-primary/50 hover:bg-secondary'
                    )}
                    aria-pressed={kelas === k}
                  >
                    {k}
                    {kelas === k && (
                      <Check className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white text-primary p-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Angkatan */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-primary" />
                {t('setup.selectAngkatan')}
              </Label>
              <div className="flex flex-wrap gap-2">
                {ANGKATAN_OPTIONS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAngkatan(a)}
                    className={cn(
                      'rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all',
                      angkatan === a
                        ? 'border-primary bg-primary text-primary-foreground shadow-md'
                        : 'border-border bg-card/50 hover:border-primary/50'
                    )}
                    aria-pressed={angkatan === a}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Asprak */}
            <div className="flex items-center justify-between rounded-xl border bg-secondary/30 p-4">
              <div>
                <Label className="text-base">{t('setup.asprakLabel')}</Label>
                <p className="text-xs text-muted-foreground mt-1">{t('setup.asprakDesc')}</p>
              </div>
              <Switch checked={isAsprak} onCheckedChange={setIsAsprak} />
            </div>

            <Button
              className="w-full rounded-xl h-12 text-base"
              disabled={!canSubmit || loading}
              onClick={() => void handleSubmit()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('setup.loading')}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {t('setup.continue')}
                </>
              )}
            </Button>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 glass rounded-2xl p-6"
          >
            <h3 className="font-display font-semibold">{t('setup.previewTitle')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t('setup.previewDesc')}</p>

            {!kelas || !angkatan ? (
              <p className="mt-8 text-sm text-muted-foreground text-center py-8">{t('setup.previewEmpty')}</p>
            ) : (
              <>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="default">Kelas {kelas}</Badge>
                  <Badge variant="secondary">{t('setup.angkatan')} {angkatan}</Badge>
                  {preview && (
                    <>
                      <Badge variant="outline">{preview.theoryCount} {t('classForm.theory')}</Badge>
                      <Badge variant="outline">{preview.practicumCount} {t('classForm.practicum')}</Badge>
                    </>
                  )}
                </div>

                <ul className="mt-6 space-y-2">
                  {templateItems.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-lg border-l-4 bg-card/60 px-3 py-2 text-xs"
                      style={{ borderLeftColor: item.color }}
                    >
                      <p className="font-semibold truncate">{item.title}</p>
                      <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-muted-foreground">
                        {item.courseType === 'theory' ? (
                          <span className="inline-flex items-center gap-0.5"><BookOpen className="h-3 w-3" /> {t('classForm.theory')}</span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5"><FlaskConical className="h-3 w-3" /> {t('classForm.practicum')}</span>
                        )}
                        {item.meetingMode === 'online' ? (
                          <span className="inline-flex items-center gap-0.5"><Monitor className="h-3 w-3" /> Online</span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5"><MapPin className="h-3 w-3" /> Offline</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                {preview && (
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    +{preview.totalSessions - 4} {t('setup.moreClasses')}
                  </p>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
