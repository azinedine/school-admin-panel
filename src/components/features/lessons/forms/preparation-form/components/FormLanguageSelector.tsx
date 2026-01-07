import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

interface FormLanguageSelectorProps {
    value: string
    onChange: (language: string) => void
    className?: string
}

const languages = [
    {
        code: 'ar',
        label: 'العربية',
        flag: '🇩🇿',
        dir: 'rtl',
        description: 'Arabic (Algeria)',
    },
    {
        code: 'fr',
        label: 'Français',
        flag: '🇫🇷',
        dir: 'ltr',
        description: 'French',
    },
    {
        code: 'en',
        label: 'English',
        flag: '🇬🇧',
        dir: 'ltr',
        description: 'English',
    },
]

export function FormLanguageSelector({
    value,
    onChange,
    className,
}: FormLanguageSelectorProps) {
    const { t } = useTranslation()

    return (
        <TooltipProvider delayDuration={200}>
            <div
                className={cn(
                    'inline-flex items-center rounded-lg bg-muted/50 p-1 gap-0.5 border border-border/50',
                    className
                )}
            >
                {languages.map((lang) => {
                    const isActive = value === lang.code
                    return (
                        <Tooltip key={lang.code}>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={() => onChange(lang.code)}
                                    className={cn(
                                        'relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                                        isActive
                                            ? 'bg-background text-foreground shadow-sm border border-border/80'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                    )}
                                    aria-pressed={isActive}
                                    aria-label={`${t('common.switchTo', 'Switch to')} ${lang.description}`}
                                >
                                    <span className="text-base leading-none">{lang.flag}</span>
                                    <span className="hidden sm:inline">{lang.code.toUpperCase()}</span>
                                    {isActive && (
                                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary" />
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                                <p className="font-medium">{lang.label}</p>
                                <p className="text-muted-foreground">{lang.description}</p>
                            </TooltipContent>
                        </Tooltip>
                    )
                })}
            </div>
        </TooltipProvider>
    )
}
