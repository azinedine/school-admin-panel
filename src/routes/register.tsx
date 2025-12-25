import { useState, useEffect } from 'react'
import { createFileRoute, redirect, useNavigate, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import type { User } from '@/store/types'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Eye, EyeOff, UserPlus, ArrowLeft, ArrowRight, School, BookOpen, Users, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { wilayas, municipalities, institutions, subjectsList, classesList } from '@/data/mock-locations'

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
  const [selectedWilaya, setSelectedWilaya] = useState('')
  const [selectedMunicipality, setSelectedMunicipality] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useState('')
  
  // Subject & Level (Multiple selection for Teacher)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  
  const [selectedClass, setSelectedClass] = useState('') // For Student
  const [linkedStudentId, setLinkedStudentId] = useState('')

  // Reset downstream selections when upstream changes
  useEffect(() => {
    setSelectedMunicipality('')
    setSelectedInstitution('')
  }, [selectedWilaya])

  useEffect(() => {
    setSelectedInstitution('')
  }, [selectedMunicipality])

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }
  
  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    )
  }

  const toggleLevel = (levelId: string) => {
    setSelectedLevels(prev => 
      prev.includes(levelId) 
        ? prev.filter(id => id !== levelId)
        : [...prev, levelId]
    )
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
        // Get Names
        const wilayaData = wilayas.find(w => w.code === selectedWilaya)
        const muniData = municipalities[selectedWilaya]?.find(m => m.id === selectedMunicipality)
        const instData = institutions[selectedMunicipality]?.find(i => i.id === selectedInstitution)
        
        // Map subject IDs to Names/Strings
        const subjectNames = selectedSubjects.map(id => {
            const s = subjectsList.find(sub => sub.id === id)
            return isRTL ? s?.nameAr || id : s?.name || id
        })

        // Map level IDs to Names
        const levelNames = selectedLevels.map(id => {
             const l = classesList.find(c => c.id === id)
             return l?.name || id
        })

      const newUser: User = {
        id: Math.floor(Math.random() * 1000) + 1,
        name,
        email,
        role,
        wilaya: isRTL ? wilayaData?.nameAr : wilayaData?.name,
        municipality: isRTL ? muniData?.nameAr : muniData?.name,
        institution: isRTL ? instData?.nameAr : instData?.name,
        
        // Optional fields based on role
        subjects: role === 'teacher' ? subjectNames : undefined,
        levels: role === 'teacher' ? levelNames : undefined,
        class: role === 'student' ? selectedClass : undefined,
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
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
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

        <form onSubmit={step === 1 ? handleNext : handleRegister}>
          <CardContent className="space-y-4">
            {step === 1 ? (
              <>
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
                <div className="space-y-2">
                    <Label>{t('auth.register.role')}</Label>
                    <Select value={role} onValueChange={(v: User['role']) => setRole(v)}>
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
                {/* Location Hierarchy */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>{t('auth.register.wilaya')}</Label>
                        <Select value={selectedWilaya} onValueChange={setSelectedWilaya} required>
                            <SelectTrigger>
                                <SelectValue placeholder={t('auth.register.selectWilaya')} />
                            </SelectTrigger>
                            <SelectContent>
                                {wilayas.map(w => (
                                    <SelectItem key={w.code} value={w.code}>
                                        {w.code} - {isRTL ? w.nameAr : w.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t('auth.register.municipality')}</Label>
                        <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality} disabled={!selectedWilaya} required>
                            <SelectTrigger>
                                <SelectValue placeholder={t('auth.register.selectMunicipality')} />
                            </SelectTrigger>
                            <SelectContent>
                                {selectedWilaya && municipalities[selectedWilaya]?.map(m => (
                                    <SelectItem key={m.id} value={m.id}>
                                        {isRTL ? m.nameAr : m.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>{t('auth.register.institution')}</Label>
                    <Select 
                        value={selectedInstitution} 
                        onValueChange={setSelectedInstitution} 
                        disabled={!selectedMunicipality || !institutions[selectedMunicipality]?.length} 
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={
                                !selectedMunicipality 
                                    ? t('auth.register.selectInstitution') 
                                    : !institutions[selectedMunicipality]?.length 
                                        ? "No institutions available" // Should be translated but hardcoded for safety now
                                        : t('auth.register.selectInstitution')
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedMunicipality && institutions[selectedMunicipality]?.map(i => (
                                <SelectItem key={i.id} value={i.id}>
                                    {isRTL ? i.nameAr : i.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {role === 'teacher' && (
                    <>
                        <div className="space-y-2">
                            <Label>{t('auth.register.subjects')}</Label>
                            <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                                {subjectsList.map(s => (
                                    <div key={s.id} className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox 
                                            id={`subject-${s.id}`} 
                                            checked={selectedSubjects.includes(s.id)}
                                            onCheckedChange={() => toggleSubject(s.id)}
                                        />
                                        <Label 
                                            htmlFor={`subject-${s.id}`} 
                                            className={cn("text-sm font-normal cursor-pointer flex-1", isRTL ? "mr-2" : "ml-2")}
                                        >
                                            {isRTL ? s.nameAr : s.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">{selectedSubjects.length} selected</p>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('auth.register.levels')}</Label>
                            <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                                {classesList.map(l => (
                                    <div key={l.id} className="flex items-center space-x-2 space-x-reverse">
                                        <Checkbox 
                                            id={`level-${l.id}`} 
                                            checked={selectedLevels.includes(l.id)}
                                            onCheckedChange={() => toggleLevel(l.id)}
                                        />
                                        <Label 
                                            htmlFor={`level-${l.id}`} 
                                            className={cn("text-sm font-normal cursor-pointer flex-1", isRTL ? "mr-2" : "ml-2")}
                                        >
                                            {l.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                             <p className="text-xs text-muted-foreground">{selectedLevels.length} selected</p>
                        </div>
                    </>
                )}

                {role === 'student' && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>{t('auth.register.class')}</Label>
                                <Select value={selectedClass} onValueChange={setSelectedClass} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('auth.register.selectClass')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classesList.map(c => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
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
