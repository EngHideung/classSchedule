import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Command } from 'cmdk'
import {
  Calendar, LayoutDashboard, Plus, Search, Settings,
  User, Moon, HelpCircle, Download, Share2,
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useUIStore } from '@/stores/uiStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { toast } from 'sonner'

export function CommandPalette() {
  const { t } = useTranslation()
  const open = useUIStore((s) => s.commandPaletteOpen)
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const openClassModal = useUIStore((s) => s.openClassModal)
  const navigate = useNavigate()
  const setFocusMode = usePreferencesStore((s) => s.setFocusMode)

  const run = (fn: () => void) => {
    setOpen(false)
    fn()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 max-w-xl">
        <Command label={t('command.placeholder')}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder={t('command.placeholder')}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Command.List className="max-h-[320px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">{t('common.noResults')}</Command.Empty>
            <Command.Group heading={t('command.navigation')}>
              <Command.Item onSelect={() => run(() => navigate('/app/dashboard'))} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <LayoutDashboard className="h-4 w-4" /> {t('nav.dashboard')}
              </Command.Item>
              <Command.Item onSelect={() => run(() => navigate('/app/calendar'))} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <Calendar className="h-4 w-4" /> {t('nav.calendar')}
              </Command.Item>
              <Command.Item onSelect={() => run(() => navigate('/app/settings'))} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <Settings className="h-4 w-4" /> {t('nav.settings')}
              </Command.Item>
              <Command.Item onSelect={() => run(() => navigate('/app/profile'))} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <User className="h-4 w-4" /> {t('nav.profile')}
              </Command.Item>
            </Command.Group>
            <Command.Group heading={t('command.actions')}>
              <Command.Item onSelect={() => run(() => openClassModal())} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <Plus className="h-4 w-4" /> {t('command.addClass')}
              </Command.Item>
              <Command.Item onSelect={() => run(() => { setFocusMode(true); toast.info(t('command.focusEnabled')) })} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <Moon className="h-4 w-4" /> {t('command.toggleFocus')}
              </Command.Item>
              <Command.Item onSelect={() => run(() => toast.success(t('settings.shareCopied')))} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <Share2 className="h-4 w-4" /> {t('command.copyShare')}
              </Command.Item>
              <Command.Item onSelect={() => run(() => toast.success(t('settings.pdfExported')))} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <Download className="h-4 w-4" /> {t('command.exportSchedule')}
              </Command.Item>
            </Command.Group>
            <Command.Group heading={t('command.help')}>
              <Command.Item onSelect={() => run(() => navigate('/features'))} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <HelpCircle className="h-4 w-4" /> {t('command.viewFeatures')}
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
