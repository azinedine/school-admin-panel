import { useMemo } from 'react'
import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useForm, FormProvider, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useRegister } from '@/hooks/use-auth'
// Card components removed as they are unused
import { LanguageSwitcher } from '@/components/language-switcher'
import { UserPlus, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createRegistrationSchema, registrationDefaults, type RegistrationFormData } from '@/schemas/registration'
import { ActionButton } from '@/components/forms/ActionButton'

// Modular Sections
import { AccountInfoSection } from '@/components/forms/register/AccountInfoSection'
import { LocationSection } from '@/components/forms/register/LocationSection'
import { PersonalInfoSection } from '@/components/forms/register/PersonalInfoSection'
import { ProfessionalInfoSection } from '@/components/forms/register/ProfessionalInfoSection'
import { AcademicSection } from '@/components/forms/register/AcademicSection'
import { AdminAdditionalInfoSection } from '@/components/forms/register/AdminAdditionalInfoSection'
import { FormSection } from '@/components/forms/FormSection'

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

  const { mutate: registerUser, isPending: loading } = useRegister()
  
  const registrationSchema = useMemo(() => createRegistrationSchema(t), [t])

  // Initialize Form
  const methods = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema) as Resolver<RegistrationFormData>,
    defaultValues: registrationDefaults,
    mode: 'onChange'
  })

  // Destructure needed methods
  const { handleSubmit, watch } = methods
  const role = watch('role')

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

      years_of_experience: data.years_of_experience,
      subjects: data.subjects,
      levels: data.levels,
      class: data.class,
      linkedStudentId: data.linkedStudentId,
    }
    registerUser(payload)
  }

  return (
    <div className="min-h-screen bg-muted/20 p-4 lg:p-8 relative pt-10 lg:pt-16">
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
           <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserPlus className="h-7 w-7" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{t('auth.register.title')}</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t('auth.register.step1Desc')}
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Information */}
                <div className="space-y-6">
                   <FormSection title={t('auth.register.accountInfo')} columns={1}>
                      <AccountInfoSection />
                   </FormSection>

                   <FormSection title={t('auth.register.locationAndInstitution', 'Location & Institution')} columns={1}>
                      <LocationSection />
                   </FormSection>
                </div>

                 {/* Role Specific Information */}
                <div className="space-y-6">
                    {role === 'teacher' && (
                        <>
                          <FormSection title={t('profilePage.personalInfo')} columns={1}>
                              <PersonalInfoSection />
                          </FormSection>
                          <FormSection title={t('profilePage.professionalInfo')} columns={1}>
                              <ProfessionalInfoSection />
                          </FormSection>
                        </>
                    )}
                     
                     {role === 'admin' ? (
                       <FormSection title={t('auth.register.additionalInfo')} columns={1}>
                          <AdminAdditionalInfoSection />
                       </FormSection>
                     ) : (
                       <FormSection 
                          title={role === 'teacher' ? t('profilePage.academicInfo') : t('auth.register.additionalInfo')} 
                          columns={1}
                       >
                          <AcademicSection role={role} />
                       </FormSection>
                     )}
                </div>
             </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t">
               <p className="text-sm text-muted-foreground order-2 sm:order-1">
                  {t('auth.register.hasAccount')}{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    {t('auth.login.submit')}
                  </Link>
                </p>

                <ActionButton 
                  type="submit" 
                  className="w-full sm:w-auto min-w-[200px] order-1 sm:order-2" 
                  isLoading={loading}
                  loadingText={t('common.processing')}
                >
                  {t('auth.register.submit')}
                  <ArrowRight className={cn("h-4 w-4", isRTL ? "mr-2" : "ml-2")} />
                </ActionButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
