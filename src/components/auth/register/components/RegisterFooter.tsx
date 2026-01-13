import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ActionButton } from '@/components/ui/form-fields'

interface RegisterFooterProps {
    hasAccountText: string
    loginText: string
    submitText: string
    loadingText: string
    isLoading: boolean
    isRTL: boolean
}

export function RegisterFooter({
    hasAccountText,
    loginText,
    submitText,
    loadingText,
    isLoading,
    isRTL
}: RegisterFooterProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground order-2 sm:order-1">
                {hasAccountText}{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                    {loginText}
                </Link>
            </p>

            <ActionButton
                type="submit"
                className="w-full sm:w-auto min-w-[200px] order-1 sm:order-2"
                isLoading={isLoading}
                loadingText={loadingText}
            >
                {submitText}
                <ArrowRight className={cn("h-4 w-4", isRTL ? "mr-2" : "ml-2")} />
            </ActionButton>
        </div>
    )
}
