import { useState } from 'react'
import { createFileRoute, redirect, useNavigate, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import type { User } from '@/store/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Eye, EyeOff, UserPlus, ArrowLeft, ArrowRight, School, BookOpen, Users, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Step 1 Data
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<User['role']>('student')
  const [showPassword, setShowPassword] = useState(false)

  // Step 2 Data
  const [institution, setInstitution] = useState('')
  const [subjects, setSubjects] = useState('')
  const [levels, setLevels] = useState('')
  const [studentClass, setStudentClass] = useState('')
  const [linkedStudentId, setLinkedStudentId] = useState('')

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        id: Math.floor(Math.random() * 1000) + 1,
        name,
        email,
        role,
        institution,
        // Optional fields based on role
        subjects: role === 'teacher' ? subjects.split(',').map(s => s.trim()) : undefined,
        levels: role === 'teacher' ? levels.split(',').map(l => l.trim()) : role === 'student' ? [levels] : undefined,
        class: role === 'student' ? studentClass : undefined,
        linkedStudentId: role === 'parent' ? linkedStudentId : undefined
      }

      login(newUser, 'mock-jwt-token')
      
      toast.success(t('auth.register.success') || 'Account created successfully')
      navigate({ to: '/' })
    }, 800)
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
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
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
          
          {/* Progress Indicator */}
          <div className="flex gap-2 justify-center mt-4">
            <div className={cn("h-1 w-8 rounded-full transition-colors", step >= 1 ? "bg-primary" : "bg-muted")} />
            <div className={cn("h-1 w-8 rounded-full transition-colors", step >= 2 ? "bg-primary" : "bg-muted")} />
          </div>
        </CardHeader>

        <form onSubmit={step === 1 ? handleNext : handleRegister}>
          <CardContent className="space-y-4">
            {step === 1 ? (
              <>
                {/* Step 1: General Info */}
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.register.name')}</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.login.email')}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.login.password')}</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={isRTL ? "pl-10" : "pr-10"}
                      required
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
                </div>
                {/* Role Selection */}
                <div className="space-y-2">
                    <Label>{t('auth.register.role')}</Label>
                    <Select value={role} onValueChange={(v: any) => setRole(v)}>
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
                </div>
              </>
            ) : (
              <>
                {/* Step 2: Role Specifics */}
                <div className="space-y-2">
                    <Label htmlFor="institution">{t('auth.register.institution')}</Label>
                    <Input 
                        id="institution" 
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="School Name"
                        required
                        autoFocus
                    />
                </div>

                {role === 'teacher' && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="subjects">{t('auth.register.subjects')}</Label>
                            <Input 
                                id="subjects" 
                                value={subjects}
                                onChange={(e) => setSubjects(e.target.value)}
                                placeholder="Math, Physics"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="levels">{t('auth.register.levels')}</Label>
                            <Input 
                                id="levels" 
                                value={levels}
                                onChange={(e) => setLevels(e.target.value)}
                                placeholder="1AM, 2AM"
                                required
                            />
                        </div>
                    </>
                )}

                {role === 'student' && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="level">{t('auth.register.level')}</Label>
                            <Input 
                                id="level" 
                                value={levels}
                                onChange={(e) => setLevels(e.target.value)}
                                placeholder="1AM"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="class">{t('auth.register.class')}</Label>
                            <Input 
                                id="class" 
                                value={studentClass}
                                onChange={(e) => setStudentClass(e.target.value)}
                                placeholder="Class A"
                                required
                            />
                        </div>
                    </>
                )}

                 {role === 'parent' && (
                    <div className="space-y-2">
                        <Label htmlFor="linkedStudent">{t('auth.register.linkedStudent')}</Label>
                        <Input 
                            id="linkedStudent" 
                            value={linkedStudentId}
                            onChange={(e) => setLinkedStudentId(e.target.value)}
                            placeholder="Student ID"
                            required
                        />
                    </div>
                )}
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
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
