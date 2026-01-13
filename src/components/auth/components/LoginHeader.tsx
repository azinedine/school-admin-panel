import { LogIn } from 'lucide-react'
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface LoginHeaderProps {
    title: string
    description: string
}

export function LoginHeader({ title, description }: LoginHeaderProps) {
    return (
        <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <LogIn className="h-6 w-6" />
                </div>
            </div>
            <CardTitle className="text-2xl font-bold">
                {title}
            </CardTitle>
            <CardDescription>
                {description}
            </CardDescription>
        </CardHeader>
    )
}
