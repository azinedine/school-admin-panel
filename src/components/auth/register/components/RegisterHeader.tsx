import { UserPlus } from 'lucide-react'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

interface RegisterHeaderProps {
    title: string
    description: string
}

export function RegisterHeader({ title, description }: RegisterHeaderProps) {
    return (
        <>
            <div className="absolute top-4 right-4 z-10">
                <LanguageSwitcher />
            </div>

            <div className="text-center space-y-2 mb-8">
                <div className="flex justify-center mb-4">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <UserPlus className="h-7 w-7" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    {description}
                </p>
            </div>
        </>
    )
}
