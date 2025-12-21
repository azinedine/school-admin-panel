import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Hook to get the current text direction based on i18n language.
 * Returns 'rtl' for Arabic, 'ltr' for other languages.
 */
export function useDirection() {
  const { i18n } = useTranslation()
  const [direction, setDirection] = useState<'ltr' | 'rtl'>(
    i18n.language === 'ar' ? 'rtl' : 'ltr'
  )

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setDirection(lng === 'ar' ? 'rtl' : 'ltr')
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  return {
    direction,
    isRTL: direction === 'rtl',
    isLTR: direction === 'ltr',
  }
}
