import { useState, useEffect } from 'react'
import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useRegister } from '@/hooks/use-auth'
import { useWilayas, useMunicipalities, useInstitutions } from '@/hooks/use-institutions'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, UserPlus, ArrowLeft, ArrowRight, School, BookOpen, Users, User as UserIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { subjectsList, classesList } from '@/data/mock-locations' // Keep these as mocks for now per previous context
import { registrationSchema, registrationDefaults, type RegistrationFormData } from '@/schemas/registration'

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
  const [showPassword, setShowPassword] = useState(false)

  const { mutate: registerUser, isPending: loading } = useRegister()

  // React Hook Form with Zod
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: registrationDefaults,
  })

  // Watch values for conditional rendering and dependent selects
  const role = watch('role')
  const selectedWilaya = watch('wilaya')
  const selectedMunicipality = watch('municipality')
  const selectedSubjects = watch('subjects')
  const selectedLevels = watch('levels')

  // Data Fetching with TanStack Query
  const { data: wilayas, isLoading: loadingWilayas } = useWilayas()
  
  const { data: municipalities, isLoading: loadingMunicipalities } = useMunicipalities(
    selectedWilaya ? parseInt(selectedWilaya) : undefined
  )

  const { data: institutionsData, isLoading: loadingInstitutions } = useInstitutions(
    selectedMunicipality ? { municipality_id: parseInt(selectedMunicipality), is_active: true } : {}
  )
  const institutions = institutionsData?.data || []

  // Reset downstream selections when upstream changes
  useEffect(() => {
    setValue('municipality', '')
    setValue('institution', '')
  }, [selectedWilaya, setValue])

  useEffect(() => {
    setValue('institution', '')
  }, [selectedMunicipality, setValue])

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const toggleSubject = (subjectId: string) => {
    const current = selectedSubjects || []
    if (current.includes(subjectId)) {
      setValue('subjects', current.filter(id => id !== subjectId))
    } else {
      setValue('subjects', [...current, subjectId])
    }
  }

  const toggleLevel = (levelId: string) => {
    const current = selectedLevels || []
    if (current.includes(levelId)) {
      setValue('levels', current.filter(id => id !== levelId))
    } else {
      setValue('levels', [...current, levelId])
    }
  }

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
      // Teacher-specific
      name_ar: data.name_ar, // Ensure backend handles empty strings or convert to undefined?
      gender: data.gender,
      date_of_birth: data.date_of_birth,
      phone: data.phone,
      teacher_id: data.teacher_id,
      years_of_experience: data.years_of_experience,
      subjects: data.subjects,
      levels: data.levels,
      // Student/Parent
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
      
      {/* Container: max-w-3xl for ~60% on large screens */}
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

        <form onSubmit={step === 1 ? handleNext : handleSubmit(onSubmit)}>
          <CardContent className="space-y-3 px-4 sm:px-6">
            {step === 1 ? (
              <>
                {/* Step 1: Account Info - 2 columns on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">{t('auth.register.name')}</Label>
                    <Input 
                      id="name" 
                      {...register('name')}
                      className={cn(errors.name && 'border-destructive')}
                      autoFocus
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">{t('auth.login.email')}</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...register('email')}
                      className={cn(errors.email && 'border-destructive')}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="password">{t('auth.login.password')}</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        {...register('password')}
                        className={cn(isRTL ? "pl-10" : "pr-10", errors.password && 'border-destructive')}
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
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('auth.register.role')}</Label>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">{t('auth.roles.admin')}</SelectItem>
                            <SelectItem value="teacher">{t('auth.roles.teacher')}</SelectItem>
                            <SelectItem value="student">{t('auth.roles.student')}</SelectItem>
                            <SelectItem value="parent">{t('auth.roles.parent')}</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Step 2: Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label>{t('auth.register.wilaya')}</Label>
                    <Controller
                      name="wilaya"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange} disabled={loadingWilayas}>
                          <SelectTrigger className={cn(errors.wilaya && 'border-destructive')}>
                             {loadingWilayas ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  <span className="text-muted-foreground">{t('common.loading')}</span>
                                </div>
                             ) : (
                                <SelectValue placeholder={t('auth.register.selectWilaya')} />
                             )}
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {wilayas?.map(w => (
                              <SelectItem key={w.code} value={w.code}>
                                {isRTL ? (w.name_ar || w.name) : w.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('auth.register.municipality')}</Label>
                    <Controller
                      name="municipality"
                      control={control}
                      render={({ field }) => (
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange} 
                          disabled={!selectedWilaya || loadingMunicipalities}
                        >
                          <SelectTrigger className={cn(errors.municipality && 'border-destructive')}>
                              {loadingMunicipalities ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  <span className="text-muted-foreground">{t('common.loading')}</span>
                                </div>
                             ) : (
                                <SelectValue placeholder={t('auth.register.selectMunicipality')} />
                             )}
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {municipalities?.map(m => (
                              <SelectItem key={m.id} value={m.id.toString()}>
                                {isRTL ? (m.name_ar || m.name) : m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                    <Label>{t('auth.register.institution')}</Label>
                    <Controller
                      name="institution"
                      control={control}
                      render={({ field }) => (
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange} 
                          disabled={!selectedMunicipality || loadingInstitutions}
                        >
                          <SelectTrigger className={cn(errors.institution && 'border-destructive')}>
                              {loadingInstitutions ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  <span className="text-muted-foreground">{t('common.loading')}</span>
                                </div>
                             ) : (
                                <SelectValue placeholder={t('auth.register.selectInstitution')} />
                             )}
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {institutions?.map(i => (
                              <SelectItem key={i.id} value={i.id.toString()}>
                                {isRTL ? (i.name_ar || i.name) : i.name}
                              </SelectItem>
                            ))}
                            {!loadingInstitutions && institutions.length === 0 && (
                                <div className="p-2 text-sm text-center text-muted-foreground">
                                    No institutions found
                                </div>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                {/* Teacher-specific fields */}
                {role === 'teacher' && (
                  <>
                    {/* Personal Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="nameAr">{t('profilePage.arabicName')}</Label>
                        <Input 
                          id="nameAr" 
                          {...register('name_ar')}
                          placeholder={t('auth.register.nameArPlaceholder', 'أدخل الاسم بالعربية')}
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t('profilePage.gender')}</Label>
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <Select value={field.value || ''} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder={t('auth.register.selectGender', 'Select gender')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">{t('profilePage.male')}</SelectItem>
                                <SelectItem value="female">{t('profilePage.female')}</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="dateOfBirth">{t('profilePage.dateOfBirth')}</Label>
                        <Input id="dateOfBirth" type="date" {...register('date_of_birth')} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">{t('profilePage.phone')}</Label>
                        <Input id="phone" type="tel" {...register('phone')} placeholder="+213 XXX XXX XXX" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="teacherId">{t('profilePage.teacherId')}</Label>
                        <Input id="teacherId" {...register('teacher_id')} placeholder="T-12345" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="experience">{t('profilePage.experience')}</Label>
                        <Input id="experience" type="number" min="0" {...register('years_of_experience')} placeholder="0" />
                      </div>
                    </div>

                    {/* Subjects & Levels */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>{t('auth.register.subjects')}</Label>
                        <div className="border rounded-md p-2 max-h-32 overflow-y-auto grid grid-cols-2 gap-1">
                          {subjectsList.map(s => (
                            <div key={s.id} className="flex items-center gap-2">
                              <Checkbox 
                                id={`subject-${s.id}`} 
                                checked={(selectedSubjects || []).includes(s.id)}
                                onCheckedChange={() => toggleSubject(s.id)}
                              />
                              <Label 
                                htmlFor={`subject-${s.id}`} 
                                className="text-xs font-normal cursor-pointer"
                              >
                                {isRTL ? s.nameAr : s.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t('auth.register.levels')}</Label>
                        <div className="border rounded-md p-2 max-h-32 overflow-y-auto grid grid-cols-4 gap-1">
                          {classesList.map(l => (
                            <div key={l.id} className="flex items-center gap-1">
                              <Checkbox 
                                id={`level-${l.id}`} 
                                checked={(selectedLevels || []).includes(l.id)}
                                onCheckedChange={() => toggleLevel(l.id)}
                              />
                              <Label 
                                htmlFor={`level-${l.id}`} 
                                className="text-xs font-normal cursor-pointer"
                              >
                                {l.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Student-specific fields */}
                {role === 'student' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>{t('auth.register.class')}</Label>
                      <Controller
                        name="class"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value || ''} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('auth.register.selectClass')} />
                            </SelectTrigger>
                            <SelectContent>
                              {classesList.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Parent-specific fields */}
                {role === 'parent' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="linkedStudent">{t('auth.register.linkedStudent')}</Label>
                      <Input 
                        id="linkedStudent" 
                        {...register('linkedStudentId')}
                        placeholder="Student ID"
                      />
                    </div>
                  </div>
                )}
              </>
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
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? t('common.processing') : step === 1 ? (
                  <>
                    {t('common.next')}
                    <ArrowRight className={cn("h-4 w-4", isRTL ? "mr-2" : "ml-2")} />
                  </>
                ) : t('auth.register.submit')}
              </Button>
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
      </Card>
    </div>
  )
}
