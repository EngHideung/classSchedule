import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
const DAY_SHORT_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

export function useDayNames() {
  const { t } = useTranslation()

  return useMemo(
    () => ({
      full: DAY_KEYS.map((k) => t(`days.${k}`)),
      short: DAY_SHORT_KEYS.map((k) => t(`days.${k}`)),
    }),
    [t]
  )
}
