import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useLoginForm } from './hooks/use-login-form'
import { LoginHeader } from './components/LoginHeader'
import { LoginFooter } from './components/LoginFooter'
import { LoginFields } from './components/LoginFields'

export function LoginForm() {
  const {
    form,
    onSubmit,
    isSubmitting,
    showPassword,
    setShowPassword,
    t,
    isRTL
  } = useLoginForm()

  return (
    <Card className="w-full max-w-md shadow-lg border-0 bg-card">
      <LoginHeader
        title={t('auth.login.title') || 'Welcome back'}
        description={t('auth.login.description') || 'Enter your email to sign in to your account'}
      />

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <LoginFields
              form={form}
              t={t}
              isRTL={isRTL}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isSubmitting={isSubmitting}
            />
          </form>
        </Form>
      </CardContent>

      <LoginFooter
        noAccountText={t('auth.login.noAccount') || "Don't have an account?"}
        registerText={t('auth.register.submit') || 'Sign Up'}
      />
    </Card>
  )
}
