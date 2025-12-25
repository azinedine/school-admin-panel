import { useState } from 'react'
import { useForm, type Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AxiosError } from 'axios'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Link } from '@tanstack/react-router'
import { useLogin } from '@/hooks/use-auth'

// Define validation schema using Zod
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

// Infer type from schema
type FormValues = z.infer<typeof formSchema>

export function LoginForm() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const [showPassword, setShowPassword] = useState(false)
  
  // React Query mutation hook
  const { mutate: loginUser, isPending: isSubmitting } = useLogin()

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    loginUser(data, {
        onError: (error: AxiosError<{ message: string, errors?: Record<string, string[]> }>) => {
             // Map server errors to form fields or show generic error
             if (error.response?.data?.errors) {
                 const serverErrors = error.response.data.errors;
                 Object.keys(serverErrors).forEach((key) => {
                     // Map server errors to form fields
                     form.setError(key as Path<FormValues>, {
                         type: "server",
                         message: serverErrors[key][0]
                     });
                 });
             }
        }
    })
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-0 bg-card">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <LogIn className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          {t('auth.login.title') || 'Welcome back'}
        </CardTitle>
        <CardDescription>
          {t('auth.login.description') || 'Enter your email to sign in to your account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="text-sm text-center text-muted-foreground">
          {t('auth.login.noAccount') || "Don't have an account?"}{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            {t('auth.register.submit') || 'Sign Up'}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
