import { useState } from 'react'
import { useForm, type Path } from 'react-hook-form'
import type { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, UserPlus, ArrowLeft, ArrowRight, School, BookOpen, Users, User as UserIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRegister } from '@/hooks/use-auth'
import { wilayas, municipalities, institutions, subjectsList, classesList } from '@/data/mock-locations'

// Define validation schema using Zod
const createRegistrationSchema = (t: (key: string) => string) => {
  return z.object({
    name: z.string().min(2, { message: t('auth.validation.nameLength') }),
    email: z.string().email({ message: t('auth.validation.emailInvalid') }),
    password: z.string().min(8, { message: t('auth.validation.passwordLength') }),
    role: z.enum(["admin", "teacher", "student", "parent"]),
    
    // Location fields - required for all roles in this app logic (from previous code)
    wilaya: z.string().min(1, { message: t('auth.validation.wilayaRequired') }),
    municipality: z.string().min(1, { message: t('auth.validation.municipalityRequired') }),
    institution: z.string().min(1, { message: t('auth.validation.institutionRequired') }),
  
    // Role specific fields (optional but validated if role matches)
    subjects: z.array(z.string()).optional(),
    levels: z.array(z.string()).optional(),
    class: z.string().optional(),
    linkedStudentId: z.string().optional(),
  }).refine((data) => {
    if (data.role === 'teacher') {
      if (!data.subjects || data.subjects.length === 0) return false;
      if (!data.levels || data.levels.length === 0) return false;
    }
    return true;
  }, {
    message: t('auth.validation.teacherSubjectsRequired'),
    path: ["subjects"], // Show error on subjects field
  }).refine((data) => {
    if (data.role === 'student' && !data.class) return false;
    return true;
  }, {
    message: t('auth.validation.studentClassRequired'),
    path: ["class"],
  }).refine((data) => {
    if (data.role === 'parent' && !data.linkedStudentId) return false;
    return true;
  }, {
    message: t('auth.validation.parentStudentIdRequired'),
    path: ["linkedStudentId"],
  });
}

// Infer type from schema
type FormValues = z.infer<ReturnType<typeof createRegistrationSchema>>

