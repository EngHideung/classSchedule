import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useLanguageStore } from '@/stores/languageStore'
import { LANGUAGES, type LanguageCode } from '@/i18n'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  compact?: boolean
  className?: string
}

export function LanguageSwitcher({ compact, className }: LanguageSwitcherProps) {
  const { t } = useTranslation()
  const language = useLanguageStore((s) => s.language)
  const setLanguage = useLanguageStore((s) => s.setLanguage)

  const toggle = () => {
    const next: LanguageCode = language === 'en' ? 'id' : 'en'
    void setLanguage(next)
  }

  if (compact) {
    const current = LANGUAGES.find((l) => l.code === language)
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className={className}
        aria-label={`${t('common.language')}: ${current?.label}. ${t('settings.languageDesc')}`}
        title={`${current?.flag} ${current?.label}`}
      >
        <span className="text-base leading-none">{current?.flag}</span>
      </Button>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-sm font-medium">{t('settings.language')}</p>
      <p className="text-xs text-muted-foreground">{t('settings.languageDesc')}</p>
      <div className="flex gap-2 rounded-lg bg-secondary p-1" role="group" aria-label={t('common.language')}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => void setLanguage(lang.code)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              language === lang.code ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={language === lang.code}
          >
            <span>{lang.flag}</span>
            <span>{lang.code === 'en' ? t('common.english') : t('common.indonesian')}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
