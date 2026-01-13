import { FormProvider } from 'react-hook-form'
import { FormSection } from '@/components/ui/form-fields'
import { FullScreenLoader } from '@/components/ui/full-screen-loader'
import { useRegisterForm } from './hooks/use-register-form'
import { RegisterHeader } from './components/RegisterHeader'
import { RegisterFooter } from './components/RegisterFooter'
import { AccountInfoSection } from './components/AccountInfoSection'
import { LocationSection } from './components/LocationSection'
import { PersonalInfoSection } from './components/PersonalInfoSection'
import { ProfessionalInfoSection } from './components/ProfessionalInfoSection'
import { AcademicSection } from './components/AcademicSection'
import { AdminAdditionalInfoSection } from './components/AdminAdditionalInfoSection'

export function RegisterForm() {
    const {
        methods,
        handleSubmit,
        onSubmit,
        onError,
        loading,
        role,
        t,
        isRTL
    } = useRegisterForm()

    return (
        <div className="min-h-screen bg-muted/20 p-4 lg:p-8 relative pt-10 lg:pt-16">
            {loading && <FullScreenLoader />}

            <div className="w-full max-w-7xl mx-auto space-y-6">
                <RegisterHeader
                    title={t('auth.register.title')}
                    description={t('auth.register.step1Desc')}
                />

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
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

                        <RegisterFooter
                            hasAccountText={t('auth.register.hasAccount')}
                            loginText={t('auth.login.submit')}
                            submitText={t('auth.register.submit')}
                            loadingText={t('common.processing')}
                            isLoading={loading}
                            isRTL={isRTL}
                        />
                    </form>
                </FormProvider>
            </div>
        </div>
    )
}
