import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '@/store/settings-store'

const languages = [
  { label: 'English', code: 'en' as const, flag: '🇬🇧' },
  { label: 'Français', code: 'fr' as const, flag: '🇫🇷' },
  { label: 'العربية', code: 'ar' as const, flag: '🇸🇦' },
]

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const { language, setLanguage } = useSettingsStore()

  const currentLanguage = languages.find((l) => l.code === language) || languages[0]

  const changeLanguage = (lang: typeof languages[0]) => {
    setLanguage(lang.code)
    i18n.changeLanguage(lang.code)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-9 w-9'>
          <Languages className='h-4 w-4' />
          <span className='sr-only'>{t('common.changeLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang)}
            className='cursor-pointer'
          >
            <span className='mr-2'>{lang.flag}</span>
            <span>{lang.label}</span>
            {currentLanguage.code === lang.code && (
              <span className='ml-auto text-xs'>✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
