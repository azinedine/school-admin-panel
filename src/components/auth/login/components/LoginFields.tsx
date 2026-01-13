import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import type { UseFormReturn } from 'react-hook-form'
import type { LoginFormValues } from '../hooks/use-login-form'

interface LoginFieldsProps {
    form: UseFormReturn<LoginFormValues>
    t: (key: string) => string
    isRTL: boolean
    showPassword: boolean
    setShowPassword: (show: boolean) => void
    isSubmitting: boolean
}

export function LoginFields({
    form,
    t,
    isRTL,
    showPassword,
    setShowPassword,
    isSubmitting
}: LoginFieldsProps) {
    return (
        <div className="space-y-4">
            {/* Server Error Display */}
            {form.formState.errors.root && (
                <div className="p-3 bg-destructive/15 text-destructive text-sm rounded-md">
                    {form.formState.errors.root.message}
                </div>
            )}

            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('auth.login.email') || 'Email'}</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="m@example.com"
                                type="email"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('auth.login.password') || 'Password'}</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    className={isRTL ? "pl-10" : "pr-10"}
                                    {...field}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className={`absolute top-0 h-full px-3 py-2 hover:bg-transparent ${isRTL ? "left-0" : "right-0"}`}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                </Button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.processing') || 'Processing...'}
                    </>
                ) : (t('auth.login.submit') || 'Sign In')}
            </Button>
        </div>
    )
}
