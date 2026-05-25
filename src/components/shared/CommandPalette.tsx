import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const open = useUIStore((s) => s.commandPaletteOpen)
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen)
  const openClassModal = useUIStore((s) => s.openClassModal)
  const navigate = useNavigate()
  const setFocusMode = usePreferencesStore((s) => s.setFocusMode)

  useEffect(() => {
    if (!open) return
  }, [open])

  const run = (fn: () => void) => {
    setOpen(false)
    fn()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 max-w-xl">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground" label="Command menu">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Search commands, pages, actions..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Command.List className="max-h-[320px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>
            <Command.Group heading="Navigation">
              <Command.Item onSelect={() => run(() => navigate('/app/dashboard'))} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Command.Item>
              <Command.Item onSelect={() => run(() => navigate('/app/calendar'))} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <Calendar className="h-4 w-4" /> Calendar
              </Command.Item>
              <Command.Item onSelect={() => run(() => navigate('/app/settings'))} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <Settings className="h-4 w-4" /> Settings
              </Command.Item>
              <Command.Item onSelect={() => run(() => navigate('/app/profile'))} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <User className="h-4 w-4" /> Profile
              </Command.Item>
            </Command.Group>
            <Command.Group heading="Actions">
              <Command.Item onSelect={() => run(() => openClassModal())} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <Plus className="h-4 w-4" /> Add class <span className="ml-auto text-xs text-muted-foreground">⌘N</span>
              </Command.Item>
              <Command.Item onSelect={() => run(() => { setFocusMode(true); toast.info('Focus mode enabled') })} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <Moon className="h-4 w-4" /> Toggle focus mode
              </Command.Item>
              <Command.Item onSelect={() => run(() => toast.success('Share link copied to clipboard'))} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <Share2 className="h-4 w-4" /> Copy share link
              </Command.Item>
              <Command.Item onSelect={() => run(() => toast.success('Schedule exported as PDF'))} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <Download className="h-4 w-4" /> Export schedule
              </Command.Item>
            </Command.Group>
            <Command.Group heading="Help">
              <Command.Item onSelect={() => run(() => navigate('/features'))} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-secondary">
                <HelpCircle className="h-4 w-4" /> View features & help
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
