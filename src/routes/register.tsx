import { useState, useEffect } from 'react'
import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useForm, FormProvider, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useRegister } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { UserPlus, ArrowLeft, ArrowRight, School, BookOpen, Users, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { registrationSchema, registrationDefaults, type RegistrationFormData } from '@/schemas/registration'
import { ActionButton } from '@/components/forms/ActionButton'

// Modular Sections
import { AccountInfoSection } from '@/components/forms/register/AccountInfoSection'
import { LocationSection } from '@/components/forms/register/LocationSection'
import { PersonalInfoSection } from '@/components/forms/register/PersonalInfoSection'
import { ProfessionalInfoSection } from '@/components/forms/register/ProfessionalInfoSection'
import { AcademicSection } from '@/components/forms/register/AcademicSection'

export const Route = createFileRoute('/register')({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const [step, setStep] = useState(1)

  const { mutate: registerUser, isPending: loading } = useRegister()

  // Initialize Form
  const methods = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema) as Resolver<RegistrationFormData>,
    defaultValues: registrationDefaults,
    mode: 'onChange'
  })

  // Destructure needed methods
  const { handleSubmit, watch, trigger, setValue } = methods

  // Watch Main Values
  const role = watch('role')
  const selectedWilaya = watch('wilaya')
  const selectedMunicipality = watch('municipality')

  // Effect: Reset dependent fields
  useEffect(() => {
    setValue('municipality', '')
    setValue('institution', '')
  }, [selectedWilaya, setValue])

  useEffect(() => {
    setValue('institution', '')
  }, [selectedMunicipality, setValue])

  // Step Navigation
  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    const step1Fields: (keyof RegistrationFormData)[] = ['name', 'email', 'password', 'role']
    const isValid = await trigger(step1Fields) // Validate Step 1 only
    if (isValid) {
      setStep(2)
    }
  }

  const handleBack = () => {
    setStep(1)
  }

  // Submission
  const onSubmit = (data: RegistrationFormData) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password,
      role: data.role,
      wilaya: data.wilaya,
      municipality: data.municipality,
      institution: data.institution,
      // Optional fields handled by backend or filtered
      name_ar: data.name_ar,
      gender: data.gender,
      date_of_birth: data.date_of_birth,
      phone: data.phone,
      teacher_id: data.teacher_id,
      years_of_experience: data.years_of_experience,
      subjects: data.subjects,
      levels: data.levels,
      class: data.class,
      linkedStudentId: data.linkedStudentId,
    }
    registerUser(payload)
  }

  const renderStepIcon = () => {
    switch (role) {
      case 'admin': return <School className="h-6 w-6" />
      case 'teacher': return <BookOpen className="h-6 w-6" />
      case 'parent': return <Users className="h-6 w-6" />
      default: return <UserIcon className="h-6 w-6" />
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-2 sm:p-4 lg:p-6 relative">
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-3xl shadow-lg border-0 bg-card transition-all duration-300">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="flex justify-center mb-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {step === 1 ? <UserPlus className="h-6 w-6" /> : renderStepIcon()}
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">
            {t('auth.register.title')}
          </CardTitle>
          <CardDescription className="text-sm">
            {step === 1 
              ? t('auth.register.step1Desc') 
              : t('auth.register.step2Desc', { role: t(`auth.roles.${role}`) })}
          </CardDescription>
          
          <div className="flex gap-2 justify-center mt-3">
            <div className={cn("h-1 w-8 rounded-full transition-colors", step >= 1 ? "bg-primary" : "bg-muted")} />
            <div className={cn("h-1 w-8 rounded-full transition-colors", step >= 2 ? "bg-primary" : "bg-muted")} />
          </div>
        </CardHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-3 px-4 sm:px-6">
              {step === 1 ? (
                <AccountInfoSection />
              ) : (
                <div className="space-y-4">
                  <LocationSection />
                  
                  {role === 'teacher' && (
                    <>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">{t('profilePage.personalInfo')}</span>
                        </div>
                      </div>
                      <PersonalInfoSection />
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">{t('profilePage.professionalInfo')}</span>
                        </div>
                      </div>
                      <ProfessionalInfoSection />
                    </>
                  )}

                  <AcademicSection role={role} />
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col gap-3 px-4 sm:px-6 pt-2">
              <div className="flex w-full gap-2">
                {step === 2 && (
                  <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                    <ArrowLeft className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                    {t('common.back')}
                  </Button>
                )}
                
                {step === 1 ? (
                  <Button type="button" onClick={handleNext} className="flex-1">
                    {t('common.next')}
                    <ArrowRight className={cn("h-4 w-4", isRTL ? "mr-2" : "ml-2")} />
                  </Button>
                ) : (
                  <ActionButton 
                    type="submit" 
                    className="flex-1" 
                    isLoading={loading}
                    loadingText={t('common.processing')}
                  >
                    {t('auth.register.submit')}
                  </ActionButton>
                )}
              </div>
              
              {step === 1 && (
                <p className="text-sm text-center text-muted-foreground">
                  {t('auth.register.hasAccount')}{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    {t('auth.login.submit')}
                  </Link>
                </p>
              )}
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  )
}
