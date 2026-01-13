import { Link } from '@tanstack/react-router'
import { CardFooter } from '@/components/ui/card'

interface LoginFooterProps {
    noAccountText: string
    registerText: string
}

export function LoginFooter({ noAccountText, registerText }: LoginFooterProps) {
    return (
        <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-center text-muted-foreground">
                {noAccountText}{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                    {registerText}
                </Link>
            </p>
        </CardFooter>
    )
}
