import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useUIStore } from '@/stores/uiStore'

export function FloatingActionButton() {
  const { t } = useTranslation()
  const openClassModal = useUIStore((s) => s.openClassModal)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="fixed bottom-6 right-6 z-50 lg:bottom-8 lg:right-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="icon"
              className="h-14 w-14 rounded-2xl shadow-xl shadow-primary/25"
              onClick={() => openClassModal()}
              aria-label={t('layout.addClass')}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>{t('layout.addClassShortcut')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
