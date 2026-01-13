import { useState } from 'react'
import { useForm, type Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTranslation } from 'react-i18next'
import { useLogin } from '@/hooks/use-auth'
import type { AxiosError } from 'axios'

// Define validation schema using Zod
const createLoginSchema = (t: (key: string) => string) => {
    return z.object({
        email: z.string().min(1, { message: t('auth.validation.emailRequired') }).email({ message: t('auth.validation.emailInvalid') }),
        password: z.string().min(1, { message: t('auth.validation.passwordRequired') }),
    })
}

// Infer type from schema
export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>

export function useLoginForm() {
    const { t, i18n } = useTranslation()
    const isRTL = i18n.dir() === 'rtl'
    const [showPassword, setShowPassword] = useState(false)

    // React Query mutation hook
    const { mutate: loginUser, isPending: isSubmitting } = useLogin()

    // Create schema with translations
    const loginSchema = createLoginSchema(t)

    // Initialize form
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // Form submission handler
    const onSubmit = (data: LoginFormValues) => {
        loginUser(data, {
            onError: (error: AxiosError<{ message: string, errors?: Record<string, string[]> }>) => {
                // Map server errors to form fields or show generic error
                if (error.response?.data?.errors) {
                    const serverErrors = error.response.data.errors;
                    Object.keys(serverErrors).forEach((key) => {
                        // Map server errors to form fields
                        form.setError(key as Path<LoginFormValues>, {
                            type: "server",
                            message: serverErrors[key][0]
                        });
                    });
                }
            }
        })
    }

    return {
        form,
        onSubmit,
        isSubmitting,
        showPassword,
        setShowPassword,
        t,
        isRTL
    }
}
