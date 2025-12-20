import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Languages } from 'lucide-react'
import { useState } from 'react'

const languages = [
  { label: 'English', code: 'en', flag: '🇬🇧' },
  { label: 'French', code: 'fr', flag: '🇫🇷' },
  { label: 'Arabic', code: 'ar', flag: '🇸🇦' },
]

export function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0])

  const changeLanguage = (language: typeof languages[0]) => {
    setCurrentLanguage(language)
    // TODO: Implement i18n when ready
    console.log('Language changed to:', language.code)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-9 w-9'>
          <Languages className='h-4 w-4' />
          <span className='sr-only'>Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language)}
            className='cursor-pointer'
          >
            <span className='mr-2'>{language.flag}</span>
            <span>{language.label}</span>
            {currentLanguage.code === language.code && (
              <span className='ml-auto text-xs'>✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