interface RegistrationFormProps {
  onSuccess?: () => void;
}

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  
  // React Query mutation hook
  const { mutate: registerUser, isPending: isSubmitting } = useRegister()

  // Create schema with translations
  const registrationSchema = createRegistrationSchema(t)

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
      wilaya: "",
      municipality: "",
      institution: "",
      subjects: [],
      levels: [],
      class: "",
      linkedStudentId: "",
    },
    mode: "onChange", // Validate on change for better UX
  })

  // Watch values for conditional rendering and dependency logic
  const role = form.watch("role")
  const selectedWilaya = form.watch("wilaya")
  const selectedMunicipality = form.watch("municipality")

  // Handle step navigation
  const nextStep = async () => {
    // Validate fields for step 1
    const fieldsToValidate: (keyof FormValues)[] = ["name", "email", "password", "role"];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(2);
    }
  }

  const prevStep = () => setStep(1)

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    // Map IDs to Names for backend compatibility (preserving logic from original register.tsx)
    const wilayaData = wilayas.find(w => w.code === data.wilaya)
    const muniData = municipalities[data.wilaya]?.find(m => m.id === data.municipality)
    const instData = institutions[data.municipality]?.find(i => i.id === data.institution)

    const subjectNames = data.subjects?.map(id => {
      const s = subjectsList.find(sub => sub.id === id)
      return isRTL ? s?.nameAr || id : s?.name || id
    })

    const levelNames = data.levels?.map(id => {
       const l = classesList.find(c => c.id === id)
       return l?.name || id
    })

    const payload = {
      ...data,
      password_confirmation: data.password, // Backend requirement
      institution_id: data.institution || '', // Pass institution_id as required by RegistrationPayload
      // Override with names for backend (legacy support)
      wilaya: (isRTL ? wilayaData?.nameAr : wilayaData?.name) || '',
      municipality: (isRTL ? muniData?.nameAr : muniData?.name) || '',
      institution: (isRTL ? instData?.nameAr : instData?.name) || '',
      subjects: subjectNames,
      levels: levelNames,
    }

    registerUser(payload, {
        onSuccess: () => {
            if (onSuccess) onSuccess();
        },
        onError: (error: AxiosError<{ message: string, errors?: Record<string, string[]> }>) => {
             // Map server errors to form fields
             if (error.response?.data?.errors) {
                 const serverErrors = error.response.data.errors;
                 Object.keys(serverErrors).forEach((key) => {
                     // Map server errors to form fields
                     form.setError(key as Path<FormValues>, {
                         type: "server",
                         message: serverErrors[key][0]
                     });
                 });
             } else {
                 form.setError("root", { 
                     type: "server", 
                     message: t('auth.validation.registrationFailed', 'Registration failed. Please try again.') 
                 });
             }
        }
    })
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
    <Card className="w-full max-w-md shadow-lg border-0 bg-card transition-all duration-300">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-all">
            {step === 1 ? <UserPlus className="h-6 w-6" /> : renderStepIcon()}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          {t('auth.register.title')}
        </CardTitle>
        <CardDescription>
          {step === 1 ? t('auth.register.step1Desc') : t('auth.register.step2Desc', { role: t(`auth.roles.${role}`) })}
        </CardDescription>

        <div className="flex gap-2 justify-center mt-4">
          <div className={cn("h-1 w-8 rounded-full transition-colors", step >= 1 ? "bg-primary" : "bg-muted")} />
          <div className={cn("h-1 w-8 rounded-full transition-colors", step >= 2 ? "bg-primary" : "bg-muted")} />
        </div>
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

            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.register.name')}</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.login.email')}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="m@example.com" {...field} />
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
                      <FormLabel>{t('auth.login.password')}</FormLabel>
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
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.register.role')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">{t('auth.roles.admin')}</SelectItem>
                          <SelectItem value="teacher">{t('auth.roles.teacher')}</SelectItem>
                          <SelectItem value="student">{t('auth.roles.student')}</SelectItem>
                          <SelectItem value="parent">{t('auth.roles.parent')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="wilaya"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.register.wilaya')}</FormLabel>
                        <Select onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("municipality", ""); // Reset municipality
                            form.setValue("institution", ""); // Reset institution
                        }} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('auth.register.selectWilaya')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                             {wilayas.map(w => (
                                <SelectItem key={w.code} value={w.code}>
                                    {w.code} - {isRTL ? w.nameAr : w.name}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="municipality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.register.municipality')}</FormLabel>
                        <Select 
                            onValueChange={(val) => {
                                field.onChange(val);
                                form.setValue("institution", "");
                            }} 
                            defaultValue={field.value}
                            disabled={!selectedWilaya}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('auth.register.selectMunicipality')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                             {selectedWilaya && municipalities[selectedWilaya]?.map(m => (
                                <SelectItem key={m.id} value={m.id}>
                                    {isRTL ? m.nameAr : m.name}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                   control={form.control}
                   name="institution"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>{t('auth.register.institution')}</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedMunicipality}>
                         <FormControl>
                           <SelectTrigger>
                             <SelectValue placeholder={t('auth.register.selectInstitution')} />
                           </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                           {selectedMunicipality && institutions[selectedMunicipality]?.map(i => (
                                <SelectItem key={i.id} value={i.id}>
                                    {isRTL ? i.nameAr : i.name}
                                </SelectItem>
                            ))}
                         </SelectContent>
                       </Select>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                {role === 'teacher' && (
                  <>
                     <FormField
                        control={form.control}
                        name="subjects"
                        render={() => (
                            <FormItem>
                                <FormLabel>{t('auth.register.subjects')}</FormLabel>
                                <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                                    {subjectsList.map((subject) => (
                                        <FormField
                                            key={subject.id}
                                            control={form.control}
                                            name="subjects"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={subject.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(subject.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...(field.value || []), subject.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== subject.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            {isRTL ? subject.nameAr : subject.name}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Levels - similar implementation to subjects */}
                    <FormField
                        control={form.control}
                        name="levels"
                        render={() => (
                            <FormItem>
                                <FormLabel>{t('auth.register.levels')}</FormLabel>
                                <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                                    {classesList.map((level) => (
                                        <FormField
                                            key={level.id}
                                            control={form.control}
                                            name="levels"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={level.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(level.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...(field.value || []), level.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== level.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            {level.name}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                  </>
                )}

                {role === 'student' && (
                    <FormField
                      control={form.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.register.class')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('auth.register.selectClass')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {classesList.map(c => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                )}

                {role === 'parent' && (
                    <FormField
                      control={form.control}
                      name="linkedStudentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.register.linkedStudent')}</FormLabel>
                          <FormControl>
                            <Input placeholder="Student ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                )}
              </div>
            )}

            <div className="flex w-full gap-2 pt-4">
                {step === 2 && (
                    <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                        <ArrowLeft className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                        {t('common.back')}
                    </Button>
                )}
                
                {step === 1 ? (
                    <Button type="button" onClick={nextStep} className="flex-1">
                        {t('common.next')}
                        <ArrowRight className={cn("h-4 w-4", isRTL ? "mr-2" : "ml-2")} />
                    </Button>
                ) : (
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('common.processing')}
                            </>
                        ) : t('auth.register.submit')}
                    </Button>
                )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
